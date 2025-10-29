<<<<<<< HEAD
import { prisma } from "../main/prisma.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import z from "zod"

// Criamos um tipo local que "recebe" os dados do Zod
type ComplaintData = z.infer<typeof complaintSchema>

// Função "tradutora"
function mapOptionToPrisma(option: ComplaintData['option']): "FALTOUENERGIA" | "OSCILACAO" | "INCENDIO" | "MANUTENCAO" {
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
            // Caso receba algo inesperado, podemos lançar um erro ou ter um padrão
            // Mas o Zod já deve ter barrado isso antes
            throw new Error("Opção de denúncia inválida");
    }
}

// O serviço agora recebe os dados E o ID do usuário que está logado
export const createComplaint = async (data: ComplaintData, userId: number) => {
    
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
            option: prismaOption, // Usamos a opção traduzida
            userId: userId // Ligando a denúncia ao usuário!
        }
    });

    return complaint;
}
export const getAllComplaints = async () => {
    const complaints = await prisma.complaint.findMany({
        // Opcional: ordenar da mais nova para a mais antiga
        orderBy: {
            createAt: 'desc'
        },
        // Opcional: incluir os dados do usuário que criou
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

// NOVO SERVIÇO: Para buscar UMA denúncia pelo ID
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

    // Primeiro, verifica se a denúncia existe
    const complaint = await prisma.complaint.findUnique({
        where: { id: id }
    });

    if (!complaint) {
        return null; // Retorna null se não encontrar
    }

    // Se existir, atualiza
    const updatedComplaint = await prisma.complaint.update({
        where: { id: id },
        data: {
            status: newStatus // Atualiza o status
        }
    });

    return updatedComplaint;
}

// Para DELETAR uma denúncia
export const deleteComplaint = async (id: number) => {

    // Verifica se a denúncia existe
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
=======
import { Complaint } from "../types/complaint.js";
import { randomUUID } from "crypto";
import { prisma } from "../main/prisma.js";
>>>>>>> 222ef07b558998999b0eed6a29482ba99101befe
