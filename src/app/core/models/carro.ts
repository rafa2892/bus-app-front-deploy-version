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
  imagenes: Imagen []; // atributo que usa para el guardado de imagenes
  imagenesBd: Imagen []; // atributo de imagenes guardadas en la base de datos con id
  imagenesDecodificadas?: { url: string, id: number | undefined, imagenUrl: string, imagenDescr: string }[]; //Representa las imagenes ya codificadas de la BD

  registroHistorial : Historial [] = [];
  bateria: Bateria = new Bateria();
  poliza: Poliza;
  tituloPropiedad:TituloPropiedad;
  fechaAlta:Date;
  
}
