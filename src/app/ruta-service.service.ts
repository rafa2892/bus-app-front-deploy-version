import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ruta } from './ruta';

@Injectable({
  providedIn: 'root'
})
export class RutaServiceService {


  //Obtiene el listado de Carros en el back
  private baseUrl = "http://localhost:8080/api/v1/rutas";

  constructor(private httpClient : HttpClient) { }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaRuta():Observable<Ruta[]> {
    return this.httpClient.get<Ruta[]>(`${this.baseUrl}`);

  }

  
  //Este metodo nos funciona para regitrar un carro
  registrarRuta(ruta:Ruta) : Observable<Object>{
    return this.httpClient.post(`${this.baseUrl}`, ruta);

  }

  actualizarRuta(id:number, ruta:Ruta) {
    return this.httpClient.put(`${this.baseUrl}/${id}`,ruta);

  }

  eliminarRuta(id:number) : Observable<Object>{
        return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  obtenerRutaPorId(id: number): Observable<Ruta> {
    return this.httpClient.get<Ruta>(`${this.baseUrl}/${id}`);
  }





}
