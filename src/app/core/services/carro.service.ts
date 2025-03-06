import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Carro } from '../models/carro';
import { TipoVehiculo } from '../models/tipo-vehiculo';
import { Historial } from '../models/historial';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root'
})
export class CarroService {
  

  //Obtiene el listado de Carros en el back
  private apiUrl = environment.apiUrl;
  private completeURL =  this.apiUrl.concat('/carros');

 
   //Obtiene el listado de tipo de vehiculos desde el controlador de Carro
  private baseUrlTipoVehiculos = this.completeURL.concat('/tipoVehiculos');

  //Obtiene el listado de tipos de historial
  private baseUrlGuardarHistorial = this.completeURL.concat('/guardarHistorial');

  imagenNotFound  = 'assets/no_image_avaible.jpg';

  constructor(private httpClient : HttpClient) { }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaCarro():Observable<Carro[]> {
    return this.httpClient.get<Carro[]>(`${this.completeURL}`);
  }

  obtenerListaCarroPageable(page?: number, size?: number, orderBy?:string): Observable<any> {
    const params: any = {};

    if (page) params.page = page;
    if (size) params.size = size;
    if (orderBy) params.orderBy = orderBy;

    return this.httpClient.get<Carro[]>(`${this.completeURL}/pageable`, {params});
  }

  // Método para obtener la lista de conductores con filtros
    filtrarListaCarroPageable(page?: number, size?: number, marca?: string, modelo?: string, anyo?: string, numeroUnidad?:string, orderBy?:string): Observable<any> {

      const params: any = {};
  
      if (page) params.page = page;
      if (size) params.size = size;
      if (marca) params.marca = marca;
      if (modelo) params.modelo = modelo;
      if (anyo) params.anyo = anyo;
      if (numeroUnidad) params.numeroUnidad = numeroUnidad;
      if (orderBy) params.orderBy = orderBy;

      return this.httpClient.get<Carro[]>(`${this.completeURL}/filter-pageable`, { params });
    }
    

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaTipoVehiculos():Observable<TipoVehiculo[]> {
    return this.httpClient.get<TipoVehiculo[]>(`${this.baseUrlTipoVehiculos}`);
  }

  //Este metodo nos funciona para regitrar un carro
  registrarCarro(carro:Carro) : Observable<Carro>{
    return this.httpClient.post<Carro>(`${this.completeURL}`, carro);
  }

  actualizarCarro(id:number, carro:Carro) : Observable<Carro>{
    return this.httpClient.put<Carro>(`${this.completeURL}/${id}`,carro);
  }

  eliminarCarro(id:number) : Observable<Object>{
    return this.httpClient.delete(`${this.completeURL}/${id}`);
  }

  obtenerCarroPorId(id: number): Observable<Carro> {
    return this.httpClient.get<Carro>(`${this.completeURL}/${id}`);
  }

  existeTituloPropiedadPdfFILE(id: number): Promise<boolean | undefined> {
    return this.httpClient.get<boolean>(`${this.completeURL}/existePDF/${id}`).toPromise();
  }
  

  descargarTituloPropiedad(id: number): void {
    
    this.httpClient.get(`${this.completeURL}/descargar/${id}`, { responseType: 'blob', observe: 'response' })
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
    return this.httpClient.get<boolean>(`${this.completeURL}/existe/${numeroUnidad}`);
  }

  verificarNumeroUnidadModoEdicion(numeroUnidad: number, carroId: number): Observable<boolean> {
    // Enviar ambos parámetros como query parameters
    return this.httpClient.get<boolean>(`${this.completeURL}/existeEdicion`, {
      params: { numeroUnidad: numeroUnidad.toString(), carroId: carroId.toString() }
    });
  }

  //Metodo utilidad
  getImagenUrl(carro: Carro) {

    if(carro != undefined && carro.imagenesBd != undefined && carro.imagenesBd.length >= 1) {

      //Declaracion del arreglo (imagenes del front)
        let imagenesDecodificadas: { url: string, id: number | undefined, imagenUrl: string, imagenDescr : string } [] = []; 

        // Establece isLoading en true al inicio

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
