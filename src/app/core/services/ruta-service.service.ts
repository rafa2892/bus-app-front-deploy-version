import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ruta } from '../models/ruta';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RutaServiceService {


  //Obtiene el listado de Carros en el back
  private apiURL = environment.apiUrl;
  private completeURL = this.apiURL.concat('/rutas');
    

  constructor(private httpClient : HttpClient) { }

  //Este metodo nos funciona para obtener los listados de carro
  obtenerListaRuta():Observable<Ruta[]> {
    return this.httpClient.get<Ruta[]>(`${this.completeURL}`);

  }

  
  //Este metodo nos funciona para regitrar un carro
  registrarRuta(ruta:Ruta) : Observable<Object>{
    return this.httpClient.post(`${this.completeURL}`, ruta);

  }

  actualizarRuta(id:number, ruta:Ruta) {
    return this.httpClient.put(`${this.completeURL}/${id}`,ruta);

  }

  eliminarRuta(id:number) : Observable<Object>{
        return this.httpClient.delete(`${this.completeURL}/${id}`);
  }

  obtenerRutaPorId(id: number): Observable<Ruta> {
    return this.httpClient.get<Ruta>(`${this.completeURL}/${id}`);
  }





}
