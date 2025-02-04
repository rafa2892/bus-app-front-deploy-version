import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Carro } from '../models/carro';
import { TipoVehiculo } from '../models/tipo-vehiculo';
import { Historial } from '../models/historial';
import Swal from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class CarroService {
  

  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/carros";

   //Obtiene el listado de tipo de vehiculos desde el controlador de Carro
  private baseUrlTipoVehiculos = this.baseUrl.concat('/tipoVehiculos');

  //Obtiene el listado de tipos de historial
  private baseUrlTiposHistorial = this.baseUrl.concat('/tiposHistorial'); 

  //Obtiene el listado de tipos de historial
  private baseUrlGuardarHistorial = this.baseUrl.concat('/guardarHistorial');

  constructor(private httpClient : HttpClient) { }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaCarro():Observable<Carro[]> {
    return this.httpClient.get<Carro[]>(`${this.baseUrl}`);
  }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaTipoVehiculos():Observable<TipoVehiculo[]> {
    return this.httpClient.get<TipoVehiculo[]>(`${this.baseUrlTipoVehiculos}`);
  }

  
  //Este metodo nos funciona para regitrar un carro
  registrarCarro(carro:Carro) : Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`, carro);

  }

  actualizarCarro(id:number, carro:Carro) {
    return this.httpClient.put(`${this.baseUrl}/${id}`,carro);

  }

  eliminarCarro(id:number) : Observable<Object>{
        return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  obtenerCarroPorId(id: number): Observable<Carro> {
    return this.httpClient.get<Carro>(`${this.baseUrl}/${id}`);
  }

  obtenerTiposHistorial(): Observable<{ [key: string]: string }> {
    return this.httpClient.get<{ [key: number]: string }>(this.baseUrlTiposHistorial);
  }

  existeTituloPropiedadPdfFILE(id: number): Promise<boolean | undefined> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/existePDF/${id}`).toPromise();
  }
  

  // existeTituloPropiedadPdfFILE(id: number): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.httpClient.get<boolean>(`${this.baseUrl}/carros/existePDF/${id}`)
  //       .subscribe(
  //         response => resolve(response), // Retorna `true` o `false` según la respuesta del backend
  //         error => {
  //           console.error("Error al verificar la existencia del PDF:", error);
  //           resolve(false); // Retornar `false` en caso de error
  //         }
  //       );
  //   });
  // }

  descargarTituloPropiedad(id: number): void {
    
    this.httpClient.get(`${this.baseUrl}/descargar/${id}`, { responseType: 'blob', observe: 'response' })
      .subscribe(response => {

        const blob = response.body!;
        const dispositionHeader = response.headers.get('Content-Disposition');
        const nombreArchivo = dispositionHeader ? dispositionHeader.split('filename=')[1].replace(/"/g, '') : 'archivo.pdf'; // Asignar un valor predeterminado

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = nombreArchivo; 
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }
  
  verificarExistenciaPorNumeroUnidad(numeroUnidad: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/existe/${numeroUnidad}`);
  }

  verificarNumeroUnidadModoEdicion(numeroUnidad: number, carroId: number): Observable<boolean> {
    // Enviar ambos parámetros como query parameters
    return this.httpClient.get<boolean>(`${this.baseUrl}/existeEdicion`, {
      params: { numeroUnidad: numeroUnidad.toString(), carroId: carroId.toString() }
    });
  }


  //Metodo utilidad
  getImagenUrl(carro: Carro) {

    if(carro != undefined && carro.imagenesBd != undefined && carro.imagenesBd.length >= 1) {

      //Declaracion del arreglo (imagenes del front)
        let imagenesDecodificadas: { url: string, id: number | undefined, imagenUrl: string, imagenDescr : string } [] = []; 

        //Se itera sobre las imagenes, con un foreach declarativo para evitar errores
        carro.imagenesBd.forEach((imagen: { id: number | null, imagen: string, imagenDesc :string }) => {

          //Si las imagenes tienen id, es necesario para imagenes persistidas (FIXME)
          if (imagen.imagen && imagen.id) {
            let imagenDecodificada = atob(imagen.imagen);
            imagenesDecodificadas.push({ url: imagenDecodificada, id: imagen.id, imagenUrl: imagen.imagen, imagenDescr: imagen.imagenDesc });
          }
          //Añade las imagenes nuevas (no necesitan transformación)
          if (!imagen.id) {
            imagenesDecodificadas.push({ url: imagen.imagen, id: undefined, imagenUrl: imagen.imagen, imagenDescr: imagen.imagenDesc});
          }
        });


        return imagenesDecodificadas;
    }
    return [];
  }

  
  async msjConfirmaModal(title:string, text:string) : Promise<boolean>{
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      reverseButtons: true,
  });
  if (!result.isConfirmed) {
    return false; // Detenemos el flujo
  }else {
  return true;
  }
  }


}
