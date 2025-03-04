import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCirclePlus, faEdit, faEye, faHistory, faScrewdriverWrench, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Carro } from "../../../../core/models/carro";
import { AuthService } from '../../../../core/services/auth.service';
import { CarroService } from "../../../../core/services/carro.service";
import { ExcelService } from '../../../../core/services/excel-service.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
import { HistorialService } from '../../../../core/services/historial.service';
import { ViajeServicioService } from '../../../../core/services/viaje-servicio.service';
import { CardBusDetailComponent } from '../../modales/card-bus-detail/card-bus-detail.component';
import { PopupHistorialVehiculosComponent } from '../../modales/popup-historial-vehiculos/popup-historial-vehiculos.component';
import { TITLES } from '../../../../constant/titles.constants';
import { fontAwesomeIcons } from '../../../../../../dist/gestion-contador-frontend-no-standalone/browser/assets/fontawesome-icons';
declare var bootstrap: any;

@Component({
  selector: 'app-lista-carros',
  templateUrl: './lista-carros.component.html',
  styleUrl: './lista-carros.component.css',

})
export class ListaCarrosComponent {

  @Input() isModalMode = false; //Modal mode flag

  //Transmisores
  @Output() selectCarHandlerFromSon = new EventEmitter<any>();

  carros: Carro[];
  carrosFiltrados: Carro[]

  //ICONS
  editIcon = faEdit;
  deleteIcon = faTrash;
  historyIcon = faHistory;
  eyeIcon = faEye;
  faPlus = faCirclePlus;
  repairIcon = faScrewdriverWrench
  selectIcon = fontAwesomeIcons.selectIcon;

  carroSeleccionadoDetalles: Carro = new Carro;
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

  // Pagination variables
  p: number = 1;
  itemsPerPage = 10;
  totalItems = 10;  // Total items for pagination

  newHistorialId :number = 0;
  newCarId : number = 0;

  //Flag user is tipying
  private typingTimeout: any = null;

  //OrderBy variable
  orderBy = TITLES.CAR_DEFAULT_ORDER_BY_DATE// default order by numUni

  //Literals
  RESET_FILTER = TITLES.RESET_FILTER_TITLE_BUTTON;

  //tooltip init control
  private tooltipsInitialized = false;

  // Observable que emitirá los cambios en los filtros
  private searchSubject = 
      new BehaviorSubject
                  <{ marca: string, modelo: string, anyo: string, numeroUnidad:string }>({ marca: '', modelo: '', anyo: '', numeroUnidad:''});

  // Acceso al componente al modal hijo que se abre por js
  @ViewChild(PopupHistorialVehiculosComponent) childComponent!: PopupHistorialVehiculosComponent; 
  @ViewChild(CardBusDetailComponent) cardBus: CardBusDetailComponent;
 
 
  constructor(
    private authService:AuthService, 
    private carroServicio: CarroService, 
    private router: Router, 
    private route: ActivatedRoute,
    private globalUtilService:GlobalUtilsService,
    private excelService:ExcelService,
    private viajeService:ViajeServicioService,
    private historialService:HistorialService) {
  }

  ngOnInit(): void {

    // Comprobar si hay un 'state' al que se redirigió
    const navigationState = history.state;

    this.isLoading = true;

    this.route.params.subscribe(params => {

      const id = +params['id'];  

      if (id && navigationState && navigationState.redireccion) {
        // Resetea el estado de navegación
        window.history.replaceState({}, '', window.location.href);
        /* Recuperamos desde el registrar-historial si creamos un registro de mantenimeinto */
        this.verSoloMantenimiento = navigationState.verSoloRegistroMantenimiento ?? false;

        //Si hay una id, se ha guardado un historial nuevo
        const nuevoHistorialId = navigationState.nuevoHistorialId ?? null; // Recuperar el ID

        if(nuevoHistorialId){
          this.newHistorialId = nuevoHistorialId;
          this.globalUtilService.getSuccessfullMsj(TITLES.NEW_CAR_SUCCESSFUL_SAVED_MSJ)
        }
        this.obtenerCarroPorId(id, true);
      }else {
        this.obtenerCarros();
      }
    });

    const newCarId = this.route.snapshot.queryParams['newCarId'];
    // Check if there is a new entity saved to add styles
    if(newCarId) {
      const idCarro = Number(newCarId);
      this.newCarId = idCarro;
      this.limpiarURL();
    }
  }

  ngAfterViewInit(): void {
   this.initToolTip();
  }

  ngAfterViewChecked(): void {
  }

  ngOnDestroy(): void {
  }

  openHistorialModal() {
    this.verHistorial(this.carroSeleccionadoDetalles, this.verSoloMantenimiento, this.newHistorialId);
  }

