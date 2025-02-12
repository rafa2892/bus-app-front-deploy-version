import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  authServiceAux : AuthService;

  constructor(private authService:AuthService, private router: Router){
    this.authServiceAux = this.authService;
  }
  
  title = 'Sistema de registro Transportes "Nombre Empresa"';

  logout():void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenthicated() : boolean {
    const token = this.authService.getToken();
    if (!token) {
      // Maneja el caso donde no hay token
      return false;
    }
    return this.authService.isTokenValid(token);
  }
}