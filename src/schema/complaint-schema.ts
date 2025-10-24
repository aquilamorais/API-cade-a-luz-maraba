import z from "zod"

const options = [
    'Faltou energia',
    'Oscilação de energia',
    'Incêndio',
    'Poste em manutenção'
] as const;

export const complaintSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(3).max(300),
    img: z.string().min(3),
    address: z.string().min(3),
    neighborhood: z.string().min(3),
    hour: z.coerce.date(),
    option: z.enum(options)
})