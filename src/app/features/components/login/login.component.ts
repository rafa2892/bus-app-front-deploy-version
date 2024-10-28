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
    this.authService.login(this.userLogin).subscribe({
   
      next: (response) => {
        this.authService.setToken(response.jwtToken); // Guarda el token
        // Redirige a otra página o realiza otra acción

        this.router.navigate(['/viajes']);
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