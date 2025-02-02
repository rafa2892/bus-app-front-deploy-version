import { Carro } from "./carro";

export class TituloPropiedad {
    id: number;
    nombre: string;
    apellido: string;
    observaciones: string;
    archivoPDF: File | null = null;
    archivoPDFnombre :string;
}
