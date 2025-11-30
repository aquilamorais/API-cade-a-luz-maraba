import z from "zod";
export declare const complaintSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    img: z.ZodString;
    address: z.ZodString;
    neighborhood: z.ZodString;
    hour: z.z.ZodCoercedDate<unknown>;
    option: z.ZodEnum<{
        "Faltou energia": "Faltou energia";
        "Oscila\u00E7\u00E3o de energia": "Oscilação de energia";
        Incêndio: "Incêndio";
        "Poste em manuten\u00E7\u00E3o": "Poste em manutenção";
    }>;
}, z.z.core.$strip>;
//# sourceMappingURL=complaint-schema.d.ts.map