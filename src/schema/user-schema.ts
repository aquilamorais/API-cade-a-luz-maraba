import z, { object } from "zod";

export const userSchema = z.object(
    {
        name: z.string().min(3),
        email: z.email(),
        cpf: z.string().min(11), //continuar a formataçao
        password: z.string().min(8)
    }
)