import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Historial } from '../models/historial';
import { RegistroActividad } from '../models/registro-actividad';

  @Injectable({
    providedIn: 'root'
  })
  export class RegistrosAuditoriaService {

    constructor(private httpClient : HttpClient) {  
    }

    //Obtiene el listado de Carros en el back
    private baseUrl = "http://localhost:8080/api/v1";

    //Obtiene el listado  registros
    private baseurlhistorial = this.baseUrl.concat('/registros'); 
  
    // Retrieves all activity audit records
    getAllActivityAudits(): Observable<RegistroActividad[]> {
      return this.httpClient.get<RegistroActividad[]>(`${this.baseurlhistorial}`);
    }
    
}
