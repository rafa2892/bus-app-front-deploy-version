import { Historial } from "./historial";
import { Imagen } from "./imagen";

export class Carro {

  id:number;
  modelo:string;
  anyo:number;
  consumo:number;
  numeroUnidad:number;
  marca:string;
  tipoDeVehiculo:string;
  imagenes: Imagen [];
  imegenesGuardar : Imagen [];
  registroHistorial : Historial [] = [];
  
}
