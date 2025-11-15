import { FastifyTypedInstance } from "../main/types.js";
import { userSchema, updateUserSchema } from "../schema/user-schema.js"; 
import { User } from "../types/user.js";
import { loginSchema } from "../schema/login-schema.js"; 
import { complaintSchema } from "../schema/complaint-schema.js";
import { 
    createComplaint, 
    getAllComplaints, 
    getComplaintById, 
    updateComplaintStatus, 
    deleteComplaint,
} from "../services/complaint.js";
import z, { TypeOf } from "zod";
import {
    handleCreateUser,
    handleUpdateUser,
    handleLogin,
    handleGetAllUsers,
    handleGetUser,
    handleDeleteUser
} from "../controllers/user.controller.js";

type JwtPayload = {
    id: string;
    role: string; 
}

export const StatusEnum = z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]);

export async function routes(app: FastifyTypedInstance){
    
    
    app.get('/teste', async (request, reply) => {
        return reply.status(200).send( 
            {message: "Teste OK"}
        )
    })


    app.get('/users/:cpf',{
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
    } , handleCreateUser)


    app.post('/login', {
        schema: { body: loginSchema }
    }, handleLogin);
    

    app.post('/complaints', {
        preHandler: [app.authenticate], 
        schema: { body: complaintSchema }
    }, async (request, reply) => {
        try {
            const { id: userId } = request.user as JwtPayload; 
            const complaint = await createComplaint(request.body, userId);
            return reply.status(201).send(complaint);
        } catch (error) {
            console.error("Erro em POST /complaints:", error);
            return reply.status(500).send({ message: "Erro interno do servidor ao criar denúncia." });
        }
    });

    
    app.get('/complaints', async (request, reply) => {
        try {
            const complaints = await getAllComplaints();
            return reply.status(200).send(complaints);
        } catch (error) {
            console.error("Erro em GET /complaints:", error);
            return reply.status(500).send({ message: "Erro interno do servidor ao buscar denúncias." });
        }
    });

    app.get('/complaints/:id', {
        schema: {
            params: z.object({ id: z.uuid() })
        }
    }, async (request, reply) => {
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
    });

    app.patch('/complaints/:id', {
        preHandler: [app.authenticate], 
        schema: {
            params: z.object({ id: z.uuid() }),
            body: z.object({
                
                status: StatusEnum, 
            }),
        },
    }, async (request, reply) => {
        try {
            const { role } = request.user as JwtPayload; 
            
            if (role !== "ADMIN") { 
                return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
            }

            const { id } = request.params
            const { status } = request.body as { status: z.infer<typeof StatusEnum>};
            
            const updatedComplaint = await updateComplaintStatus(id, status);

            if (!updatedComplaint) {
                return reply.status(404).send({ message: "Denúncia não encontrada para atualizar." });
            }

            return reply.status(200).send(updatedComplaint);

        } catch (error) {
            console.error(`Erro em PUT /complaints/${request.params.id}:`, error);
            return reply.status(500).send({ message: "Erro interno do servidor ao atualizar denúncia." });
        }
    });

    app.delete('/complaints/:id', {
        preHandler: [app.authenticate], 
        schema: {
            params: z.object({ id: z.uuid() })
        }
    }, async (request, reply) => {
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
    });
    
}