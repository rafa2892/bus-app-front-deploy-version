import { Component } from '@angular/core';
import { UserAuth } from '../../../core/models/user-auth';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userLogin:UserAuth;

  
  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.userLogin = new UserAuth();
  }

  onLogin(): void {

    console.log("On login()");
    this.authService.login(this.userLogin).subscribe({
   

      next: (response) => {
        console.log("HELLOOOO");
        console.log(response);
        this.authService.setToken(response.token); // Guarda el token
        // Redirige a otra página o realiza otra acción
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