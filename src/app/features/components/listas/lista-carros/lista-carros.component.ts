import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Carro } from "../../../../core/models/carro";
import { CarroService } from "../../../../core/services/carro.service";
import { ActivatedRoute, Router } from '@angular/router';
import { faEdit, faEye, faHistory, faPlus, faTrash, faScrewdriverWrench} from '@fortawesome/free-solid-svg-icons';
import { PopupHistorialVehiculosComponent } from '../../modales/popup-historial-vehiculos/popup-historial-vehiculos.component';
import { AuthService } from '../../../../core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
import { ExcelService } from '../../../../core/services/excel-service.service';
import { CardBusDetailComponent } from '../../modales/card-bus-detail/card-bus-detail.component';
import { ViajeServicioService } from '../../../../core/services/viaje-servicio.service';
import { HistorialService } from '../../../../core/services/historial.service';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-carros',
  templateUrl: './lista-carros.component.html',
  styleUrl: './lista-carros.component.css',

})
export class ListaCarrosComponent {

  carros: Carro[];
  carrosFiltrados: Carro[]
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
  modalManager : any;
  verSoloMantenimiento:boolean;

  numeroUnidad: string = '';
  modelo : string = '';
  anyo : string ='';
  marca : string = '';
  
  // Acceso al componente al modal hijo que se abre por js
  @ViewChild(PopupHistorialVehiculosComponent) childComponent!: PopupHistorialVehiculosComponent; 
  @ViewChild(CardBusDetailComponent) cardBus: CardBusDetailComponent;
 
 
  constructor(
    private modalService: NgbModal, 
    private authService:AuthService, 
    private carroServicio: CarroService, 
    private router: Router, 
    private route: ActivatedRoute,
    private globalUtilService:GlobalUtilsService,
    private excelService:ExcelService,
    private viajeService:ViajeServicioService,
    private historialService:HistorialService,
    private changeDetectorRef:ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // Comprobar si hay un 'state' al que se redirigió
    const navigationState = history.state;

    this.route.params.subscribe(params => {
      const id = +params['id'];  
      if (id && navigationState && navigationState.redireccion) {
        // Resetea el estado de navegación
        window.history.replaceState({}, '', window.location.href);
        
        /* Recuperamos desde el registrar-historial si creamos un registro de mantenimeinto */
        this.verSoloMantenimiento = navigationState.verSoloRegistroMantenimiento ?? false;
        this.obtenerCarroPorId(id, true);
      }
    });
    this.obtenerCarros();
  }

  ngAfterViewInit(): void {
    this.buildCustomsToolTipBS();
  }

  private tooltipsInitialized = false;
  
  ngAfterViewChecked(): void {
    if (!this.tooltipsInitialized && this.carros?.length) {
      this.buildCustomsToolTipBS();
      this.tooltipsInitialized = true;
    }
  }

