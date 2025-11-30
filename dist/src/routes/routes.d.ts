import { FastifyTypedInstance } from "../main/types.js";
import z from "zod";
export declare const StatusEnum: z.ZodEnum<{
    ABERTO: "ABERTO";
    EM_ANDAMENTO: "EM_ANDAMENTO";
    RESOLVIDO: "RESOLVIDO";
}>;
export declare const paramsSchema: z.ZodObject<{
    id: z.ZodUUID;
}, z.z.core.$strip>;
export declare const updateStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        ABERTO: "ABERTO";
        EM_ANDAMENTO: "EM_ANDAMENTO";
        RESOLVIDO: "RESOLVIDO";
    }>;
}, z.z.core.$strip>;
export declare function routes(app: FastifyTypedInstance): Promise<void>;
//# sourceMappingURL=routes.d.ts.map