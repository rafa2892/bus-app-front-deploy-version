import { Carro } from "./carro";

export class TituloPropiedad {
    id: number;
    nombre: string;
    apellido: string;
    observaciones: string;
    carro: Carro;  // Relación con la entidad Carro
}
