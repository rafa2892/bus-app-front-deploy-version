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

  obtenerListaConductores():Observable<Conductor[]> {
    return this.httpClient.get<Conductor[]>(`${this.completeURL}`);
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
