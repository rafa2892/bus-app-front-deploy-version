import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Viaje} from '../models/viaje';
import {Observable} from "rxjs";
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class ViajeServicioService {

  //Obtiene el listado de Carros en el back
  private apiURL = environment.apiUrl;
  private completeURL = this.apiURL.concat('/viajes');

  constructor(private httpClient : HttpClient) { }

  //Este método nos funciona para obtener los listados de carro
  obtenerListaViaje():Observable<Viaje[]> {
    return this.httpClient.get<Viaje[]>(`${this.completeURL}`);
  }

  //Este método nos funciona para obtener los listados de carro
  obtenerViajesPaginados(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      return this.httpClient.get<any>(`${this.completeURL}/pageable`, { params });
  }
  
  //Este método nos funciona para regitrar un carro
  registrarViaje(viaje:Viaje) : Observable<Object>{
    return this.httpClient.post(`${this.completeURL}`, viaje);
  }

  actualizarViaje(viaje:Viaje) : Observable<Object>{
    return this.httpClient.put(`${this.completeURL}/${viaje.id}`, viaje);
  }

  obtenerListaViajePorConductor(id: number): Observable<Viaje[]> {
    return this.httpClient.get<Viaje[]>(`${this.completeURL}/conductor/${id}`);
  }

  obtenerListaViajePorCarro(id: number): Observable<Viaje[]> {
    return this.httpClient.get<Viaje[]>(`${this.completeURL}/byCarro/${id}`);
  }

  countByCarroId(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.completeURL}/countByCarro/${id}`);
  }

  obtenerViajeById(id: number): Observable<Viaje> {
    return this.httpClient.get<Viaje>(`${this.completeURL}/${id}`);
  }

  eliminar(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.completeURL}/${id}`);
  }

  // En el servicio ViajeServicioService
  obtenerViajesFiltrados(
    numeroUnidad: number | null | undefined,
    conductorId: number | null | undefined,
    fechaDesde:string | null, 
    fechaHasta:string | null): Observable<Viaje[]> {

    const params = new URLSearchParams();

    if (numeroUnidad) params.append('numeroUnidad', numeroUnidad.toString());
    if (conductorId) params.append('conductorId', conductorId.toString());
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);

    // Construir la URL final
    const url = `${this.completeURL}/filtrar?${params.toString()}`;
    return this.httpClient.get<Viaje[]>(url);

  }

// frontend: obtenerViajesFiltradosPaginados
obtenerViajesFiltradosPaginados(
  numeroUnidad: number | null | undefined,
  conductorId: number | null | undefined,
  fechaDesde: string | null,
  fechaHasta: string | null,
  page: number,
  size: number
): Observable<any> {
  const params = new HttpParams()
    .set('numeroUnidad', numeroUnidad?.toString() || '')
    .set('conductorId', conductorId?.toString() || '')
    .set('fechaDesde', fechaDesde || '')
    .set('fechaHasta', fechaHasta || '')
    .set('page', page.toString())
    .set('size', size.toString());

  return this.httpClient.get<any>(`${this.completeURL}/filtrar-paginado`, { params });
}

  
  


  



}