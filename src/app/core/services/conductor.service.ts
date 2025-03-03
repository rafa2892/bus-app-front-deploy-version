import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conductor } from '../models/conductor';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {

  //Obtiene el listado de Carros en el back
  private apiUrl = environment.apiUrl;
  private completeURL = this.apiUrl.concat('/conductores');

  constructor(private httpClient : HttpClient) {}

  obtenerListaConductores(page?: number, size?: number):Observable<any> {

    const params: any = {};
    if (page) params.page = page;
    if (size) params.size = size;

    return this.httpClient.get<Conductor[]>(`${this.completeURL}`, {params});

  }

  obtenerListaConductoresPageable(page?: number, size?: number, orderBy?:string):Observable<any> {

    const params: any = {};
    if (page) params.page = page;
    if (size) params.size = size;
    if (orderBy) params.orderBy = orderBy;
    return this.httpClient.get<Conductor[]>(`${this.completeURL}`, {params});
    
  }

    // Método para obtener la lista de conductores con filtros
    filtrarListaConductoresPageable(page?: number, size?: number, nombre?: string, apellido?: string, dni?: string, orderBy?:string): Observable<any> {

      const params: any = {};
  
      if (page) params.page = page;
      if (size) params.size = size;
      if (nombre) params.nombre = nombre;
      if (apellido) params.apellido = apellido;
      if (dni) params.dni = dni;
      if (orderBy) params.orderBy = orderBy;

      return this.httpClient.get<Conductor[]>(`${this.completeURL}/filter-pageable`, { params });
    }
  

  obtenerConductorPorId(id: number): Observable<Conductor> {
    return this.httpClient.get<Conductor>(`${this.completeURL}/${id}`);
  }
  //Este metodo nos funciona para registrar un conductor
  registrarConductor(conductor:Conductor):Observable<Object>{
    return this.httpClient.post(`${this.completeURL}`, conductor);
  }

  eliminar(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.completeURL}/${id}`);
  }
  
  editar(conductor:Conductor) : Observable<Object> {
    return this.httpClient.put(`${this.completeURL}/${conductor.id}`, conductor);
  }

  viajeCounter(id: number): Observable<number> {
    return this.httpClient.get<number>(`${this.completeURL}/viaje-counter/${id}`);
  }
}
