import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (err) {
        return reply.status(401).send({ message: "Token inválido ou expirado." });
    }
}

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as { role: string };
    
    if (user.role !== "ADMIN") {
        return reply.status(403).send({ message: "Acesso negado. Rota somente para administradores." });
    }
}
