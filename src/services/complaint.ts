import { prisma } from "../main/prisma.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import { randomUUID } from "crypto";
import z from "zod"

type ComplaintPayload = z.infer<typeof complaintSchema>

function mapOptionToPrisma(option: ComplaintPayload['option']): "FALTOUENERGIA" | "OSCILACAO" | "INCENDIO" | "MANUTENCAO" {
    switch (option) {
        case "Faltou energia":
            return "FALTOUENERGIA";
        case "Oscilação de energia":
            return "OSCILACAO";
        case "Incêndio":
            return "INCENDIO";
        case "Poste em manutenção":
            return "MANUTENCAO";
        default:

            throw new Error("Opção de denúncia inválida");
    }
}

export const createComplaint = async (data: ComplaintPayload, userId: string) => {
    
    const { title, description, img, address, neighborhood, latitude, longitude, hour, option } = data;

  
    const prismaOption = mapOptionToPrisma(option);

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error("Usuário não encontrado.")

    const complaintId = randomUUID();

    const complaint = await prisma.complaint.create({
        data: {
            id: complaintId,
            title,
            description,
            img: img ?? null,
            address,
            neighborhood,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            hour: new Date(hour),
            option: prismaOption,
            status: "ABERTO",
            user: {connect: {id: userId}}
        }
    });

    return {
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        img: complaint.img,
        address: complaint.address,
        neighborhood: complaint.neighborhood,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        hour: complaint.hour,
        createAt: complaint.createAt,
        updateAt: complaint.updateAt,
        status: complaint.status,
        option: complaint.option,
        userId: complaint.userId
    };
}
export const getAllComplaints = async () => {
    const complaints = await prisma.complaint.findMany({

        orderBy: {
            createAt: 'asc'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
    return complaints;
}


export const getComplaintById = async (complantid: string) => {
    const complaint = await prisma.complaint.findUnique({
        where: {
            id: complantid
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    return complaint;
}

export const updateComplaintStatus = async (id: string, newStatus: "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO") => {

   
    const complaint = await prisma.complaint.findUnique({
        where: { id: id }
    });

    if (!complaint) {
        return null; 
    }

    const updatedComplaint = await prisma.complaint.update({
        where: { id: id },
        data: {
            status: newStatus 
        }
    });

    return updatedComplaint;
}

export const deleteComplaint = async (id: string) => {

    const complaint = await prisma.complaint.findUnique({
        where: { id: id }
    });

    if (!complaint) {
        return null; 
    }

    await prisma.complaint.delete({
        where: { id: id }
    });

    return true; 
}

export const getComplaintsByUserId = async (userId: string) => {
    const complaints = await prisma.complaint.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createAt: 'desc'
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    });
    return complaints;
}

type UpdateComplaintData = {
    title?: string;
    description?: string;
    img?: string;
    address?: string;
    neighborhood?: string;
    latitude?: number;
    longitude?: number;
    option?: string;
}

function mapOptionStringToPrisma(option: string): "FALTOUENERGIA" | "OSCILACAO" | "INCENDIO" | "MANUTENCAO" {
    switch (option) {
        case "Faltou energia":
            return "FALTOUENERGIA";
        case "Oscilação de energia":
            return "OSCILACAO";
        case "Incêndio":
            return "INCENDIO";
        case "Poste em manutenção":
            return "MANUTENCAO";
        default:
            return "FALTOUENERGIA";
    }
}

export const updateComplaint = async (id: string, userId: string, data: UpdateComplaintData) => {
    const complaint = await prisma.complaint.findUnique({
        where: { id: id }
    });

    if (!complaint) {
        return null;
    }

    if (complaint.userId !== userId) {
        throw new Error("Você não tem permissão para editar esta denúncia");
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.img !== undefined) updateData.img = data.img;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.neighborhood !== undefined) updateData.neighborhood = data.neighborhood;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.option !== undefined) updateData.option = mapOptionStringToPrisma(data.option);

    const updatedComplaint = await prisma.complaint.update({
        where: { id: id },
        data: updateData,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });

    return updatedComplaint;
}