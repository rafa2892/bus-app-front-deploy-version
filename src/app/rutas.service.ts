import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { Ruta } from './ruta';
import {HttpClient} from "@angular/common/http";
import { Estado } from './estado';


@Injectable({
  providedIn: 'root'
})
export class RutasService {

  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/rutas";


  constructor(private httpClient : HttpClient) { }


  obtenerListaRutas():Observable<Ruta[]> {
    return this.httpClient.get<Ruta[]>(`${this.baseUrl}`);
  
  }

  obtenerListaEstados():Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(`${this.baseUrl.concat('/estados')}`);
  
  }
}
