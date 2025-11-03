import { FastifyRequest, FastifyReply } from "fastify";
import { User } from "../types/user.js";
import { Login } from "../types/login.js";
import { createUser } from "../services/user.js";
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

export async function handleLogin(request: FastifyRequest, reply: FastifyReply, app: FastifyTypedInstance) {
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