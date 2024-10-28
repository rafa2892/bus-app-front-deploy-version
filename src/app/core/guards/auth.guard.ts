import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según la ubicación de tu servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {

    
    if (this.authService. isAuthenticated()) { 
      // Verifica si el usuario está logueado
      return true; // Permite el acceso a la ruta
    } else {
      this.router.navigate(['/login']); // Redirige al login si no está autenticado
      return false; // Deniega el acceso a la ruta
    }
  }
}
