import { Component } from '@angular/core'
import {Viaje} from "../../../../core/models/viaje";
import {ViajeServicioService} from "../../../../core/services/viaje-servicio.service";
import { ActivatedRoute, Router } from '@angular/router';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FiltrosAvanzadoViajesComponent } from '../../modales/filtros-avanzado-viajes/filtros-avanzado-viajes.component';
import { Conductor } from '../../../../core/models/conductor';
import { Carro } from '../../../../core/models/carro';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent {

    viajes: Viaje[];
    p: number = 1;
    editIcon = fontAwesomeIcons.editIcon;
    deleteIcon = fontAwesomeIcons.deleteIcon;
    eyeIcon = fontAwesomeIcons.eyeIcon;

    
    fechaDesde : Date | null;
    fechaHasta : Date | null;
    conductor :Conductor | null;
    carro : Carro | null;


    //viaje Seleccionado Detalles
    viajeSelDetails : Viaje;

    //Bandera modal de confirmación
    isModalConfirmacion: boolean = false;

    constructor(
      private viajeServicio:ViajeServicioService,
      private router:Router,
      private activatedRoute: ActivatedRoute,
      private _snackBar: MatSnackBar,
      private globalUtilsService : GlobalUtilsService,
      private modalService: NgbModal) {
    }

    ngOnInit(): void {
      const idConductorStr = this.activatedRoute.snapshot.paramMap.get('idConductor');

      //Convertimos el valor a número
      const idConductor = idConductorStr ? +idConductorStr : null;

      // Si se recibe un id de conductor, se filtran los viajes por ese conductor
      if(idConductor) {
        this.obtenerListaViajePorConductor(idConductor);
      } else {
        this.obtenerListaViaje();
      }
    }

    private obtenerListaViaje(): void {
      this.viajeServicio.obtenerListaViaje().subscribe({
        next: (dato) => {
          // Si el backend devuelve null, asignamos un array vacío
          this.viajes = dato || [];
        console.log(this.viajes);

        },
        error: (error) => {
          console.error('Error al obtener la lista de viajes:', error);
          this.viajes = []; // En caso de error, dejamos la lista vacía
          this.mostrarNotificacion('No se pudo cargar la lista de viajes.', 'error-snackbar');
        }
      });
    }

    private obtenerListaViajePorConductor(idConductor: number) {
      this.viajeServicio.obtenerListaViajePorConductor(idConductor).subscribe(dato =>  {
        this.viajes = dato;
      });
    }

    detallesViaje(viaje:Viaje) {
      this.viajeSelDetails = { ...viaje }; // Crea una copia del objeto seleccionado
    }

    //CRUD
    editar(viaje:Viaje) {
      this.router.navigate(['/registrar-viaje', viaje.id]);
      // const baseUrl = window.location.origin; // Obtiene la base de la URL (ej.: http://localhost:4200)
      // const url = this.router.serializeUrl(this.router.createUrlTree(['/registrar-viaje', viaje.id]));
      // window.open(baseUrl + url, '_blank'); // Abre en una nueva pestaña
    }

    async eliminar(viaje:Viaje){
      const eliminarConfirmado = await this.eliminarViaje(viaje);
      if (eliminarConfirmado) {
        this.viajeServicio.eliminar(viaje.id).subscribe({
          next: () => {
            this.mostrarNotificacion('Viaje eliminado con éxito.', 'success-snackbar');
            this.obtenerListaViaje();
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

    async eliminarViaje(viaje:Viaje): Promise<boolean>{

      let nombreConductorAux = '';

      if(!viaje.conductor) {
          nombreConductorAux = viaje.deletedDriver;
      }
      else {
          nombreConductorAux = `${viaje.conductor.nombre} ${viaje.conductor.apellido}`;
      }

      const texto = `
      <div class="prueba" style="margin-bottom: -1px;"><strong>Servicio num:</strong> ${viaje.id}</div><br>
      <div style="margin-bottom: -1px;"><strong>Salida:</strong> ${viaje.ruta.ciudadOrigen}</div><br>
      <div style="margin-bottom: -1px;"><strong>Destino:</strong> ${viaje.ruta.ciudadDestino}</div><br>
      <div style="margin-bottom: -1px;"><strong>Vehículo Num Unidad:</strong> ${viaje.carro.numeroUnidad}</div><br>
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

    getNumeroUnidadFormateado(numeroUnidad:number, viaje:Viaje) : string {
      return this.globalUtilsService.getNumeroUnidadFormateado(numeroUnidad);
    }

    applyFilterHandlerFromSon(){
      this.modalService.dismissAll();
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

     // Aquí te suscribes al evento 'confirmar' del componente hijo (PopupMensajeConfirmarViajeComponent)
      modalRef.componentInstance.applyFiltersHandler.subscribe((viajesFiltrados: Viaje []) => {
        
      this.fechaDesde = modalRef.componentInstance.fechaDesde;
      this.fechaHasta = modalRef.componentInstance.fechaHasta;
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

    resetFilters(): void {

      this.fechaDesde = null;
      this.fechaHasta = null;
      this.carro = null;
      this.conductor = null;
      this.obtenerListaViaje();
      
    }

    
}
