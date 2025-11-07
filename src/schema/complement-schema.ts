import z from "zod";

export const complementSchema = z.object({
    neighborhood: z.string().min(3),
    address: z.string().min(3)
})