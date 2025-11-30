import z from "zod";
import { createComplaint, getAllComplaints, getComplaintById, updateComplaintStatus, deleteComplaint } from "../services/complaint.js";
import { id } from "zod/locales";
export const StatusEnum = z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]);
export async function handleCreateComplaint(request, reply) {
    const complaintData = request.body;
    try {
        const { id: userId } = request.user;
        const complaint = await createComplaint(complaintData, userId);
        return reply.status(201).send(complaint);
    }
    catch (error) {
        console.error("Erro em POST /complaints:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao criar denúncia." });
    }
}
export async function handleGetAllComplaints(request, reply) {
    try {
        const complaints = await getAllComplaints();
        return reply.status(200).send(complaints);
    }
    catch (error) {
        console.error("Erro em GET /complaints:", error);
        return reply.status(500).send({ message: "Erro interno do servidor ao buscar denúncias." });
    }
}
export async function handleGetComplaintById(request, reply) {
    try {
        const { id } = request.params;
        const complaint = await getComplaintById(id);
        if (!complaint) {
            return reply.status(404).send({ message: "Denúncia não encontrada." });
        }
        return reply.status(200).send(complaint);
    }
    catch (error) {
        console.error(`Erro em GET /complaints/${request.params.id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao buscar denúncia." });
    }
}
export async function handleUpdateComplaintStatus(request, reply) {
    try {
        const { role } = request.user;
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
    }
    catch (error) {
        console.error(`Erro em PUT /complaints/${id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao atualizar denúncia." });
    }
}
export async function handleDeleteComplaint(request, reply) {
    try {
        const { role } = request.user;
        if (role !== "ADMIN") {
            return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
        }
        const { id } = request.params;
        const success = await deleteComplaint(id);
        if (!success) {
            return reply.status(404).send({ message: "Denúncia não encontrada para deletar." });
        }
        return reply.status(204).send();
    }
    catch (error) {
        console.error(`Erro em DELETE /complaints/${id}:`, error);
        return reply.status(500).send({ message: "Erro interno do servidor ao deletar denúncia." });
    }
}
//# sourceMappingURL=complaint.controller.js.map