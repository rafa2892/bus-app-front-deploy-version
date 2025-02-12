import { Component } from '@angular/core';
import { UserAuth } from '../../../core/models/user-auth';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userIconLogin = faUser;

  userLogin:UserAuth;
  constructor(private authService:AuthService, private router: Router){}

  ngOnInit(): void {
    this.userLogin = new UserAuth();
  }

  onLogin(): void {
    this.authService.logout();
    this.authService.login(this.userLogin).subscribe({
      next: (response) => {
        this.authService.setToken(response.jwtToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.router.navigate(['/lista-viajes']);
      },
      error: (error) => {
        if (error.status === 401) {
          alert('Credenciales inválidas. Por favor, intenta de nuevo.');
        } else {
          console.error('Error de login', error);
        }
      }
    });
  }
  
  onSubmit(){
    this.onLogin();
  }
}