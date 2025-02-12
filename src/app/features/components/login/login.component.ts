import { Component } from '@angular/core';
import { UserAuth } from '../../../core/models/user-auth';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { GlobalUtilsService } from '../../../core/services/global-utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  userIconLogin = faUser;
  userLogin:UserAuth;
  camposFaltantes: string[] = [];  

  constructor(
    private authService:AuthService,
    private router: Router,
    private gs:GlobalUtilsService){}

  ngOnInit(): void {
    this.userLogin = new UserAuth();
  }

  onLogin(): void {

    this.authService.logout();


    const {usuario, clave} = this.userLogin;

    this.camposFaltantes = []; 
    
    // Verifica cada campo
    if (!usuario) this.camposFaltantes.push('usuario');
    if (!clave) this.camposFaltantes.push('password');

    const isValidForm = usuario && clave;

    if(isValidForm){
      this.authService.login(this.userLogin).subscribe({
        next: (response) => {
          this.authService.setToken(response.jwtToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.router.navigate(['/lista-viajes']);
        },
        error: (error) => {
          if (error.status === 401) {
            const msj = 'Usuario o contraseña invalida'
            this.camposFaltantes.push('usuario');
            this.camposFaltantes.push('password');
            this.gs.showErrorMessageSnackBar(msj);
          } else {
            const msj = 'Error del servidor al intentar acceso, comunicate con el administrador'
            this.gs.showErrorMessageSnackBar(msj);
          }
        }
      });
    }else {
        const msj = 'Debes rellenar los campos obligatorios'
        this.gs.showErrorMessageSnackBar(msj);
    }
  }

  removeErrorStyles(idElemento:string) {
    let element = document.getElementById(idElemento);
      if (element != null) {
        element.classList.remove('input-error');
      }
  }
  
  onSubmit(){
    this.onLogin();
  }
}