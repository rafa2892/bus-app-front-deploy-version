import { Bateria } from "./bateria";
import { Historial } from "./historial";
import { Imagen } from "./imagen";
import { Poliza } from "./poliza";
import { TituloPropiedad } from "./titulo-propiedad";

export class Carro {

  id:number;
  modelo:string;
  anyo:number;
  consumo:number;
  numeroUnidad:number;
  marca:string;
  tipoVehiculo:string;

  //Car objects attributes


  imagenes: Imagen [];
  imagenesBd: Imagen [];
  imegenesGuardar : Imagen [];
  imagenesProcesadas : Imagen [];
  imagenesDecodificadas?: { url: string, id: number | undefined, imagenUrl: string, imagenDescr: string }[];








  registroHistorial : Historial [] = [];
  bateria: Bateria = new Bateria();
  poliza: Poliza;
  tituloPropiedad:TituloPropiedad;
}