  buildCustomsToolTipBS() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl: any) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { "show": 400, "hide": 150 } // Retraso en milisegundos
      });
    });
  }

  openHistorialModal(carro: Carro) {

    const modalRef = this.modalService.open(PopupHistorialVehiculosComponent, { 
      windowClass: 'modal-sinc-cuu', 
      size: 'lg'
    });

    modalRef.componentInstance.isModalProgramatico = true;
    modalRef.componentInstance.carro = this.carro;

    const verSoloRegMant = this.verSoloMantenimiento;
    modalRef.componentInstance.verSoloRegistroMantenimiento = verSoloRegMant;

    if(modalRef)
      this.modalManager = modalRef;
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
      this.carrosFiltrados = carros;
      setTimeout(() => this.buildCustomsToolTipBS(), 100); // Espera a que el DOM se actualice
    });
  }

  actualizarCarro(id: number) {
    const esEdicion = true; // O el valor que desees (true o false)
    this.router.navigate(['actualizar-vehiculo', id], { queryParams: { esEdicion } });
  }

  detallesVehiculo(carroSelected: Carro) {
      this.carroServicio.obtenerCarroPorId(carroSelected.id).subscribe(c => {
      this.carroSeleccionadoDetalles = c;
      this.carroSeleccionadoDetalles.imagenesDecodificadas = this.carroServicio.getImagenUrl(this.carroSeleccionadoDetalles);
      this.cardBus.isEnableViajes 
      this.countViajesByCarroId();
      this.countHistorialByCarroId();
    });
  }

  numeroViajes : number = 0;
  countViajesByCarroId() {
      this.viajeService.countByCarroId(this.carroSeleccionadoDetalles.id).subscribe({
      next: (c) => {
        this.numeroViajes = c;
        if(c > 0){
          this.cardBus.isEnableViajes = true
        }
        else{
          this.cardBus.isEnableViajes = false;
        }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Conductor cargado')
    });
  }

  numeroHistorial : number = 0;
  countHistorialByCarroId() {
      this.historialService.countByCarroId(this.carroSeleccionadoDetalles.id).subscribe({
      next: (h) => {
        this.numeroHistorial = h;
        if(h > 0) {
          this.cardBus.isEnableHistories = true
        }
        else{
          this.cardBus.isEnableHistories = false;
        }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Conductor cargado')
    });
  }
  

  verHistorial(carroSelected: Carro, verSoloRegistroMantenimiento:boolean) {
    
    this.verSoloMantenimiento = verSoloRegistroMantenimiento;
    this.carroSeleccionadoDetalles = carroSelected;
    this.changeDetecterFlag = !this.changeDetecterFlag;
    this.childComponent.cleanInitMethod(this.carroSeleccionadoDetalles, verSoloRegistroMantenimiento);

    //Indica si muestra todos los tipos de historiales o solo de mantenimiento
    // if(this.modalManager.componentInstance)
    //   {this.modalManager.componentInstance.verSoloRegistroMantenimiento = verSoloRegistroMantenimiento;}
  }

  insertarRegistro(id: number) {
    this.router.navigate(['/nuevo-registro', id]);
  }

  async eliminarCarro(id: number) {

  const borrar = await this.confirmaMensaje();

  if(borrar) {
      this.carroServicio.eliminarCarro(id).subscribe(dato => {
        this.obtenerCarros();
      })}
  }

  async confirmaMensaje(): Promise<boolean> {
    let title ='Eliminar vehiculo';
    let text = '<p>Se eliminara la unidad (vehiculo) <strong>PERMANENTEMENTE</strong> de la base de datos, ¿Desea continuar?</p>'

    const result = await this.globalUtilService.getMensajeConfirmaModal(title,text)

    if (!result.isConfirmed) {
      return false; // Detenemos el flujo
    }else {
      return true;
    }
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
  descargarExcel() {
    this.excelService.downloadExcel("carros");
  }

  getNumeroUnidadFormateado(numUnidad:number) { 
    return this.globalUtilService.getNumeroUnidadFormateado(numUnidad);
  }

  onBlurNumeroUnidad(idElemnto:string) {
    this.numeroUnidad = '';
    this.carrosFiltrados = this.carros;
    this.globalUtilService.quitarError(idElemnto)
  }

  onBlurAnyo(idElemnto:string) {
    this.globalUtilService.quitarError(idElemnto)
  }

  onInputChangeNumeroUnidad() {
    this.carrosFiltrados = this.carros.filter(carro => carro.numeroUnidad.toString() == this.numeroUnidad);
    if(this.numeroUnidad.trim() === '') {
      this.carrosFiltrados = this.carros;
    }
  }

  onInputChangeBrandFilter() {
    this.carrosFiltrados = this.carros;
    const marca = this.marca.trim().toLowerCase();
    const año = this.anyo.trim().toLowerCase();
    const modelo = this.modelo.trim().toLowerCase();

    this.carrosFiltrados = this.carros.filter(carro => {
        const marcaCoincide = marca === '' || carro.marca.toString().toLowerCase().includes(marca);
        const añoCoincide = año === '' || carro.anyo.toString().toLowerCase().includes(año);
        const modeloCoincide = modelo === '' || carro.modelo.toString().toLowerCase().includes(modelo);
        return marcaCoincide && añoCoincide && modeloCoincide;
    });
  }

  registerCarForm() {
    this.router.navigate(['/registrar-carro']);
  }


}