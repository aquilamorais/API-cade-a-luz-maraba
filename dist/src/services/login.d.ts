import { Login } from "../types/login.js";
import { FastifyReply } from "fastify";
export declare const authenticateUser: (data: Login, reply: FastifyReply) => Promise<{
    id: string;
    createAt: Date;
    updateAt: Date;
    email: string;
    cpf: string;
    name: string;
    password: string;
    role: import("@prisma/client").$Enums.Role;
} | null>;
//# sourceMappingURL=login.d.ts.map