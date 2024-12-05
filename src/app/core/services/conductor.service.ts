import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conductor } from '../models/conductor';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {

  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/conductores";

  constructor(private httpClient : HttpClient) {}

  obtenerListaConductores():Observable<Conductor[]> {
    return this.httpClient.get<Conductor[]>(`${this.baseUrl}`);
  }

  obtenerConductorPorId(id: number): Observable<Conductor> {
    return this.httpClient.get<Conductor>(`${this.baseUrl}/${id}`);
  }
  //Este metodo nos funciona para registrar un conductor
  registrarConductor(conductor:Conductor):Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`, conductor);
  }

  eliminar(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }
  

  editar(conductor:Conductor) : Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}`, conductor);
  }
}
