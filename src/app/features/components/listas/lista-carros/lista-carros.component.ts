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
import { forkJoin } from 'rxjs';
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
  // carro: Carro;
  changeDetecterFlag : boolean;
  carroId:number;
  modalManager : any;
  verSoloMantenimiento:boolean;

  numeroUnidad: string = '';
  modelo : string = '';
  anyo : string ='';
  marca : string = '';
  numeroViajes : number = 0;
  numeroHistorial : number = 0;

  //indicador de carga
  isLoading: boolean = false;

  
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
      const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { "show": 400, "hide": 150 } // Retraso en milisegundos
      });
      // Guardar el tooltip en una propiedad para poder eliminarlo más tarde
      tooltipTriggerEl.tooltipInstance = tooltip;
    });
  }

  disposeCustomTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl: any) {
      const tooltip = tooltipTriggerEl.tooltipInstance;
      if (tooltip) {
        tooltip.dispose();  // Elimina el tooltip
      }
    });
  }

  openHistorialModal() {
    this.verHistorial(this.carroSeleccionadoDetalles, this.verSoloMantenimiento);
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
    this.disposeCustomTooltips(); 
    this.router.navigate(['actualizar-vehiculo', id], { queryParams: { esEdicion } });
  }

  detallesVehiculo(carroSelected: Carro) {

    this.isLoading = true;

    this.carroServicio.obtenerCarroPorId(carroSelected.id).subscribe(c => {
    this.carroSeleccionadoDetalles = c;
    this.carroSeleccionadoDetalles.imagenesDecodificadas = this.carroServicio.getImagenUrl(this.carroSeleccionadoDetalles);
      
      // Usamos forkJoin para esperar a que ambas funciones se completen
      forkJoin([
        this.viajeService.countByCarroId(this.carroSeleccionadoDetalles.id),
        this.historialService.countByCarroId(this.carroSeleccionadoDetalles.id)
      ]).subscribe({
        next: ([viajesCount, historialCount]) => {
          // Asignamos los valores de las respuestas
          this.numeroViajes = viajesCount;
          this.numeroHistorial = historialCount;
  
          // Habilitar las opciones según el número de viajes y historial
          this.cardBus.isEnableViajes = this.numeroViajes > 0;
          this.cardBus.isEnableHistories = this.numeroHistorial > 0;
        },
        error: (error) => console.log(error),
        complete: () => {
          this.isLoading = false;
          // // Ahora que los datos están cargados, abrimos el modal
          let modal = new bootstrap.Modal(document.getElementById('card-bus-detail')!);
          modal.show();
        }
      });
    });
  }

  private obtenerCarroDetallesPorId(id: number): Promise<Carro> {
    return new Promise((resolve, reject) => {
      this.carroServicio.obtenerCarroPorId(id).subscribe({
        next: (c) => resolve(c),  // Resuelve la promesa con el carro obtenido
        error: (err) => reject(err),  // Rechaza la promesa si hay error
      });
    });
  }
  
  async verHistorial(carroSelected: Carro, verSoloRegistroMantenimiento:boolean) {
    this.isLoading = true;
    
    this.verSoloMantenimiento = verSoloRegistroMantenimiento;
    this.carroSeleccionadoDetalles = carroSelected;
    this.changeDetecterFlag = !this.changeDetecterFlag;

    const carroDetalles = await this.obtenerCarroDetallesPorId(this.carroSeleccionadoDetalles.id);
    this.childComponent.cleanInitMethod(carroDetalles, verSoloRegistroMantenimiento);
    
    // setTimeout(() => {}, 2000);

    // // Abrir el modal
    let modal = new bootstrap.Modal(document.getElementById('verHistorialPopUp')!);
    modal.show();

    //Remove the loader
    this.isLoading = false;
  }

  private obtenerCarroPorId(id: number, abrirModal: boolean = false) {
    this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
      this.carroSeleccionadoDetalles = c;
      if (abrirModal) {
        this.openHistorialModal(); // Abre el modal después de asignar el carro
      }
    });
  }


  insertarRegistro(id: number) {
    this.router.navigate(['/nuevo-registro', id]);
  }

  async eliminarCarro(id: number) {
    const borrar = await this.confirmaMensaje();
    if(borrar) {
        this.carroServicio.eliminarCarro(id).subscribe(dato => {
          this.obtenerCarros();
        });
    }
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