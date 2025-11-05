import { FastifyTypedInstance } from "../main/types.js";
import { userSchema, updateUserSchema } from "../schema/user-schema.js"; 
import { createUser } from "../services/user.js";
import { getUser } from "../services/user.js";
import { updateUser } from "../services/user.js";
import { deleteUser } from "../services/user.js"
import { getAllUsers } from "../services/user.js";
import { User } from "../types/user.js";
import { loginSchema } from "../schema/login-schema.js"; 
import { authenticateUser } from "../services/login.js";
import { complaintSchema } from "../schema/complaint-schema.js";
import { 
    createComplaint, 
    getAllComplaints, 
    getComplaintById, 
    updateComplaintStatus, 
    deleteComplaint 
} from "../services/complaint.js";
import z from "zod";

type JwtPayload = {
    id: number;
    role: string; 
}

export async function routes(app: FastifyTypedInstance){
    
    
    app.get('/teste', async (request, reply) => {
        return reply.status(200).send( 
            {message: "Teste OK"}
        )
    })


app.get('/users/:cpf', async (request, reply) => {
    const { cpf } = request.params as { cpf: string };
    try {
        const user = await getUser(cpf);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado.' });
        }
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        }
        return reply.send(userWithoutPassword);
    } catch (error) {
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
});


app.get('/users', async (request, reply) => {
    try {
        const users = await getAllUsers();
        const usersWithoutPassword = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        }));
        
        return reply.status(200).send(usersWithoutPassword);
    } catch (error) {
        console.error("Erro em GET /users:", error);
        
        return reply.status(500).send({ message: "Erro interno do servidor ao buscar usuários." });
    }

});

app.put('/users/:cpf', {
    schema: { body: updateUserSchema }
}, async (request, reply) => {
    const { cpf } = request.params as { cpf: string };
    const updatedData: Partial<User> = request.body as Partial<User>;
    try {
        const user = await updateUser(cpf, updatedData);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado para atualizar.' });
        }
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role
        };
        return reply.send(userWithoutPassword);
    } catch (error) {
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
});

app.delete('/users/:cpf', async (request, reply) => {
    const { cpf } = request.params as { cpf: string };
    try {
        const user = await deleteUser(cpf);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado para deletar.' });
        }
        return reply.send({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
});


    app.post('/users', {
        schema: { body: userSchema }
    } , async (request, reply) => {
        
        const userData: User = request.body;
        try {
            const user = await createUser(userData);
            if (!user) {
                return reply.status(400).send({ message: "Usuário com este e-mail já existe." });
            }
            const userWithoutPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                role: user.role
            }
            return reply.status(201).send(userWithoutPassword); 
        } catch (error) {
            console.error("Erro em POST /users:", error);
            return reply.status(500).send({ message: "Erro interno do servidor ao criar usuário." });
        }
    })

    app.post('/login', {
        schema: { body: loginSchema }
    }, async (request, reply) => {
        
        try {
            const user = await authenticateUser(request.body);
            if (!user) {
                return reply.status(401).send({ message: "E-mail ou senha inválidos." });
            }
            const token = app.jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role 
                },
                { expiresIn: "7 days" }
            );
            return reply.status(200).send({ token });
        } catch (error) {
            console.error("Erro em POST /login:", error);
            return reply.status(500).send({ message: "Erro interno do servidor ao fazer login." });
        }
    });

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
            params: z.object({ id: z.coerce.number().int() })
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

    app.put('/complaints/:id', {
        preHandler: [app.authenticate], 
        schema: {
            params: z.object({ id: z.coerce.number().int() }),
            body: z.object({
                
                status: z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]) 
            })
        }
    }, async (request, reply) => {
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
    });

    app.delete('/complaints/:id', {
        preHandler: [app.authenticate], 
        schema: {
            params: z.object({ id: z.coerce.number().int() })
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