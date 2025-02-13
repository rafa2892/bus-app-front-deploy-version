import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

    //Obtiene el listado de Carros en el back
    private apiUrl = environment.apiUrl;
    private completeURL = this.apiUrl.concat('/email/enviar');
  
  constructor(private http: HttpClient) {}

  enviarCorreo() {
    let destinatario = 'busappcontador@gmail.com';
    return this.http.post(`${this.completeURL}?destinatario=${destinatario}`, {}, { responseType: 'text' });
  }
}
