import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import { Historial } from '../models/historial';
import { RegistroActividad } from '../models/registro-actividad';
import { environment } from '../../../environments/environment.prod';

  @Injectable({
    providedIn: 'root'
  })
  export class RegistrosAuditoriaService {

    constructor(private httpClient : HttpClient) {  
    }

    //Obtiene el listado de Carros en el back
    private apiURL = environment.apiUrl;
    private completeURL = this.apiURL.concat('/registros');
  
    // Retrieves all activity audit records
    getAllActivityAudits(): Observable<RegistroActividad[]> {
      return this.httpClient.get<RegistroActividad[]>(`${this.completeURL}`);
    }

    //Este método nos funciona para obtener los listados de carro
    obtenerRegistrosAudPageable(page: number, size: number): Observable<any> {
      const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
  
        return this.httpClient.get<any>(`${this.completeURL}/pageable`, { params });
    }

    obtenerAuditBetweenDaysPageable(page:number, size: number, fechaInicio?: Date | null, fechaFin?: Date | null): Observable<any> {
      
        const params: any = {};
        if (fechaInicio) params.fechaInicio = fechaInicio;
        if (fechaFin) params.fechaFin = fechaFin;
        if (page) params.page = page;
        if (size) params.size = size;
      
        return this.httpClient.get<Historial[]>(`${this.completeURL}/betweenDates`, { params });
      }
    }
