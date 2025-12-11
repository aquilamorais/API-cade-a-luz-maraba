import { FastifyRequest, FastifyReply } from "fastify";
import { Login } from "../types/login.js";
import { authenticateUser } from "../services/login.js";
import { FastifyTypedInstance } from "../main/types.js";

export async function handleLogin(request: FastifyRequest, reply: FastifyReply) {
    const app = request.server as FastifyTypedInstance;
    try {
        const user = await authenticateUser(request.body as Login, reply);
        if (!user) {
            return null;
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

export async function handleGetMe(request: FastifyRequest, reply: FastifyReply) {
    try {
        const user = request.user as { id: string; name: string; email: string; role: string };
        return reply.status(200).send(user);
    } catch (error) {
        console.error("Erro em GET /me:", error);
        return reply.status(500).send({ message: "Erro interno do servidor." });
    }
}
