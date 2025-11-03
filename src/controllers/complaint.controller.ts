import { FastifyRequest, FastifyReply } from "fastify";
import { 
    createComplaint, 
    getAllComplaints, 
    getComplaintById, 
    updateComplaintStatus, 
    deleteComplaint 
} from "../services/complaint.js";

type JwtPayload = {
    id: number;
    role: string; 
}


export async function handleCreateComplaint(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { id: userId } = request.user as JwtPayload; 
        // @ts-ignore - Ignorando o tipo 'Complaint' por simplicidade
        const complaint = await createComplaint(request.body, userId);
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

export async function handleGetComplaintById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
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

export async function handleUpdateComplaintStatus(request: FastifyRequest<{ Params: { id: number }; Body: { status: "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO" } }>, reply: FastifyReply) {
    try {
        const { role } = request.user as JwtPayload; 

        if (role !== "ADMIN") { 
            return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
        }

        const { id } = request.params;
        const { status } = request.body;

        const updatedComplaint = await updateComplaintStatus(id, status);

        if (!updatedComplaint) {
            return reply.status(404).send({ message: "Denúncia não encontrada para atualizar." });
        }

        return reply.status(200).send(updatedComplaint);

    } catch (error) {
        console.error(`Erro em PUT /complaints/${request.params.id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao atualizar denúncia." });
    }
}

export async function handleDeleteComplaint(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    try {
        const { role } = request.user as JwtPayload;
        if (role !== "ADMIN") { 
            return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
        }

        const { id } = request.params;
        const success = await deleteComplaint(id);

        if (!success) {
            return reply.status(404).send({ message: "Denúncia não encontrada para deletar." });
        }

        return reply.status(204).send(); 

    } catch (error) {
        console.error(`Erro em DELETE /complaints/${request.params.id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao deletar denúncia." });
    }
}