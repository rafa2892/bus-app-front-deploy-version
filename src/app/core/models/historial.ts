import { Carro } from "./carro";
import { Usuario } from "./usuario";

export class Historial {

    idTipo:number;
    comentarios:string;
    descripcionTipo:string;
    carro:Carro;
    fechaAlta:Date;
    usuario:Usuario;

}
