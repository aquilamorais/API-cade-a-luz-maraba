import z from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
export declare const StatusEnum: z.ZodEnum<{
    ABERTO: "ABERTO";
    EM_ANDAMENTO: "EM_ANDAMENTO";
    RESOLVIDO: "RESOLVIDO";
}>;
type GetComplaintParams = {
    id: string;
};
export declare function handleCreateComplaint(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function handleGetAllComplaints(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function handleGetComplaintById(request: FastifyRequest<{
    Params: GetComplaintParams;
}>, reply: FastifyReply): Promise<never>;
export declare function handleUpdateComplaintStatus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function handleDeleteComplaint(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export {};
//# sourceMappingURL=complaint.controller.d.ts.map