import { Carro } from "./carro";
import { Conductor } from "./conductor";
import { Ruta } from "./ruta";

export class Viaje {

    id:number;
    carro : Carro;
    fecha:Date;
    conductor:Conductor = new Conductor();
    comentarios:string;
    empresaServicioNombre:string = '';
    ruta: Ruta = new Ruta();
    dadoAltaUser : string = '';
    deletedDriver:string;
}
