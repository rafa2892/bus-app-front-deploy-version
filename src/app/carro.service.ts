import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Carro} from "./carro";


@Injectable({
  providedIn: 'root'
})
export class CarroService {

  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/carros";

  constructor(private httpClient : HttpClient) { }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaCarro():Observable<Carro[]> {
    return this.httpClient.get<Carro[]>(`${this.baseUrl}`);

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


}
