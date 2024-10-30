import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserAuth } from '../models/user-auth';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1';  // URL de tu backend
  constructor(private http: HttpClient, private router: Router) {}


  login(user:UserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }

  refreshToken(refreshToken: string | null): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, refreshToken);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve verdadero si hay un token
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

}
