import z from "zod";
import { FastifyTypedInstance } from "../main/types.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import {
    handleCreateComplaint,
    handleDeleteComplaint,
    handleGetAllComplaints,
    handleGetComplaintById,
    handleUpdateComplaintStatus,
    handleGetMyComplaints,
    handleUpdateComplaint
} from "../controllers/complaint.controller.js";

export const paramsSchema = z.object({ id: z.string().uuid() });
export const StatusEnum = z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]);
export const updateStatusSchema = z.object({ status: StatusEnum });

const updateComplaintSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(3).max(300).optional(),
    img: z.string().optional(),
    address: z.string().min(3).optional(),
    neighborhood: z.string().min(3).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    option: z.string().optional()
});

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

    app.put('/complaints/:id', {
        preHandler: [app.authenticate],
        schema: {
            params: paramsSchema,
            body: updateComplaintSchema
        }
    }, handleUpdateComplaint);

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
