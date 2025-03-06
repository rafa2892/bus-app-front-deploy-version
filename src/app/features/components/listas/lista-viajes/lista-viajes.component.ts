import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import { TITLES } from '../../../../constant/titles.constants';
import { Carro } from '../../../../core/models/carro';
import { Conductor } from '../../../../core/models/conductor';
import { Viaje } from "../../../../core/models/viaje";
import { CarroService } from '../../../../core/services/carro.service';
import { ConductorService } from '../../../../core/services/conductor.service';
import { EmailService } from '../../../../core/services/email-service.service';
import { ExcelService } from '../../../../core/services/excel-service.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
import { ViajeServicioService } from "../../../../core/services/viaje-servicio.service";
import { FiltrosAvanzadoViajesComponent } from '../../modales/filtros-avanzado-viajes/filtros-avanzado-viajes.component';
declare var bootstrap: any;


@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent {

    viajes: Viaje[];
    
    p: number = 1;
    itemsPerPage = 10;  // Example value, you can adjust as needed
    totalItems = 10;  // Total items for pagination


    editIcon = fontAwesomeIcons.editIcon;
    deleteIcon = fontAwesomeIcons.deleteIcon;
    eyeIcon = fontAwesomeIcons.eyeIcon;
    plusIcon = faCirclePlus;

    fechaDesde : Date | null;
    fechaHasta : Date | null;
    conductor :Conductor | null;
    carro : Carro | null;

    fechaDesdeStr : string  | null;
    fechaHastaStr : string  | null;

    //Banderas
    isSwitchFiltersOn :boolean;

    //viaje Seleccionado Detalles
    viajeSelDetails : Viaje;

    //Bandera modal de confirmación
    isModalConfirmacion: boolean = false;

    //spinner de carga
    loading = false;
    filterLoading = false;
    tipoExport : string | null = null;

    //new saved car id variable
    newCarId:number;

    //flag is initialized the tooltip styles 
    private tooltipsInitialized = false;

    //Literals
    FILTROS_TITULO_INPUT = TITLES.FILTROS_TITULO_INPUT;
    DESACTIVAR_FILTRO_TITULO = TITLES.SWITCH_BUTTON_FILTERS_DESACTIVE;
    ACTIVAR_FILTRO_TITULO  = TITLES.SWITCH_BUTTON_FILTERS_ACTIVE;
    RESETEAR_FILTRO_TITULO = TITLES.RESET_FILTER_TITLE_BUTTON;

    //LITERALES EXPORTAR EXCEL
    TIPO_EXPORT_ENTRE_FECHAS = TITLES.EXCEL_EXPORT_VIAJES_TYPE_BETWEEN_DATES;
    TIPO_EXPORT_DIA_ESPECIFICO = TITLES.EXCEL_EXPORT_VIAJES_TYPE_SPECIFIC_DAY;
    TIPO_EXPORT_TODAY = TITLES.EXCEL_EXPORT_VIAJES_TYPE_TODAY;
    TIPO_EXPORT_YESTERDAY = TITLES.EXCEL_EXPORT_VIAJES_TYPE_YESTERDAY;


    constructor(
      private viajeServicio:ViajeServicioService,
      private router:Router,
      private conductorService:ConductorService,
      private activatedRoute: ActivatedRoute,
      private _snackBar: MatSnackBar,
      private globalUtilsService : GlobalUtilsService,
      private modalService: NgbModal,
      private excelService: ExcelService,
      private emailService: EmailService,
      private carroService:CarroService) {
    }

    ngOnInit(): void {

      this.loading = true;

      //when idConductor param : Services by Conductor
      const idConductorStr = this.activatedRoute.snapshot.paramMap.get('idConductor');

      // when idCarro : Services by Carro
      const idCarroStr = this.activatedRoute.snapshot.paramMap.get('idCarro');

     // Mark new car as saved if one was successfully saved
      const newViajeId = this.activatedRoute.snapshot.queryParams['newViajeId'];

      // setTimeout(() => {}, 1000);
      
      //Convertimos el valor a número
      const idConductor = idConductorStr ? + idConductorStr : null;

      // Si se recibe un id de conductor, se filtran los viajes por ese conductor
      if(idConductor) {
        this.obtenerConductorPorId(idConductor);
      }else if(idCarroStr) {
        const idCarro = Number(idCarroStr); // Convierte a número
        this.carroService.obtenerCarroPorId(idCarro).subscribe({
          next: (dato) => {
            // Si el backend devuelve null, asignamos un array vacío
            this.carro = dato;
            this.getViajesFiltrados();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al obtener la lista de viajes:', error);
            this.viajes = []; // En caso de error, dejamos la lista vacía
            this.mostrarNotificacion('No se pudo cargar la lista de viajes.', 'error-snackbar');
          }
        });
      }else if(newViajeId) {
        this.newCarId = Number(newViajeId);
        this.globalUtilsService.cleanUrlNewEntityStyle("newViajeId");
        this.cargarViajes(); // Convierte a número
      }else {
        this.cargarViajes();
      }
    }

    ngAfterViewInit(): void {
      this.globalUtilsService.buildCustomsToolTipBS();
    }

    ngAfterViewChecked(): void {
      if (!this.tooltipsInitialized && this.viajes?.length) {
        this.globalUtilsService.buildCustomsToolTipBS();
        this.tooltipsInitialized = true;
      }
    }

    onPageChange(page: number) {
      this.filterLoading = true;
      this.p = page;  // Actualiza el valor de la página actual
      
      if(this.isSwitchFiltersOn) {
        this.getViajesFiltrados();
      }else {
        this.cargarViajes();
      }  // Recarga los viajes con la nueva página
    }

    cargarViajes() {
      this.viajeServicio.obtenerViajesPaginados(this.p - 1, this.itemsPerPage).subscribe({
        next: (response) => {
          this.viajes = response.content;  // Asumimos que el backend devuelve una propiedad 'content'
          this.totalItems = response.totalElements;  // Total de elementos (para la paginación)
        },
        error: (err) => {
          console.error('Error al cargar los viajes:', err);
        },
        complete: () => {
          console.log('Carga de viajes completada.', this.totalItems);
          this.loading = false;
          this.resetToolTips();
        }
      }).add(() => {
        this.filterLoading = false;
      });
    }

    private resetToolTips(){
      this.globalUtilsService.disposeCustomTooltips();
      this.tooltipsInitialized=false;
    }

    private obtenerConductorPorId(idConductor: number) {
      this.loading = true;
      // Ejecutamos ambas peticiones en paralelo con forkJoin
      forkJoin({
        conductor: this.conductorService.obtenerConductorPorId(idConductor),
      }).subscribe({
        next: (result) => {
          this.conductor = result.conductor;
          this.getViajesFiltrados();
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        },
        complete: () => {
          console.log('Datos obtenidos correctamente.');
        }
      }).add(() => this.loading = false);
    }
    
    detallesViaje(viaje:Viaje) {
      this.viajeSelDetails = { ...viaje }; 
        //Ahora que los datos están cargados, abrimos el modal
        this.globalUtilsService.abrirModalProgramatico('confirma-servicio-modal');
    }

    //CRUD
    editar(viaje:Viaje) {
      this.globalUtilsService.disposeCustomTooltips();
      this.router.navigate(['/registrar-viaje', viaje.id]);
    }

    async eliminar(viaje:Viaje){
      const eliminarConfirmado = await this.eliminarViaje(viaje);

      if (eliminarConfirmado) {
        this.viajeServicio.eliminar(viaje.id).subscribe({
          next: () => {
            this.mostrarNotificacion('Viaje eliminado con éxito.', 'success-snackbar');
            this.cargarViajes();
          },
          error: (error) => {
            console.error('Error al eliminar el viaje:', error); // Registro para depuración
            this.mostrarNotificacion('Ocurrió un error al eliminar el viaje. Por favor, inténtelo más tarde.', 'error-snackbar');
          }
        });
      }
    }

    // Método centralizado para mostrar notificaciones
    private mostrarNotificacion(mensaje: string, estilo: string): void {
      this._snackBar.open(mensaje, '', {
        duration: 3000, // Duración ajustable según necesidad
        panelClass: [estilo],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }

    async eliminarViaje(viaje:Viaje): Promise<boolean> {

      let nombreConductorAux = '';

      if(!viaje.conductor) {
          nombreConductorAux = viaje.deletedDriver;
      }
      else {
          nombreConductorAux = `${viaje.conductor.nombre} ${viaje.conductor.apellido}`;
      }

      const texto = `
      <div class="prueba" style="margin-bottom: -1px;"><strong>Servicio num:</strong> ${viaje.id}</div><br>
      <div><strong>Salida:</strong> ${viaje.ruta.estadoOrigen}, ${viaje.ruta.ciudadOrigen}</div><br>
      <div><strong>Destino:</strong> ${viaje.ruta.estadoDestino}, ${viaje.ruta.ciudadDestino}</div><br>

      <div style="margin-bottom: -1px;"><strong>Vehículo Num Unidad:</strong> 
          ${this.globalUtilsService.getNumeroUnidadFormateado(viaje.carro.numeroUnidad)}</div><br>
          
      <div style="margin-bottom: -1px;"><strong>Conductor:</strong> ${nombreConductorAux}</div>
    `;
      const result = await Swal.fire({
          title: 'Confirma eliminar servicio',
          html: texto,
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Atras',
          confirmButtonText: 'Eliminar',
          reverseButtons: true,
      });
      if (!result.isConfirmed) {
        return false; // Detenemos el flujo
      }else {
      return true;
      }
    }

    getNumeroUnidadFormateado(numeroUnidad:number) : string {
      return this.globalUtilsService.getNumeroUnidadFormateado(numeroUnidad);
    }

    applyFilterHandlerFromSon(){
      this.filterLoading = true;
      this.getViajesFiltrados();
    }

    abrirModalFiltros(): void {
      const modalRef = this.modalService.open(FiltrosAvanzadoViajesComponent);
      this.sincroDataWithFilterModal(modalRef);
    }

    sincroDataWithFilterModal(modalRef:any) {

      // Pasamos los valores actuales de los filtros al modal
      if(this.fechaDesde) {
        modalRef.componentInstance.fechaDesde = this.fechaDesde;
        modalRef.componentInstance.selectedDateFormat(this.fechaDesde, 'desde')
      }

      if(this.fechaHasta) {
        modalRef.componentInstance.fechaHasta = this.fechaHasta;
        modalRef.componentInstance.selectedDateFormat(this.fechaHasta, 'hasta')
      }

      if(this.conductor) {
        modalRef.componentInstance.conductor = this.conductor;
        modalRef.componentInstance.selectedConductorHandler(this.conductor);
      }

      if(this.carro) {
        modalRef.componentInstance.carro = this.carro;
        modalRef.componentInstance.selectedVehiculoHandler(this.carro);
      }
      this.eventModalHandler(modalRef);
    }

    eventModalHandler(modalRef:any) {

      modalRef.componentInstance.applyFiltersHandler.subscribe((viajesFiltrados: Viaje []) => {
        
      // Dates displayed in the date-picker
      this.fechaDesde = modalRef.componentInstance.fechaDesde;
      this.fechaHasta = modalRef.componentInstance.fechaHasta;

      // String dates that will be sent to the back-end
      this.fechaDesdeStr = modalRef.componentInstance.fechaDesdeStr;
      this.fechaHastaStr = modalRef.componentInstance.fechaHastaStr;

      this.conductor = modalRef.componentInstance.conductor;
      this.carro = modalRef.componentInstance.carro;
      this.viajes = modalRef.componentInstance.viajesFiltrados;

      this.applyFilterHandlerFromSon(); 
    });

      // Aquí te suscribes al evento 'confirmar' del componente hijo (PopupMensajeConfirmarViajeComponent)
      modalRef.componentInstance.cleanFilters.subscribe(() => {
      this.resetFilters(); 
      });
  }

    // Monitorear cambios en el estado del interruptor
    switchHandler() {
      // // Si filtros cargados va a bbdd nuevamente
      const isAnyParameterToFilterBy = this.carro ||  this.conductor ||  this.fechaDesdeStr || this.fechaHastaStr; 
      const isSwitchFilterOn = this.isSwitchFiltersOn;

      if(isAnyParameterToFilterBy) {
          this.filterLoading = true;
      }
      
      if(!isSwitchFilterOn || !isAnyParameterToFilterBy && isSwitchFilterOn) {
        this.cargarViajes();
      }else if(isAnyParameterToFilterBy && isSwitchFilterOn){
        this.getViajesFiltrados();
      }
    }

    resetFilters(): void {
      
      this.filterLoading = true;
      this.fechaDesde = null;
      this.fechaHasta = null;
      this.carro = null;
      this.conductor = null;
      this.fechaDesdeStr = null;
      this.fechaHastaStr = null;
      this.isSwitchFiltersOn = false

      this.cargarViajes();
    }

    // Método para buscar los viajes filtrados
    getViajesFiltrados() {
      this.viajeServicio.obtenerViajesFiltradosPaginados(
        this.carro?.numeroUnidad, this.conductor?.id, this.fechaDesdeStr, this.fechaHastaStr, this.p - 1, this.itemsPerPage)
        .subscribe({
          next: (response) => {
            this.viajes = response.content;
            this.totalItems = response.totalElements;
            this.isSwitchFiltersOn = true;
          },
          error: (error) => {
            console.error('Error al obtener los viajes:', error);
            if (error.status === 404) {
              this._snackBar.open('No se encontraron registros con los parámetros seleccionados.', '', {
                duration: 5000,
                panelClass: ['error-snackbar'],
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
            }
        },
        complete: () => {
          this.modalService.dismissAll();
          this.resetToolTips();
        }
      }).add(() => {
        this.filterLoading = false;
      });
    }
    
    downloadExcel() {
      if(this.tipoExport) {
        this.excelService.downloadExcel(this.tipoExport);
      }
    }

    enviarCorreo() {
      this.emailService.enviarCorreo().subscribe({
        next: (response) => alert(response),
        error: (error) => alert('Error al enviar el correo: ' + error.message)
      });
    }

    setTipoExport(tipoExport:string) {
      this.tipoExport = tipoExport;
      if(this.tipoExport === this.TIPO_EXPORT_TODAY || this.tipoExport === this.TIPO_EXPORT_YESTERDAY) {
          this.downloadExcel();
      }
    }
    
    registrarNuevoServicio() {
      this.globalUtilsService.disposeCustomTooltips();
      this.router.navigate(['/registrar-viaje']);
    }

}
