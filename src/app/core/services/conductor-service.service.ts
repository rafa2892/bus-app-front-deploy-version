import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { Conductor } from '../models/conductor';



@Injectable({
  providedIn: 'root'
})
export class ConductorServiceService {
  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/conductores";
 
  constructor(private httpClient : HttpClient) {}

  obtenerListaConductores():Observable<Conductor[]> {
    return this.httpClient.get<Conductor[]>(`${this.baseUrl}`);
   }

}


 

  





