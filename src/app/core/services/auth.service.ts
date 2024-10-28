import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserAuth } from '../models/user-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/login';  // URL de tu backend
  constructor(private http: HttpClient, private router: Router) {}


  login(user:UserAuth): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user);
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

  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve verdadero si hay un token
  }
}
