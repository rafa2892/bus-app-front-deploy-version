  import { Injectable } from '@angular/core';
  import {HttpClient} from "@angular/common/http";
  import {Observable} from "rxjs";
  import { Historial } from '../models/historial';

  @Injectable({
    providedIn: 'root'
  })
  export class HistorialService {

    //Obtiene el listado de Carros en el back
    private baseUrl = "http://localhost:8080/api/v1";

      //Obtiene el listado  registros
    private baseurlhistorial = this.baseUrl.concat('/historial'); 

    constructor(private httpClient : HttpClient) { }

    //Este método obtiene un historial por id
    getHistorialPorId(id:number):Observable<Historial> {
      return this.httpClient.get<Historial>(`${this.baseurlhistorial}/${id}`);
    }

    registrarHistorial(historial:Historial) : Observable<Object> {
      return this.httpClient.post(`${this.baseurlhistorial}`, historial);
    }

    actualizarHistorial(historial:Historial) : Observable<Object> {
      return this.httpClient.put(`${this.baseurlhistorial}/${historial.id}`, historial);
    }

    obtenerTiposHistorial(): Observable<{ [key: string]: string }> {
    return this.httpClient.get<{ [key: number]: string }>(`${this.baseurlhistorial}/tiposRegistroHistorial`);
    }

    deleteHistorial(id:number) : Observable<Object>{
      return this.httpClient.delete(`${this.baseurlhistorial}/${id}`);
    }

    countByCarroId(id: number): Observable<number> {
      return this.httpClient.get<number>(`${this.baseurlhistorial}/countByCarro/${id}`);
    }

    obtenerHistorialBetweenDays(id:number, fechaInicio?: Date | null, fechaFin?: Date | null): Observable<Historial[]> {
      const params: any = {};
      if (fechaInicio) params.fechaInicio = fechaInicio;
      if (fechaFin) params.fechaFin = fechaFin;
    
      return this.httpClient.get<Historial[]>(`${this.baseurlhistorial}/betweenDates/${id}`, { params });
    }

    getHistoriesByCarroId(id:number): Observable<Historial[]> {
      return this.httpClient.get<Historial[]>(`${this.baseurlhistorial}/byCarro/${id}`);
    }
    
    
}