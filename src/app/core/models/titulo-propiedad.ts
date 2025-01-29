import { Carro } from "./carro";

export class TituloPropiedad {
    id: number;
    nombre: string;
    apellido: string;
    descripcion: string;
    carro: Carro;  // Relación con la entidad Carro
}
