// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según tu estructura
import { jwtDecode } from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Obtiene el token del servicio de autenticación
    const token = this.authService.getToken() || '';
   
    if(token != undefined && token != null && token.length > 0) {
      if(this.isTokenAboutToExpire(token)) {
        //Refrescamos token 
        //Implementacion refrescar token
      }
    }

    // Si hay un token, clona la solicitud y añade el token al header de Authorization
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Añade el token al header de Authorization
        }
      });
      return next.handle(clonedRequest); // Envía la solicitud clonada con el token
    }
    return next.handle(req); // Continúa con la solicitud original si no hay token
  }

  isTokenAboutToExpire(token: string, bufferMinutes: number = 5): boolean {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = decodedToken.exp * 1000; // Convertir a milisegundos
    const currentTime = Date.now();
    const timeRemaining = expirationDate - currentTime;
    return timeRemaining <= bufferMinutes * 60 * 1000; // 5 minutos en milisegundos
  }

}
