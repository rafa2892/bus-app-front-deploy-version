    import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
    import { Carro } from '../../../../core/models/carro';
    import { Historial } from '../../../../core/models/historial';
    import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
    import { CarroService } from '../../../../core/services/carro.service';
    import { tap } from 'rxjs/operators';
    import { ActivatedRoute, Router } from '@angular/router';
    import { HistorialService } from '../../../../core/services/historial.service';
    import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
    import { firstValueFrom } from 'rxjs';
    import { DatePipe } from '@angular/common';
    import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
    import { TITLES } from '../../../../constant/titles.constants';
    declare var bootstrap: any;



    @Component({
      selector: 'app-lista-historial',
      templateUrl: './lista-historial.component.html',
      styleUrl: './lista-historial.component.css'
    })
    export class ListaHistorialComponent {


      @Input() carroSeleccionadoDetalles: Carro = new Carro();
      @Input() historialActualizado: boolean;
      @Output() agregarHistorial = new EventEmitter<void>();
      @Output() cerrarModalProgramatico = new EventEmitter<any>();
      @Input() verSoloRegistroMantenimiento : boolean;
      @Input() detectedChangesPopUpFlag : boolean;

      //Pagination variables
      h: number = 1;
      itemsPerPage = 10; //default value
      totalItems = 10;  

      //indicador de carga
      isLoading: boolean = false;

      checkIcon = fontAwesomeIcons.checkIcon;
      maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
      infoIcon = fontAwesomeIcons.infoIcon;
      carroSelected : any;
      carro : Carro = new Carro();
      detailsIcon = fontAwesomeIcons.eyeIcon;
      editIcon = fontAwesomeIcons.editIcon;

      fechaDesde : Date | null;
      fechaHasta : Date | null;
      fechaDesdeStr : string;
      fechaHastaStr : string;

      isAppliedFilters : boolean = false;
      toolTipMsjFiltros :string = 'Selecciona una fecha o ambas fechas para aplicar filtro por fechas';

      @Input() changeDetecterFlag : boolean;
      constructor(
        private readonly carroServicio:CarroService, 
        private router: Router, 
        private historialService:HistorialService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private globalService:GlobalUtilsService) {}


      ngOnChanges(changes: SimpleChanges): void {
        if (this.carroSeleccionadoDetalles?.id !== undefined) {
          this.h = 1;
          this.filtrarHistorialPorTipo();
        }
      }


      ngOnInit(): void {
        const idCarroStr = this.activatedRoute.snapshot.paramMap.get('idCarro');

        if(idCarroStr) {
          const idCarro = Number(idCarroStr);
          this.obtenerCarroPorId(idCarro);
        }
      }

      filtrarHistorialPorTipo() {
        //Preseleccionar opción por defecto en el select de tipo de historial ****historial.idTipo***
        //DATA come from BBDD 
        // int 0 = default value = 0
        // int 1 = new Service
        // int 2 = mantinence 
        // int 3 = comment 
        /* Muestra la lista de historial de acuerdo a si es por mantenimiento o vista general*/
        if (this.verSoloRegistroMantenimiento) {
          this.carroSeleccionadoDetalles = {
            ...this.carroSeleccionadoDetalles, 
            registroHistorial: this.carroSeleccionadoDetalles.registroHistorial?.filter(h => h.idTipo === 2) || []
          };
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

      private obtenerHistorialById(id: number) {
        this.historialService.getHistorialPorId(id).subscribe(c => {
        });
      }

      ngAfterViewInit(): void {
        this.buildCustomsToolTipBS();
      }
        
      private obtenerCarroPorId(id: number) {
        this.carroServicio.obtenerCarroPorId(id).pipe(
          tap(c => {
            this.carro = c;
          })
        ).subscribe(() => {
          this.carroSeleccionadoDetalles = { ...this.carro };
        });
      }

    addHistory() { 
      this.modalService.dismissAll();
      this.router.navigate(['/registrar-historial/carroId', this.carroSeleccionadoDetalles.id, this.verSoloRegistroMantenimiento ]);
    }

    getClassByTipoHistorial(history:Historial) : string {
      if(history.idTipo == 1)
        return 'btn btn-success'

      else if(history.idTipo == 2)
        return 'btn btn-warning'

      else if(history.idTipo == 3)
        return 'btn btn-primary'

    return 'btn btn-secondary';
    }

    getIconByTipoHistorial(history:Historial) : any {
      if(history.idTipo == 1)
        return this.checkIcon;

      else if(history.idTipo == 2)
        return this.maintenanceIcon;

      else if(history.idTipo == 3)
        return this.infoIcon

      return this.infoIcon;
    }

    verDetalleshistorial(id:number, soloConsulta: boolean) {
      this.router.navigate(['/registrar-historial/historialId', id, false], { queryParams: { soloConsulta } });
      this.modalService.dismissAll();
    }

    
    async mensajeConfirmarEliminar() :Promise<boolean> {
      const title = 'Confirma eliminar historial'
      const text = '¿Estás seguro de que quieres eliminar este historial?. Será borrado <strong>PERMANENTEMENTE.</strong>'
      const isConfirmed = await this.globalService.getMensajeConfirmaModal(title,text);
  
      if (!isConfirmed.isConfirmed) {
        return false;
      }else {
        return true;
      }
    } 


    async deleteHistorial(id: number) {

      const confirmDelete = await this.mensajeConfirmarEliminar();
      this.isLoading = true;
      
      if (!confirmDelete) {
        return;
      }
     
      try {
        await firstValueFrom(this.historialService.deleteHistorial(id));
        alert('Historial eliminado correctamente');
        await this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id); // Recargar historial
      } catch (error) {
        console.error('Error al eliminar el historial:', error);
        alert('Ocurrió un error al eliminar el historial');
      } finally {
        this.isLoading = false; // Se ejecuta sin importar si hubo error o no
      }
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

    getNumUnidadFormateado(numUni:number) : string{
      return this.globalService.getNumeroUnidadFormateado(numUni);
    }

    obtenerHistorialBetweenDays() {
    if(!this.fechaHasta) {
      this.fechaHasta = this.fechaDesde;
    }

    if(this.fechaDesde && this.fechaHasta) {
      const carId = this.carroSeleccionadoDetalles.id;
      this.historialService.obtenerHistorialBetweenDays(carId, this.fechaDesde, this.fechaHasta)
        .subscribe({
          next: (historiales) => {
            if(historiales.length > 0){
              this.isAppliedFilters = true;
              this.carroSeleccionadoDetalles.registroHistorial = historiales;
            }else {
              this.globalService.showErrorMessageSnackBar(TITLES.ERROR_NOT_REGISTERS_FOUND);
            }
          },
          error: (error) => {
            console.error('Error al obtener el historial:', error);
          }
        });
      }else {
        this.globalService.showErrorMessageSnackBar(TITLES.ERROR_NOT_DATES_SUBMIT)
      }
    }

    resetFilterByDate() {
      this.obtenerHistorialPorCarro();
      this.isAppliedFilters = false;
      this.fechaDesde = null;
      this.fechaHasta = null;
    }

    obtenerHistorialPorCarroPaginado() {
      this.isLoading = true; // Indicador de carga

      if (!this.carroSeleccionadoDetalles?.id) {
        console.warn('No hay un carro seleccionado para obtener el historial.');
        return;
      }
      this.historialService.getHistoriesByCarroIdPageable(
        //Funtion parameters id, page, size
        this.carroSeleccionadoDetalles.id,
        this.h - 1,
        this.itemsPerPage
      ).subscribe({
        next: (response) => {
          this.carroSeleccionadoDetalles.registroHistorial = response.content;
          this.totalItems = response.totalElements;
        },
        error: (error) => {
          console.error('Error al obtener el historial por carro:', error);
        },
        complete: () => {
          console.log('Proceso de carga de historial finalizado.');
        }
      }).add(() => this.isLoading = false);
    }
    
    obtenerHistorialPorCarro() {
      if (!this.carroSeleccionadoDetalles?.id) {
        console.warn('No hay un carro seleccionado para obtener el historial.');
        return;
      }
    
      this.historialService.getHistoriesByCarroId(this.carroSeleccionadoDetalles.id).subscribe({
        next: (h) => {
          this.carroSeleccionadoDetalles.registroHistorial = h;
          console.log('Historial cargado:', h);
        },
        error: (error) => {
          console.error('Error al obtener el historial por carro:', error);
        }
      });
    }

    getToolTipMsj(): string {
      if(this.fechaDesde){
        this.toolTipMsjFiltros = 'Aplicar filtro para la(s) fecha(s) dada(s)'
        return this.toolTipMsjFiltros;
      }
      return this.toolTipMsjFiltros;
    }

    onPageChange(page: number) {
      this.h = page; // Actualiza el valor de la página actual
      this.obtenerHistorialPorCarroPaginado();
    }
}