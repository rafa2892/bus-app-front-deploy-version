import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
    
}
