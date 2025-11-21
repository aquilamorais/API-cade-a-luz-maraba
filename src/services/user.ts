import { User } from "../types/user.js";
import { hashPassword } from "../utils/argon2.js";
import { randomUUID } from "crypto";
import { prisma } from "../main/prisma.js";
import { FastifyReply } from "fastify";

export const createUser = async (data: User, reply: FastifyReply) => {
    const { name, password, email, cpf } = data;

    const userId = randomUUID();

    const haveUser = await prisma.user.findUnique({where: {email}});
    const haveCpf = await prisma.user.findUnique({where: {cpf}});

    if (haveUser) {
        reply.status(400).send({ message: "Usuário com este e-mail já existe." });
        return null;
    }

    if (haveCpf) {
        reply.status(400).send({ message: "Usuário com este CPF já existe." });
        return null;
    }
        

    const hashingPassword = await hashPassword(password);

    const user = await prisma.user.create(
        {
            data: {
                name,
                email: email.toLowerCase(),
                cpf, 
                password: hashingPassword,
                role: "MEMBER"
            }
        }
    )
    if (!user) {
        return null;
    }

    return {
        id: userId,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        password: user.password,
        role: user.role,
        createAt: user.createAt,
        updateAt: user.updateAt
    }
}

export const getUser = async (cpf: string) => {
    const user = await prisma.user.findUnique({
        where: { cpf },
        select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        complaints: {
            select: {
            id: true,
            title: true,
            description: true,
            neighborhood: true,
            address: true,
            hour: true,
            createAt: true,
            updateAt: true,
            option: true,
            status: true,
            },
        },
        },
    });
    return user;
};

export const updateUser = async (id: string, data: Partial<User>) => {
    const updatedUser = await prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, cpf: true, role: true },
    });
    return updatedUser;
};

export const deleteUser = async (cpf: string) => {
    const deletedUser = await prisma.user.delete({
        where: { cpf },
    });
    return deletedUser;
};

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            id: 'asc' 
        }
    });
    return users;
};