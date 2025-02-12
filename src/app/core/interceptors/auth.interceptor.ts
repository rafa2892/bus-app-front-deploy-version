import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; 
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refreshingToken = false; // Nuevo estado para evitar múltiples refrescos
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken() || '';
    const refreshToken = this.authService.getRefreshToken() || '';

    // Verifica si el token es válido antes de clonar la solicitud
    if (token && this.isTokenValid(token)) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      //Logica para manejar el refresco del token
      if (this.isTokenValid(token) && this.isTokenAboutToExpire(token) && this.isTokenValid(refreshToken)) {
        if (!this.refreshingToken) { // Verifica si ya se está refrescando el token
          console.log("refrescamos token");
          this.refreshingToken = true; // Marcar como refrescando
  
          return this.refreshToken().pipe(
            switchMap((newToken) => {
              this.refreshingToken = false; // Restablecer después de refrescar
              const newClonedRequest = clonedRequest.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(newClonedRequest);
            }),
            catchError((error) => {
              this.refreshingToken = false; // Restablecer en caso de error
              console.error('Error al refrescar el token', error);
              return next.handle(clonedRequest); // Continúa con la solicitud original si no se puede refrescar
            })
          );
        } else {
          console.warn("Ya se está refrescando el token"); // Advertencia si se intenta refrescar nuevamente
          return next.handle(clonedRequest); // Si ya estamos refrescando, simplemente manejamos la solicitud original
        }
      }
      else if(!this.authService.isTokenValid(token)) {
        this.authService.logout();
        this.redirectToLogin();
      }
      return next.handle(clonedRequest);
    }else {
      this.authService.logout();
      this.redirectToLogin();
    }
      return next.handle(req);
  }
  
  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.authService.getRefreshToken();
    return new Observable<string>((observer) => {
      this.authService.refreshToken(refreshToken).subscribe({
        next: (response) => {
          const newToken = response.refreshToken; // Asegúrate de que aquí sea el nuevo accessToken
          // this.authService.setToken(newToken);
          console.log(response.refreshToken);
          localStorage.setItem('token', response.refreshToken);
          observer.next(newToken);
          observer.complete();
        },
        error: (error) => {
          console.error('Error al refrescar el token', error);
          observer.error(error);
        }
      });
    });
  }

  isTokenValid(token: string): boolean {
    if (!token || token.split('.').length < 3) {
      // Verifica que el token no esté vacío y que tenga las tres partes de un JWT (header, payload, signature)
      return false;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp ? decodedToken.exp > Math.floor(Date.now() / 1000) : false;
    } catch (error) {
      console.error('Token inválido o error al decodificar', error);
      return false;
    }
  }

  isTokenAboutToExpire(token: string, bufferMinutes: number = 3): boolean {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = decodedToken.exp * 1000; 
    const currentTime = Date.now();
    const timeRemaining = expirationDate - currentTime;
    return timeRemaining <= bufferMinutes * 60 * 1000; 
  }
}
