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

  //Este metodo nos funciona para obtener los listados de carro
  getHistorialDeActividades():Observable<Historial[]> {
    return this.httpClient.get<Historial[]>(`${this.baseurlhistorial}`);

  }

  //Este metodo obtiene un historial por id
  getHistorialPorId(id:number):Observable<Historial> {
    return this.httpClient.get<Historial>(`${this.baseurlhistorial}/${id}`);

  }
}