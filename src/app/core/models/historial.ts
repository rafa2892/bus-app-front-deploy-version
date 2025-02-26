import { Carro } from "./carro";
import { UsuarioLogin } from "./usuario-login";

export class Historial {

    id:number;
    idTipo:number;
    comentarios:string;
    descripcionTipo:string;
    dsHistorial:string;
    carro:Carro;
    fechaAlta:Date;
    userLogin:UsuarioLogin;
    byUser:string;
    viajeId:number;
}
