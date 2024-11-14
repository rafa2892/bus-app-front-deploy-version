import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Carro } from '../models/carro';
import { TipoVehiculo } from '../models/tipo-vehiculo';
import { Historial } from '../models/historial';



@Injectable({
  providedIn: 'root'
})
export class CarroService {

  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/carros";

   //Obtiene el listado de tipo de vehiculos desde el controlador de Carro
  private baseUrlTipoVehiculos = this.baseUrl.concat('/tipoVehiculos');

  //Obtiene el listado de tipos de historial
  private baseUrlTiposHistorial = this.baseUrl.concat('/tiposHistorial'); 

  //Obtiene el listado de tipos de historial
  private baseUrlGuardarHistorial = this.baseUrl.concat('/guardarHistorial');

  constructor(private httpClient : HttpClient) { }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaCarro():Observable<Carro[]> {
    return this.httpClient.get<Carro[]>(`${this.baseUrl}`);

  }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaTipoVehiculos():Observable<TipoVehiculo[]> {
    return this.httpClient.get<TipoVehiculo[]>(`${this.baseUrlTipoVehiculos}`);
  }

  
  //Este metodo nos funciona para regitrar un carro
  registrarCarro(carro:Carro) : Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`, carro);

  }

  actualizarCarro(id:number, carro:Carro) {
    return this.httpClient.put(`${this.baseUrl}/${id}`,carro);

  }

  eliminarCarro(id:number) : Observable<Object>{
        return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  obtenerCarroPorId(id: number): Observable<Carro> {
    return this.httpClient.get<Carro>(`${this.baseUrl}/${id}`);
  }

  obtenerTiposHistorial(): Observable<{ [key: string]: string }> {
    return this.httpClient.get<{ [key: number]: string }>(this.baseUrlTiposHistorial);
  }


    
}
