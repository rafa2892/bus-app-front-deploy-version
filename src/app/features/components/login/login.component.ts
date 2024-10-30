import { Component } from '@angular/core';
import { UserAuth } from '../../../core/models/user-auth';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

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
        this.router.navigate(['/viajes']);
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
  
  refreshToken() {
    //Implementacion refrescar token
    const refreshToken = this.authService.getRefreshToken();

    
    // const refreshedToken = this.authService.refreshToken(refreshToken);
    // console.log(refreshedToken);
    this.authService.refreshToken(refreshToken).subscribe({
   
      next: (response) => {
        this.authService.setToken(response.jwtToken);
        // this.authService.logout();
        localStorage.setItem('refreshToken', response.refreshToken);
        // Guarda el token
        // Redirige a otra página o realiza otra acción
        // this.router.navigate(['/viajes']);
      },
      error: (error) => {
        console.error('Error de login', error);
      }
    });
  }


  onSubmit(){
    this.onLogin();
      //   this.authServicio.login(this.userLogin).subscribe(dato => {
      //   });
        
      // }
  }

}