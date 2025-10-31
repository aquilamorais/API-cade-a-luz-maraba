enum Option {
    FaltouEnergia = "Faltou energia",
    Oscilacao = "Oscilação de energia",
    Incendio = "Incêndio",
    Manutencao = "Poste em manutenção"
}

export type Complaint = {
    title: string
    description: string;
    img: string;
    address: string;
    neighborhood: string;
    hour: Date;
    option: Option;
}