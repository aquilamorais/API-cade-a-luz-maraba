import { prisma } from "../main/prisma.js";
import { randomUUID } from "crypto";
const complaintId = randomUUID();
function mapOptionToPrisma(option) {
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
export const createComplaint = async (data, userId) => {
    const { title, description, img, address, neighborhood, hour, option } = data;
    const prismaOption = mapOptionToPrisma(option);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error("Usuário não encontrado.");
    const complaint = await prisma.complaint.create({
        data: {
            title,
            description,
            img,
            address,
            neighborhood,
            hour: new Date(hour),
            option: prismaOption,
            status: "ABERTO",
            user: { connect: { id: userId } }
        }
    });
    return {
        id: complaintId,
        title: complaint.title,
        description: complaint.description,
        img: complaint.img,
        address: complaint.address,
        neighborhood: complaint.neighborhood,
        hour: complaint.hour,
        createAt: complaint.createAt,
        updateAt: complaint.updateAt,
        status: complaint.status,
        option: complaint.option,
        userId: complaint.userId
    };
};
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
};
export const getComplaintById = async (complantid) => {
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
};
export const updateComplaintStatus = async (id, newStatus) => {
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
};
export const deleteComplaint = async (id) => {
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
};
//# sourceMappingURL=complaint.js.map