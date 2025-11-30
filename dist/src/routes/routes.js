import { userSchema, updateUserSchema } from "../schema/user-schema.js";
import { loginSchema } from "../schema/login-schema.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import z from "zod";
import { handleCreateUser, handleUpdateUser, handleLogin, handleGetAllUsers, handleGetUser, handleDeleteUser } from "../controllers/user.controller.js";
import { handleCreateComplaint, handleDeleteComplaint, handleGetAllComplaints, handleGetComplaintById, handleUpdateComplaintStatus } from "../controllers/complaint.controller.js";
export const StatusEnum = z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]);
export const paramsSchema = z.object({ id: z.uuid() });
export const updateStatusSchema = z.object({ status: StatusEnum });
export async function routes(app) {
    app.get('/teste', async (request, reply) => {
        return reply.status(200).send({ message: "Teste OK" });
    });
    app.get('/users/:cpf', {
        preHandler: [app.authenticate],
    }, handleGetUser);
    app.get('/users', {
        preHandler: [app.authenticate]
    }, handleGetAllUsers);
    app.patch('/users/:id', {
        schema: { body: updateUserSchema }
    }, handleUpdateUser);
    app.delete('/users/:cpf', handleDeleteUser);
    app.post('/users', {
        schema: { body: userSchema }
    }, handleCreateUser);
    app.post('/login', {
        schema: { body: loginSchema }
    }, handleLogin);
    app.post('/complaints', {
        preHandler: [app.authenticate],
        schema: { body: complaintSchema }
    }, handleCreateComplaint);
    app.get('/complaints', {
        preHandler: [app.authenticate]
    }, handleGetAllComplaints);
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
    app.get("/", async () => {
        return {
            name: "CadeALuzMaraba API",
            version: "1.0.0",
            timestamp: new Date().toISOString(),
            status: "success"
        };
    });
}
//# sourceMappingURL=routes.js.map