import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private authService:AuthService, private router: Router){}
  title = 'Sistema de registro Transportes "Nombre Empresa"';

  logout():void {
    this.authService.logout();
  }

}
