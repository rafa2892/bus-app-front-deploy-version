import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TITLES } from '../../../../constant/titles.constants';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Carro } from '../../../../core/models/carro';
import { Conductor } from '../../../../core/models/conductor';
import { ViajeServicioService } from '../../../../core/services/viaje-servicio.service';
import { Viaje } from '../../../../core/models/viaje';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-filtros-avanzado-viajes',
  templateUrl: './filtros-avanzado-viajes.component.html',
  styleUrl: './filtros-avanzado-viajes.component.css'
})
export class FiltrosAvanzadoViajesComponent {


  //LITERALES
  APLICAR_FILTROS = TITLES.APPLY_FILTERS;
  CANCELAR = TITLES.CANCEL_MODAL_MSJ;
  FILTROS_TITULOS = TITLES.FILTERS_TITLE;
  CONDUCTOR_PLACEHOLDER_INPUT = TITLES.FILTERS_INPUT_NAME_PLACEHOLDER
  CAR_PLACEHOLDER_INPUT = TITLES.FILTERS_INPUT_CAR_PLACEHOLDER

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

  
  //Transmisores de datos
  @Output() applyFiltersHandler  = new EventEmitter<any>();
  @Output() cleanFilters = new EventEmitter<void>();  
  constructor(
    private viajeServicio: ViajeServicioService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar) {}

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

//APPLIES THE FILTER TO THE TABLE (VIAJES)
  aplicarFiltros() {
    this.getViajesFiltrados();
  }


  // Método para buscar los viajes filtrados
  getViajesFiltrados() {
    this.viajeServicio.obtenerViajesFiltrados(this.numeroUnidad, this.conductorId, this.fechaDesdeStr, this.fechaHastaStr).subscribe(
      (datos) => {
        this.viajesFiltrados = datos;
        //EMITS EVENT SENDING THE DATA AND CLOSE MODAL ORDER TO THE FATHER COMPONENT (listaViajes)
          this.applyFiltersHandler.emit({
          fechaDesde: this.fechaDesde,
          fechaHasta: this.fechaHasta,
          conductor: this.conductor,
          carro: this.carro,
          viajesFiltrados: this.viajesFiltrados // Incluimos los viajes filtrados para mayor flexibilidad
        });
      },(error) => {
        console.error('Error al obtener los viajes:', error);
        if(error.status === 404) {
          this._snackBar.open('No hay registros con los parametros dados', '', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
          });
        }
      }
    );
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
      } else if (fechaTipo === 'hasta') {
          this.fechaHastaStr = fechaStr;
      }
    }
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
      return `${this.carro.numeroUnidad} - ${this.carro.modelo} - ${this.carro.anyo}`
    }
    return '';
  }

  getConductor() :string {
    if(this.conductor) {
      return  `${this.conductor.nombre} - ${this.conductor.apellido}`
    }
    return '';
  }



}

  


