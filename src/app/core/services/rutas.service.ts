import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { Ruta } from '../models/ruta'; 
import {HttpClient} from "@angular/common/http";
import { Estado } from '../models/estado';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class RutasService {

  //Obtiene el listado de Carros en el back
  private apiURL = environment.apiUrl;
  private completeURL = this.apiURL.concat('/rutas');


  constructor(private httpClient : HttpClient) { }


  obtenerListaRutas():Observable<Ruta[]> {
    return this.httpClient.get<Ruta[]>(`${this.completeURL}`);
  
  }

    //Este metodo nos funciona para regitrar una ruta
    registrarRuta(ruta:Ruta) : Observable<Object>{
      return this.httpClient.post(`${this.completeURL}`,ruta);
  
    }

  obtenerListaEstados():Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(`${this.completeURL.concat('/estados')}`);
  
  }
}
