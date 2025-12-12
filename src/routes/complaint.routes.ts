import z from "zod";
import { FastifyTypedInstance } from "../main/types.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import {
    handleCreateComplaint,
    handleDeleteComplaint,
    handleGetAllComplaints,
    handleGetComplaintById,
    handleUpdateComplaintStatus,
    handleGetMyComplaints
} from "../controllers/complaint.controller.js";

export const paramsSchema = z.object({ id: z.string().uuid() });
export const StatusEnum = z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]);
export const updateStatusSchema = z.object({ status: StatusEnum });

export async function complaintRoutes(app: FastifyTypedInstance) {
    app.post('/complaints', {
        preHandler: [app.authenticate],
        schema: { body: complaintSchema }
    }, handleCreateComplaint);

    app.get('/complaints', {
        preHandler: [app.authenticate]
    }, handleGetAllComplaints);

    app.get('/complaints/my', {
        preHandler: [app.authenticate]
    }, handleGetMyComplaints);

    app.get('/complaints/:id', {
        schema: {
            params: paramsSchema
        }
    }, handleGetComplaintById);

    app.patch('/complaints/:id', {
        preHandler: [app.authenticate],
        schema: {
            params: paramsSchema,
            body: updateStatusSchema,
        },
    }, handleUpdateComplaintStatus);

    app.delete('/complaints/:id', {
        preHandler: [app.authenticate],
        schema: {
            params: paramsSchema
        }
    }, handleDeleteComplaint);
}
