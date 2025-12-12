import z from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
    getComplaintsByUserId,
    updateComplaint
} from "../services/complaint.js";
import { Complaint } from "../types/complaint.js";

type JwtPayload = {
    id: string;
    role: string; 
}
export const StatusEnum = z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]);

type GetComplaintParams = { id: string };

export async function handleCreateComplaint(request: FastifyRequest, reply: FastifyReply) {
    const complaintData = request.body as Complaint
    try {
        const { id: userId } = request.user as JwtPayload; 
        const complaint = await createComplaint(complaintData, userId);
        return reply.status(201).send(complaint);
    } catch (error) {
        console.error("Erro em POST /complaints:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao criar denúncia." });
    }
}

export async function handleGetAllComplaints(request: FastifyRequest, reply: FastifyReply) {
    try {
        const complaints = await getAllComplaints();
        return reply.status(200).send(complaints);
    } catch (error) {
        console.error("Erro em GET /complaints:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao buscar denúncias." });
    }
}

export async function handleGetComplaintById(request: FastifyRequest<{Params: GetComplaintParams}>, reply: FastifyReply) {
    try {
            const { id } = request.params;
            const complaint = await getComplaintById(id);

            if (!complaint) {
                return reply.status(404).send({ message: "Denúncia não encontrada." });
            }

            return reply.status(200).send(complaint);
        } catch (error) {
            console.error(`Erro em GET /complaints/${request.params.id}:`, error);
            return reply.status(500).send({ message: "Erro interno do servidor ao buscar denúncia." });
        }
}

export async function handleUpdateComplaintStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { role } = request.user as JwtPayload; 
        
        if (role !== "ADMIN") { 
            return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
        }

        const { id } = request.params as { id: string };
        const { status } = request.body as { status: z.infer<typeof StatusEnum> };
        
        const updatedComplaint = await updateComplaintStatus(id, status);

        if (!updatedComplaint) {
            return reply.status(404).send({ message: "Denúncia não encontrada para atualizar." });
        }

        return reply.status(200).send(updatedComplaint);

    } catch (error) {
        const { id } = request.params as { id: string };
        console.error(`Erro em PATCH /complaints/${id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao atualizar denúncia." });
    }
}

export async function handleDeleteComplaint(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { role } = request.user as JwtPayload;
        if (role !== "ADMIN") { 
            return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
        }

        const { id } = request.params as {id: string};
        const success = await deleteComplaint(id);

        if (!success) {
            return reply.status(404).send({ message: "Denúncia não encontrada para deletar." });
        }

        return reply.status(204).send(); 

    } catch (error) {
        const { id } = request.params as { id: string };
        console.error(`Erro em DELETE /complaints/${id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao deletar denúncia." });
    }
}

export async function handleGetMyComplaints(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id: userId } = request.user as JwtPayload;
        const complaints = await getComplaintsByUserId(userId);
        return reply.status(200).send(complaints);
    } catch (error) {
        console.error("Erro em GET /complaints/my:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao buscar suas denúncias." });
    }
}

type UpdateComplaintBody = {
    title?: string;
    description?: string;
    img?: string;
    address?: string;
    neighborhood?: string;
    latitude?: number;
    longitude?: number;
    option?: string;
}

export async function handleUpdateComplaint(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id: userId } = request.user as JwtPayload;
        const { id } = request.params as { id: string };
        const updateData = request.body as UpdateComplaintBody;

        const updatedComplaint = await updateComplaint(id, userId, updateData);

        if (!updatedComplaint) {
            return reply.status(404).send({ message: "Denúncia não encontrada." });
        }

        return reply.status(200).send(updatedComplaint);
    } catch (error: any) {
        if (error.message === "Você não tem permissão para editar esta denúncia") {
            return reply.status(403).send({ message: error.message });
        }
        const { id } = request.params as { id: string };
        console.error(`Erro em PUT /complaints/${id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao atualizar denúncia." });
    }
}