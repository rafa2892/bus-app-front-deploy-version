import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'http://localhost:8080/api/v1/email/enviar';

  constructor(private http: HttpClient) {}

  enviarCorreo() {
    let destinatario = 'busappcontador@gmail.com';
    return this.http.post(`${this.apiUrl}?destinatario=${destinatario}`, {}, { responseType: 'text' });
  }
}
