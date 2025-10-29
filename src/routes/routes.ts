import { FastifyTypedInstance } from "../main/types.js";
import { userSchema } from "../schema/user-schema.js"; 
import { createUser } from "../services/user.js";
import { User } from "../types/user.js";
import { loginSchema } from "../schema/login-schema.js"; 
import { authenticateUser } from "../services/login.js";
import { complaintSchema } from "../schema/complaint-schema.js";
// Importar TODOS os serviços de complaint
import { 
    createComplaint, 
    getAllComplaints, 
    getComplaintById, 
    updateComplaintStatus, 
    deleteComplaint 
} from "../services/complaint.js";
import z from "zod";

// TIPO PARA O PAYLOAD DO JWT
type JwtPayload = {
    id: number;
    role: string; // Adicionar role para checagem de Admin
    // ... outros campos que você colocou no token
}

export async function routes(app: FastifyTypedInstance){
    
    // Rota de Teste
    app.get('/teste', async (request, reply) => {
        return reply.status(200).send( // Usar 200 OK para teste
            {message: "Teste OK"}
        )
    })

    // --- ROTAS DE USUÁRIOS (USERS) ---

    // CRIAR USUÁRIO
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

    // LOGIN DO USUÁRIO
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
                    role: user.role // Incluir a role no token é crucial
                },
                { expiresIn: "7 days" }
            );
            return reply.status(200).send({ token });
        } catch (error) {
            console.error("Erro em POST /login:", error);
            return reply.status(500).send({ message: "Erro interno do servidor ao fazer login." });
        }
    });

    // --- ROTAS DE DENÚNCIAS (COMPLAINTS) ---

    // CRIAR DENÚNCIA (PROTEGIDA)
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

    // LER TODAS AS DENÚNCIAS (PÚBLICA)
    app.get('/complaints', async (request, reply) => {
        try {
            const complaints = await getAllComplaints();
            return reply.status(200).send(complaints);
        } catch (error) {
            console.error("Erro em GET /complaints:", error);
            return reply.status(500).send({ message: "Erro interno do servidor ao buscar denúncias." });
        }
    });

    // LER UMA DENÚNCIA PELO ID (PÚBLICA)
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

    // ATUALIZAR STATUS DA DENÚNCIA (PROTEGIDA - SÓ ADMIN)
    app.put('/complaints/:id', {
        preHandler: [app.authenticate], 
        schema: {
            params: z.object({ id: z.coerce.number().int() }),
            body: z.object({
                // Definir os status permitidos aqui também
                status: z.enum(["ABERTO", "EM_ANDAMENTO", "RESOLVIDO"]) 
            })
        }
    }, async (request, reply) => {
        try {
            const { role } = request.user as JwtPayload; 
            // !! IMPORTANTE: Certifique-se que a role "ADMIN" existe no seu banco
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

    // DELETAR DENÚNCIA (PROTEGIDA - SÓ ADMIN)
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

            return reply.status(204).send(); // 204 = No Content

        } catch (error) {
            console.error(`Erro em DELETE /complaints/${request.params.id}:`, error);
            return reply.status(500).send({ message: "Erro interno do servidor ao deletar denúncia." });
        }
    });
    
}

