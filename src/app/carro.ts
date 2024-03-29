import { Imagen } from "./imagen";

export class Carro {

  id:number;
  modelo:string;
  anyo:number;
  consumo:number;
  numeroUnidad:number;
  marca:string;

  imagenes: Imagen [];
  imegenesGuardar : Imagen [];
  
}
