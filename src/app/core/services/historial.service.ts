  import { Injectable } from '@angular/core';
  import {HttpClient, HttpParams} from "@angular/common/http";
  import {Observable} from "rxjs";
  import { Historial } from '../models/historial';
import { environment } from '../../../environments/environment.prod';

  @Injectable({
    providedIn: 'root'
  })
  export class HistorialService {

    //Obtiene el listado de Carros en el back
    private apiURL = environment.apiUrl;
    private completeURL = this.apiURL.concat('/historial');


    constructor(private httpClient : HttpClient) { }

    //Este método obtiene un historial por id
    getHistorialPorId(id:number):Observable<Historial> {
      return this.httpClient.get<Historial>(`${this.completeURL}/${id}`);
    }

    registrarHistorial(historial: Historial): Observable<Historial> {
      return this.httpClient.post<Historial>(`${this.completeURL}`, historial);
    }

    actualizarHistorial(historial:Historial) : Observable<Object> {
      return this.httpClient.put(`${this.completeURL}/${historial.id}`, historial);
    }

    obtenerTiposHistorial(): Observable<{ [key: string]: string }> {
    return this.httpClient.get<{ [key: number]: string }>(`${this.completeURL}/tiposRegistroHistorial`);
    }

    deleteHistorial(id:number) : Observable<Object>{
      return this.httpClient.delete(`${this.completeURL}/${id}`);
    }

    countByCarroId(id: number): Observable<number> {
      return this.httpClient.get<number>(`${this.completeURL}/countByCarro/${id}`);
    }

    obtenerHistorialBetweenDaysPageable(id:number, page:number, size: number, fechaInicio?: Date | null, fechaFin?: Date | null): Observable<any> {
      const params: any = {};
      if (fechaInicio) params.fechaInicio = fechaInicio;
      if (fechaFin) params.fechaFin = fechaFin;
      if (page) params.page = page;
      if (size) params.size = size;
    
      return this.httpClient.get<Historial[]>(`${this.completeURL}/betweenDates/${id}`, { params });
    }
    

    getHistoriesByCarroId(id:number): Observable<Historial[]> {
      return this.httpClient.get<Historial[]>(`${this.completeURL}/byCarro/${id}`);
    }

    //Este método nos funciona para obtener los listados de carro
    getHistoriesByCarroIdPageable(id:number, page: number, size: number): Observable<any> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
        return this.httpClient.get<any>(`${this.completeURL}/byCarroPageable/${id}`, { params });
    }
      
    
    
}