  actualizarCarro(id: number) {
    const esEdicion = true; // O el valor que desees (true o false)
    this.disposeTooltip();
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
  
  async verHistorial(carroSelected: Carro, verSoloRegistroMantenimiento:boolean, nuevoHistialId:number) {

    this.isLoading = true;

    this.verSoloMantenimiento = verSoloRegistroMantenimiento;
    this.carroSeleccionadoDetalles = carroSelected;
    this.changeDetecterFlag = !this.changeDetecterFlag;


    this.childComponent.cleanInitMethod(carroSelected, verSoloRegistroMantenimiento, nuevoHistialId);
    
    // setTimeout(() => {}, 2000);

    // // Abrir el modal
    let modal = new bootstrap.Modal(document.getElementById('verHistorialPopUp')!);
    modal.show();

    //Remove the loader
    this.isLoading = false;
  }

  private obtenerCarroPorId(id: number, abrirModal: boolean = false) {
    this.isLoading = true;
    this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
      this.carroSeleccionadoDetalles = c;
      this.obtenerCarros();
      if (abrirModal) {
        this.openHistorialModal(); // Abre el modal después de asignar el carro
      }
    }).add(() => this.isLoading = false);
  }

  async eliminarCarro(id: number) {
    const borrar = await this.confirmaMensaje();
    if(borrar) {
        this.isLoading = true; //Triggers loading mode
        this.carroServicio.eliminarCarro(id).subscribe({
          next: () => {
            this.obtenerCarros();
          },
          error: (err) => {
            console.error('Error deleting car:', err);
            this.globalUtilService.showErrorMessageSnackBar('Hubo un error al intentar borrar, contacte con el administrador');
          },
          complete: () => {
            console.log('Car deletion request completed.');
            this.globalUtilService.getSuccessfullMsj("Vehiculo borrado satisfactoriamente")
          }
        }).add(() => this.isLoading = false);
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
    this.disposeTooltip();
    this.router.navigate(['/registrar-carro']);
  }

  onPageChange(page: number) {
    this.p = page;  // Actualiza el valor de la página actual
    if(this.marca || this.modelo || this.anyo || this.numeroUnidad) {
      this.filtrarListaCarrosPageable();
    } 
    else {this.obtenerCarros()}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onInputChange(): void {
    // Si ya hay un timeout en curso, lo cancelamos para reiniciar el contador de tiempo
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Establecemos un nuevo timeout para ejecutar el código después de 500ms de inactividad
    this.typingTimeout = setTimeout(() => {
      this.filtrarListaCarrosPageable()
    }, 500);
  }

  private obtenerCarros() {
    this.isLoading = true;
    this.disposeTooltip();
    this.carroServicio.obtenerListaCarroPageable(this.p -1, this.itemsPerPage, this.orderBy).subscribe({
      next: (response) => {
        this.carros = response.content;
        this.totalItems = response.totalElements;
        this.carrosFiltrados =  this.carros;
      },
      error: (error) => {
        console.error('Error al obtener la lista de carros:', error);
      },
      complete: () => {
        
      }
    }).add(() => { 
      this.isLoading = false;
      this.initToolTip();});
  }

  filtrarListaCarrosPageable() {
    this.isLoading = true;
    this.p = 1;

    this.searchSubject.next({ marca: this.marca, modelo: this.modelo, anyo: this.anyo, numeroUnidad:this.numeroUnidad});
    this.isLoading = true;  // Mostrar el loading solo después de la espera
    this.carroServicio.filtrarListaCarroPageable(
      this.p - 1, // Paginación funciona desde 0
      this.itemsPerPage,
      this.marca,
      this.modelo,
      this.anyo,
      this.numeroUnidad,
      this.orderBy
    ).subscribe({
      next: response => {
        this.carrosFiltrados = response.content;
        this.totalItems = response.totalElements;
      },
      error: (err) => {
        console.error('Error en la suscripción:', err);
      },
      complete: () => {
        console.log('La búsqueda ha finalizado');
      }
    }).add(() => { 
      this.isLoading = false;
      this.initToolTip();});
  }

  resetFilters() {
    if(this.marca || this.modelo || this.anyo || this.numeroUnidad ) {
      this.marca = '';
      this.modelo = '';
      this.anyo = '';
      this.numeroUnidad = '';
      this.obtenerCarros();
    }
  }

  getTitleOrderBy(): string | undefined{
    return TITLES.SORTER_BY_CARS.get(this.orderBy);
  }

  setSortBy(sortBy:string) {
    this.orderBy = sortBy;
    if(this.marca || this.modelo || this.anyo || this.numeroUnidad) {
        this.filtrarListaCarrosPageable();
    } 
    else {this.obtenerCarros();}
  }

  initToolTip() {
    setTimeout(() => this.globalUtilService.buildCustomsToolTipBS(), 50);
  }

  disposeTooltip() {
    this.initToolTip();
    this.globalUtilService.disposeCustomTooltips();
  }

  defaultOrderBy() {
    if(this.orderBy !== TITLES.CAR_DEFAULT_ORDER_BY_DATE) {
        this.orderBy = TITLES.CAR_DEFAULT_ORDER_BY_DATE;
        this.obtenerCarros();
    }
  }

  getStringDate(date:Date) {
    if(date) {
      return this.globalUtilService.getStringDate(date);
    }
    return '';
  }

  limpiarURL() {
    setTimeout(() => {
      this.globalUtilService.cleanUrlNewEntityStyle('newCarId');
      this.newCarId = 0; //Resete highlight variable, when new driver is registered
    }, 2500); // 3 segundos de duración
  }

  seleccionar(conductor:Carro) {
    this.selectCarHandlerFromSon.emit(conductor);
  }
  
 }