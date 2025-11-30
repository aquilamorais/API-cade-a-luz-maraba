declare enum Option {
    FaltouEnergia = "Faltou energia",
    Oscilacao = "Oscila\u00E7\u00E3o de energia",
    Incendio = "Inc\u00EAndio",
    Manutencao = "Poste em manuten\u00E7\u00E3o"
}
export type Complaint = {
    title: string;
    description: string;
    img: string;
    address: string;
    neighborhood: string;
    hour: Date;
    option: Option;
};
export {};
//# sourceMappingURL=complaint.d.ts.map