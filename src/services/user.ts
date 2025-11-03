import { User } from "../types/user.js";
import { hashPassword, verifyPassword } from "../utils/argon2.js";
import { randomUUID } from "crypto";
import { prisma } from "../main/prisma.js";

export const createUser = async (data: User) => {
    const { name, password, email, cpf } = data;

    const haveUser = await prisma.user.findUnique({where: {email}});

    if (haveUser) {
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
                role: "member"
            }
        }
    )
    if (!user) {
        return null;
    }

    return {
        id: user.id,
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
    });
    return user;
};

export const updateUser = async (cpf: string, data: Partial<User>) => {
    const updatedUser = await prisma.user.update({
        where: { cpf },
    data,
    });
    return updatedUser;
};

export const deleteUser = async (cpf: string) => {
    const deletedUser = await prisma.user.delete({
        where: { cpf },
    });
    return deletedUser;
};
