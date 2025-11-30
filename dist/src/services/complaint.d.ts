import { complaintSchema } from "../schema/complaint-schema.js";
import z from "zod";
type ComplaintPayload = z.infer<typeof complaintSchema>;
export declare const createComplaint: (data: ComplaintPayload, userId: string) => Promise<{
    id: `${string}-${string}-${string}-${string}-${string}`;
    title: string;
    description: string;
    img: string | null;
    address: string;
    neighborhood: string;
    hour: Date;
    createAt: Date;
    updateAt: Date;
    status: import("@prisma/client").$Enums.Status;
    option: import("@prisma/client").$Enums.Option;
    userId: string;
}>;
export declare const getAllComplaints: () => Promise<({
    user: {
        email: string;
        name: string;
    };
} & {
    title: string;
    description: string;
    img: string | null;
    address: string;
    neighborhood: string;
    hour: Date;
    option: import("@prisma/client").$Enums.Option;
    id: string;
    createAt: Date;
    updateAt: Date;
    status: import("@prisma/client").$Enums.Status;
    userId: string;
})[]>;
export declare const getComplaintById: (complantid: string) => Promise<({
    user: {
        id: string;
        email: string;
        name: string;
    };
} & {
    title: string;
    description: string;
    img: string | null;
    address: string;
    neighborhood: string;
    hour: Date;
    option: import("@prisma/client").$Enums.Option;
    id: string;
    createAt: Date;
    updateAt: Date;
    status: import("@prisma/client").$Enums.Status;
    userId: string;
}) | null>;
export declare const updateComplaintStatus: (id: string, newStatus: "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO") => Promise<{
    title: string;
    description: string;
    img: string | null;
    address: string;
    neighborhood: string;
    hour: Date;
    option: import("@prisma/client").$Enums.Option;
    id: string;
    createAt: Date;
    updateAt: Date;
    status: import("@prisma/client").$Enums.Status;
    userId: string;
} | null>;
export declare const deleteComplaint: (id: string) => Promise<true | null>;
export {};
//# sourceMappingURL=complaint.d.ts.map