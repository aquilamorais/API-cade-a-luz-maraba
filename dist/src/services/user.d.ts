import { User } from "../types/user.js";
import { FastifyReply } from "fastify";
export declare const createUser: (data: User, reply: FastifyReply) => Promise<{
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    email: string;
    cpf: string;
    password: string;
    role: import("@prisma/client").$Enums.Role;
    createAt: Date;
    updateAt: Date;
} | null>;
export declare const getUser: (cpf: string) => Promise<{
    id: string;
    email: string;
    cpf: string;
    name: string;
    role: import("@prisma/client").$Enums.Role;
    complaints: {
        title: string;
        description: string;
        address: string;
        neighborhood: string;
        hour: Date;
        option: import("@prisma/client").$Enums.Option;
        id: string;
        createAt: Date;
        updateAt: Date;
        status: import("@prisma/client").$Enums.Status;
    }[];
} | null>;
export declare const updateUser: (id: string, data: Partial<User>) => Promise<{
    id: string;
    email: string;
    cpf: string;
    name: string;
    role: import("@prisma/client").$Enums.Role;
}>;
export declare const deleteUser: (cpf: string) => Promise<{
    id: string;
    createAt: Date;
    updateAt: Date;
    email: string;
    cpf: string;
    name: string;
    password: string;
    role: import("@prisma/client").$Enums.Role;
}>;
export declare const getAllUsers: () => Promise<{
    id: string;
    createAt: Date;
    updateAt: Date;
    email: string;
    cpf: string;
    name: string;
    password: string;
    role: import("@prisma/client").$Enums.Role;
}[]>;
//# sourceMappingURL=user.d.ts.map