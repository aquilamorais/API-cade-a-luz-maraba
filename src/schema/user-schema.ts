import z, { object } from "zod";

export const userSchema = z.object(
    {
        name: z.string().min(3),
        email: z.email(),
        cpf: z.string().min(11), 
        password: z.string().min(8)
    }
)

export const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    role: z.enum(["USER", "ADMIN"]).optional()
});