import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { Carro } from "../../../core/models/carro";
import { CarroService } from "../../../core/services/carro.service";
import { ActivatedRoute, Router } from '@angular/router';
import { faCar, faEdit, faEye, faHistory, faPlus, faPlusCircle, faTrash, faScrewdriverWrench} from '@fortawesome/free-solid-svg-icons';
import { PopupHistorialVehiculosComponent } from '../popup-historial-vehiculos/popup-historial-vehiculos.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lista-carros',
  templateUrl: './lista-carros.component.html',
  styleUrl: './lista-carros.component.css',

})
export class ListaCarrosComponent {

  carros: Carro[];
  editIcon = faEdit;
  deleteIcon = faTrash;
  historyIcon = faHistory;
  eyeIcon = faEye;
  faPlus = faPlus;
  repairIcon = faScrewdriverWrench
  p: number = 1;
  carroSeleccionadoDetalles: Carro = new Carro;
  carro: Carro;
  
  @ViewChild(PopupHistorialVehiculosComponent) childComponent!: PopupHistorialVehiculosComponent; // Acceso al componente hijo
  constructor(private authService:AuthService, private carroServicio: CarroService, private router: Router, private route: ActivatedRoute, ) {
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.obtenerCarroPorId(id);
      }
    });
    this.obtenerCarros();
  }

  private obtenerCarroPorId(id: number) {
    this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
      this.carro = c;
    });
  }

  private obtenerCarros() {
    this.carroServicio.obtenerListaCarro().subscribe(carros => {
      this.carros = carros;
    });
  }

  actualizarCarro(id: number) {
    this.router.navigate(['actualizar-vehiculo', id])
  }

  detallesVehiculo(carroSelected: Carro) {
    this.carroSeleccionadoDetalles = carroSelected;
  }

  verHistorial(carroSelected: Carro, verSoloRegistroMantenimiento:boolean) {
    this.carroSeleccionadoDetalles = carroSelected;
    this.childComponent.cleanInitMethod(this.carroSeleccionadoDetalles, verSoloRegistroMantenimiento);
  }



  insertarRegistro(id: number) {
    this.router.navigate(['/nuevo-registro', id]);
  }

  eliminarCarro(id: any) {
    this.carroServicio.eliminarCarro(id).subscribe(dato => {
      this.obtenerCarros();
    })
  }

  refreshToken() {
    const refreshToken = this.authService.getRefreshToken();
  
    this.authService.refreshToken(refreshToken).subscribe({
      next: (response) => {
        // const newToken = response;
        // this.authService.setToken(newToken);
        // localStorage.setItem('refreshToken', response.refreshToken);
      },
      error: (error) => {
        console.error('Error de login', error);
      }
    });
  }


  // refreshToken(): Observable<string> {
  //   const refreshToken = this.authService.getRefreshToken();
  //   return this.authService.refreshToken(refreshToken).pipe(
  //     switchMap((response) => {
  //       const newToken = response.jwtToken;
  //       this.authService.setToken(newToken);
  //       localStorage.setItem('refreshToken', response.refreshToken);
  //       return of(newToken);
  //     })
  //   );
  // }
}