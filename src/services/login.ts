import { prisma } from "../main/prisma.js";
import { verifyPassword } from "../utils/argon2.js";
import { Login } from "../types/login.js";
import { FastifyReply } from "fastify";

export const authenticateUser = async (data: Login, reply: FastifyReply) => {
    const { email, password } = data;

   
    const emailUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
    });

    if (!emailUser) {
        reply.status(401).send({ message: "E-mail ou senha inválidos." });
        return null;
    }



    const isPasswordCorrect = await verifyPassword(emailUser.password, password);

    if (!isPasswordCorrect) {
        return null;
    }
    return emailUser;
}