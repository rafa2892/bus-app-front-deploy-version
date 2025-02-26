import { Component, EventEmitter, Input, Output} from '@angular/core';
import { TITLES } from '../../../../constant/titles.constants';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Carro } from '../../../../core/models/carro';
import { Conductor } from '../../../../core/models/conductor';
import { Viaje } from '../../../../core/models/viaje';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';

@Component({
  selector: 'app-filtros-avanzado-viajes',
  templateUrl: './filtros-avanzado-viajes.component.html',
  styleUrls: ['./filtros-avanzado-viajes.component.css',
              '../../listas/lista-viajes/lista-viajes.component.css']
})
export class FiltrosAvanzadoViajesComponent {


  //LITERALES
  APLICAR_FILTROS = TITLES.APPLY_FILTERS;
  CANCELAR = TITLES.CANCEL_MODAL_MSJ;
  FILTROS_TITULOS = TITLES.FILTERS_TITLE;
  CONDUCTOR_PLACEHOLDER_INPUT = TITLES.FILTERS_INPUT_NAME_PLACEHOLDER
  CAR_PLACEHOLDER_INPUT = TITLES.FILTERS_INPUT_CAR_PLACEHOLDER
  RESETEAR_FILTRO_TITULO = TITLES.RESET_FILTER_TITLE_BUTTON;

  //ICONOS
  searchIcon = faSearch;

  

  //Atributos
  @Input() carro :  Carro | null;
  @Input()conductor :Conductor | null;
  @Input()fechaDesde : Date | null;
  @Input()fechaHasta : Date | null;

  viajesFiltrados : Viaje [];

  //Parametros
  numeroUnidad: string = '';
  conductorId: number | null;
  fechaDesdeStr : string;
  fechaHastaStr : string;

  @Input() isSwitchFiltersOn: boolean;

  
  //Transmisores de datos
  @Output() applyFiltersHandler  = new EventEmitter<any>();
  @Output() cleanFilters = new EventEmitter<void>();  


  constructor(
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private globalUtilsService : GlobalUtilsService) {}


  //HANDLES THE EVENT TRIGGERED WHEN A VEHICLE IS SELECTED
  selectedVehiculoHandler(carro:any) {
    if(carro) {
      this.carro = carro;
      this.numeroUnidad = carro.numeroUnidad;
    }
  }

//HANDLES THE EVENT TRIGGERED WHEN A DRIVER IS SELECTED
  selectedConductorHandler(conductor:any) {
    if(conductor) {
      this.conductor = conductor;
      this.conductorId = conductor.id;
    }
  }

  validarDatosFiltros() {
    if(!this.fechaDesde && !this.conductor && !this.carro) {
      const msj = `
      Por favor, introduce al menos un parámetro para filtrar los viajes.`;
      this.globalUtilsService.showErrorMessageSnackBar(msj);
      return;
    }else {this.aplicarFiltros();}
  }

  // APPLIES THE FILTER TO THE TABLE (VIAJES)
  async aplicarFiltros() {

    // If fechaHasta is empty, set it equal to fechaDesde
    if (this.fechaDesde && !this.fechaHasta ) {
      // Prepare the modal message
      const title = 'Atención';
      const text =`Has seleccionado una sola fecha. 
                    Se buscarán los servicios correspondientes solo para el día <strong>${this.fechaDesdeStr}</strong>.`;

      // Show confirmation modal
      const result = await this.globalUtilsService.getMensajeConfirmaModal(title, text);

      if (result.isConfirmed) {
        // Emit the filter event if confirmed
        this.fechaHasta = this.fechaDesde;
        this.fechaHastaStr = this.fechaDesdeStr;
        this.emitFilterEvent();
      } else {
        // Exit if not confirmed
        return;
      }
    } else {
      // Emit the filter event if fechaHasta is already provided
      this.emitFilterEvent();
    }
  }


  emitFilterEvent() {
    //Emits event applies filters
      this.applyFiltersHandler.emit({
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
        conductor: this.conductor,
        carro: this.carro,
        viajesFiltrados: this.viajesFiltrados // Incluimos los viajes filtrados para mayor flexibilidad
      });
    }
  
  closeModal() {
    this.modalService.dismissAll();
  }

  public selectedDateFormat(fecha: Date | null, fechaTipo: string) {

    if (fecha) {
      // Si la fecha está definida, la formateamos
      let fechaStr = this.datePipe.transform(fecha, 'dd/MM/yyyy');

      fechaStr = fechaStr || '';

      // Según el tipo de fecha (Desde o Hasta), asignamos el valor
      if (fechaTipo === 'desde') {
          this.fechaDesdeStr = fechaStr;
          this.fechaHastaMayorDesde(fecha);
      } else if (fechaTipo === 'hasta') {
          this.fechaHastaStr = fechaStr;
      }
    }
  }

  fechaHastaMayorDesde(fecha:Date) {
    if((this.fechaHasta && fecha > this.fechaHasta))
        this.fechaHasta = this.fechaDesde;
  }

  resetFilters(): void {

    this.fechaDesde = null;
    this.fechaHasta = null;
    this.carro = null;
    this.conductor = null;

    this.numeroUnidad = '';
    this.conductorId = null;
    this.fechaDesdeStr = '';
    this.fechaHastaStr = '';

    this.cleanFilters.emit();
  }

  getCarro() :string {
    if(this.carro) {
      return `${this.getNumeroUnidadFormateado(this.carro.numeroUnidad)} - ${this.carro.modelo} - ${this.carro.anyo}`
    }
    return '';
  }

  getConductor() :string {
    if(this.conductor) {
      return  `${this.conductor.nombre} - ${this.conductor.apellido}`
    }
    return '';
  }

  filterDatesHasta = (date: Date | null): boolean => {
    if(this.fechaDesde) {
      if (!date) return false;
      if (this.fechaDesde > date) return false;
    }
    return this.validarDiasFuturos(date);
  };
  
  filterDatesDesde = (date: Date | null): boolean => {
    return this.validarDiasFuturos(date);
  };

  validarDiasFuturos(date: Date | null) : boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Bloquear fechas futuras
    return date ? date <= today : false;
  }



  getNumeroUnidadFormateado(numeroUnidad:number) : string {
    return this.globalUtilsService.getNumeroUnidadFormateado(numeroUnidad);
  }

} 


