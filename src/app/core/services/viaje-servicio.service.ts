import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Viaje} from '../models/viaje';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ViajeServicioService {

    //Obtiene el listado de Carros en el back
    private baseUrl = "http://localhost:8080/api/v1/viajes";

    constructor(private httpClient : HttpClient) { }


obtenerListaViaje():Observable<Viaje[]> {
  return this.httpClient.get<Viaje[]>(`${this.baseUrl}`);

}

//Este metodo nos funciona para regitrar un carro
registrarViaje(viaje:Viaje) : Observable<Object>{
  return this.httpClient.post(`${this.baseUrl}`, viaje);

}

}