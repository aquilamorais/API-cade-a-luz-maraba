import z from "zod";
export declare const userSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    cpf: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<{
        ADMIN: "ADMIN";
        MEMBER: "MEMBER";
    }>>;
    cpf: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
//# sourceMappingURL=user-schema.d.ts.map