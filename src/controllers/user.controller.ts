import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../types/user.js";
import {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
} from "../services/user.js";

type JwtPayload = {
    id: string;
    role: string;
}

export async function handleCreateUser(request: FastifyRequest, reply: FastifyReply) {
    const userData: User = request.body as User; 
    try {
        const user = await createUser(userData, reply); 

        if (!user) {
            return null
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
}

export async function handleGetUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    try {
        const user = await getUser(id);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado.' });
        }
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            role: user.role,
            complaints: user.complaints
        }
        return reply.send(userWithoutPassword);
    } catch (error) {
        console.error("Erro em GET /users/:cpf:", error);
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
}

export async function handleGetAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { role } = request.user as JwtPayload;
        
        if (role !== "ADMIN") {
            return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
        }

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
}

export async function handleUpdateUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { id: currentUserId, role } = request.user as JwtPayload;
    const updatedData: Partial<User> = request.body as Partial<User>;
    
    try {
        if (role !== "ADMIN" && currentUserId !== id) {
            return reply.status(403).send({ message: "Você não tem permissão para editar este usuário." });
        }

        if (updatedData.role && role !== "ADMIN") {
            return reply.status(403).send({ message: "Somente administradores podem alterar o papel do usuário." });
        }

        const user = await updateUser(id, updatedData);
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
        console.error('Erro ao atualizar usuário:', error);
        return reply.status(500).send({
            message: 'Erro interno do servidor.',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export async function handleDeleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { id: currentUserId, role } = request.user as JwtPayload;
    
    try {
        if (role !== "ADMIN" && currentUserId !== id) {
            return reply.status(403).send({ message: "Você não tem permissão para deletar este usuário." });
        }

        const user = await deleteUser(id);
        if (!user) {
            return reply.status(404).send({ message: 'Usuário não encontrado para deletar.' });
        }
        return reply.send({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error("Erro em DELETE /users/:id:", error);
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
}