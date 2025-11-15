import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../types/user.js";
import { Login } from "../types/login.js";
import {
    createUser,
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
} from "../services/user.js";
import { authenticateUser } from "../services/login.js";


import { FastifyTypedInstance } from "../main/types.js";

export async function handleCreateUser(request: FastifyRequest, reply: FastifyReply) {
    const userData: User = request.body as User; 
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
}

export async function handleLogin(request: FastifyRequest, reply: FastifyReply) {
    const app = request.server as FastifyTypedInstance;
    try {
        const user = await authenticateUser(request.body as Login);
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
}

export async function handleGetUser(request: FastifyRequest, reply: FastifyReply) {
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
                role: user.role,
                complaints: user.complaints
            }
            return reply.send(userWithoutPassword);
        } catch (error) {
            return reply.status(500).send({ message: 'Erro interno do servidor.' });
        }      
}

export async function handleGetAllUsers(request: FastifyRequest, reply: FastifyReply) {
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
}

export async function handleUpdateUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string};
    const updatedData: Partial<User> = request.body as Partial<User>;
    try {
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
        return reply.status(500).send({ message: 'Erro interno do servidor.' });
    }
}

export async function handleDeleteUser(request: FastifyRequest, reply: FastifyReply){
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
}