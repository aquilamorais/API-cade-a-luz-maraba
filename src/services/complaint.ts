import { prisma } from "../main/prisma.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import z from "zod"
import { Complaint } from "../types/complaint.js";


type ComplaintData = z.infer<typeof complaintSchema>

function mapOptionToPrisma(option: Complaint['option']): "FALTOUENERGIA" | "OSCILACAO" | "INCENDIO" | "MANUTENCAO" {
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

export const createComplaint = async (data: Complaint, userId: number) => {
    
    const { title, description, img, address, neighborhood, hour, option } = data;

    // TRADUZIMOS A OPÇÃO AQUI
    const prismaOption = mapOptionToPrisma(option);

    const complaint = await prisma.complaint.create({
        data: {
            title,
            description,
            img,
            address,
            neighborhood,
            hour,
            option: prismaOption, 
            userId: userId 
        }
    });

    return complaint;
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


export const getComplaintById = async (id: number) => {
    const complaint = await prisma.complaint.findUnique({
        where: {
            id: id
        },
        include: {
            user: {
                select: {
                    name: true
                }
            }
        }
    });
    return complaint;
}

export const updateComplaintStatus = async (id: number, newStatus: "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO") => {

   
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

export const deleteComplaint = async (id: number) => {

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
