import { Component, ViewChild } from '@angular/core';
import { Carro } from "../../../core/models/carro";
import { CarroService } from "../../../core/services/carro.service";
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faEye, faHistory, faPlus, faTrash, faScrewdriverWrench} from '@fortawesome/free-solid-svg-icons';
import { PopupHistorialVehiculosComponent } from '../popup-historial-vehiculos/popup-historial-vehiculos.component';
import { AuthService } from '../../../core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  changeDetecterFlag : boolean;
  carroId:number;
  
  @ViewChild(PopupHistorialVehiculosComponent) childComponent!: PopupHistorialVehiculosComponent; // Acceso al componente hijo
 
 
  constructor(
    private modalService: NgbModal, 
    private authService:AuthService, 
    private carroServicio: CarroService, 
    private router: Router, 
    private route: ActivatedRoute, ) {
  }

  ngOnInit(): void {

    // Comprobar si hay un 'state' al que se redirigió
    const navigationState = history.state;

    this.route.params.subscribe(params => {
      const id = +params['id'];  
    
      if (id && navigationState && navigationState.redireccion) {
        // Resetea el estado de navegación
        window.history.replaceState({}, '', window.location.href); 
        // this.openHistorialModal(this.carro); // Abre el modal después de asignar el carro
        this.obtenerCarroPorId(id, true);
       }
    });
    this.obtenerCarros();
  }

  openHistorialModal(carro: Carro) {
    const modalRef = this.modalService.open(PopupHistorialVehiculosComponent); // Abre el modal
    modalRef.componentInstance.isModalProgramatico = true;
    modalRef.componentInstance.verSoloRegistroMantenimiento = true;
    modalRef.componentInstance.carro = this.carro;
  }

  private obtenerCarroPorId(id: number, abrirModal: boolean = false) {
    this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
      this.carro = c;
      if (abrirModal) {
        this.openHistorialModal(this.carro); // Abre el modal después de asignar el carro
      }
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
    this.changeDetecterFlag = !this.changeDetecterFlag;
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

}