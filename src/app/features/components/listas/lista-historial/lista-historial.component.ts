    import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
    import { Carro } from '../../../../core/models/carro';
    import { Historial } from '../../../../core/models/historial';
    import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
    import { CarroService } from '../../../../core/services/carro.service';
    import { tap } from 'rxjs/operators';
    import { ActivatedRoute, Router } from '@angular/router';
    import { HistorialService } from '../../../../core/services/historial.service';
    import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
    import { firstValueFrom, lastValueFrom } from 'rxjs';
    import { DatePipe } from '@angular/common';
    import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
    import { TITLES } from '../../../../constant/titles.constants';
    import { ViajeServicioService } from '../../../../core/services/viaje-servicio.service';
    import { Viaje } from '../../../../core/models/viaje';
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
      @Input() verSoloRegistroMantenimiento : boolean = false;
      @Input() detectedChangesPopUpFlag : boolean;
      @Input() newHistorialID : number;

      //Pagination variables
      p: number = 1;
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
      viajeSelDetails : Viaje;

      //flag not register found
      notRegisterFound = false;

      //flag is modal mode
      isNotModalMode!: boolean;

      //TITLES LITERALS
      RESET_FILTER = TITLES.RESET_FILTER_TITLE_BUTTON;
      CHECK_DETAILS_HISTORIAL = TITLES.CHECK_DETAILS_HISTORIAL;
      CHECK_SERVICE_DETAIL_HISTORIAL = TITLES.CHECK_SERVICE_DETAIL_HISTORIAL;
      EDIT_HISTORIAL = TITLES.EDIT_HISTORIAL;
      DELETE_HISTORIAL = TITLES.DELETE_HISTORIAL;
      ADD_HISTORIAL = TITLES.ADD_DRIVER;
      

      @Input() changeDetecterFlag : boolean;
      constructor(
        private readonly carroServicio:CarroService, 
        private router: Router, 
        private historialService:HistorialService,
        private modalService: NgbModal,
        private activatedRoute: ActivatedRoute,
        private globalService:GlobalUtilsService,
        private viajeServicio:ViajeServicioService) {}

      ngOnInit(): void {
        const idCarroStr = this.activatedRoute.snapshot.paramMap.get('idCarro');

        // Retrieve flag (isModalMode)
        const isNotModalModeStr = this.activatedRoute.snapshot.queryParams['isNotModalMode'];
        const isNotModalMode = isNotModalModeStr === 'true'; 
    
        // When saving a new historial in non-modal mode, apply styles to the new record.
        if(isNotModalMode) {
          this.isnotModalModeHandler(isNotModalMode);
        }

        if(idCarroStr) {
          const idCarro = Number(idCarroStr);
          this.obtenerCarroPorId(idCarro);
        }
      }

      isnotModalModeHandler(isNotModalMode:boolean) {
        this.isNotModalMode = isNotModalMode;
        const newHistorialID = this.activatedRoute.snapshot.queryParams['newHistorialID'];
        this.newHistorialID = Number(newHistorialID);

       // Remove the parameter from the URL
        this.router.navigate([], {
          queryParams: { newHistorialID: null }, // Set to null to remove it
          queryParamsHandling: 'merge', // Keep other existing query parameters
          replaceUrl: true // Replace the URL without adding a new history entry
        });
      }

      async ngOnChanges(changes: SimpleChanges): Promise<void> {
        //Applies tooltip styles
        this.applyToolTipStyles();

        if (this.carroSeleccionadoDetalles?.id !== undefined) {
          this.p = 1;
          await this.obternerHistorialByCarroIdPageable(this.carroSeleccionadoDetalles);
          this.filtrarHistorialPorTipo();
        }
      }

      applyToolTipStyles() {
      // Delay to allow styles to be applied with transition effect
      setTimeout(() => {
        this.globalService.buildCustomsToolTipBS();
      }, 50);
      }

      obternerHistorialByCarroIdPageable(carro: Carro): Promise<void> {
        return new Promise((resolve, reject) => {
          this.historialService.getHistoriesByCarroIdPageable(carro.id, 0, 10).subscribe({
            next: historial => {
              this.carroSeleccionadoDetalles = { ...carro, registroHistorial: historial.content };
              this.totalItems = historial.totalElements;
            },
            error: err => {
              console.error('Error al obtener el historial:', err);
              reject(err);  // Si hay un error, rechaza la promesa
            },
            complete: () => {
              console.log('Consulta de historial completada');
              resolve();  // Resuelve la promesa cuando la consulta se completa
            }
          });
        });
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
          this.totalItems = this.carroSeleccionadoDetalles.registroHistorial.length;
        }
      }

      private obtenerHistorialById(id: number) {
        this.historialService.getHistorialPorId(id).subscribe(c => {
        });
      }

      ngAfterViewInit(): void {
        setTimeout(() => {
          this.globalService.buildCustomsToolTipBS();
          this.isAppliedFilters = false;
        }, 100); //
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
      this.globalService.disposeCustomTooltips();
      this.router.navigate(['/registrar-historial/carroId', this.carroSeleccionadoDetalles.id, this.verSoloRegistroMantenimiento], {
        queryParams: { 
          isNotModalMode: this.isNotModalMode
        } 
      });
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
      this.router.navigate(['/registrar-historial/historialId', id, false], { 
        queryParams: { 
          soloConsulta, 
          isNotModalMode : this.isNotModalMode
        } 
      });
      this.globalService.disposeCustomTooltips();
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
          this.isLoading = false;
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

    selectedDateHandler(fecha: Date | null, fechaTipo: string) {
      setTimeout(() => {
        this.globalService.buildCustomsToolTipBS();
        this.isAppliedFilters = false;
      }, 100); //
    }

    fechaHastaMayorDesde(fecha:Date) {
      if((this.fechaHasta && fecha > this.fechaHasta))
          this.fechaHasta = this.fechaDesde;
    }

    getNumUnidadFormateado(numUni:number) : string{
      return this.globalService.getNumeroUnidadFormateado(numUni);
    }

    obtenerHistorialBetweenDays() {
      this.isAppliedFilters = false; 
      this.globalService.disposeCustomTooltips(); 

      if(!this.fechaHasta) {
        this.fechaHasta = this.fechaDesde;
      }

    if(this.fechaDesde && this.fechaHasta) {
      this.isLoading = true;
      const carId = this.carroSeleccionadoDetalles.id;
      this.historialService.obtenerHistorialBetweenDaysPageable(carId, this.p - 1, this.itemsPerPage, this.fechaDesde, this.fechaHasta)
        .subscribe({
          next: (response) => {
            if(response && response.content.length > 0) {
              this.carroSeleccionadoDetalles.registroHistorial = response.content;
                // Snack bar appears only when filters are applied
              if(!this.isAppliedFilters) {
                this.globalService.getSuccessfullMsj(`Se han cargado ${response.totalElements} registros con éxito.`);
              }
              // Delay to allow styles to be applied with transition effect
              setTimeout(() => {
                this.isAppliedFilters = true; 
                this.notRegisterFound = false; 
                this.globalService.buildCustomsToolTipBS();
              }, 50);
            }else {
              this.globalService.showErrorMessageSnackBar(TITLES.ERROR_NOT_REGISTERS_FOUND);
              this.applyToolTipStyles();
              //flag not register found
              this.notRegisterFound = true;
            }
          },
          error: (error) => {
            console.error('Error al obtener el historial:', error);
          }
        }).add(() => this.isLoading = false);;
      }
    }

    async applyFilterHandler() {

      if(this.fechaDesde && !this.fechaHasta) {
        const stringDate = this.globalService.getStringDate(this.fechaDesde);
        const title = 'Atención';
        const text = `Has seleccionado una sola fecha. 
                      Se buscarán los registros de historial correspondientes solo para el día <strong>${stringDate}</strong>.`;

        const isConfirmed = await this.globalService.getMensajeConfirmaModal(title,text);

        if (!isConfirmed.isConfirmed) {
          return;
        }else {
            this.fechaHasta = this.fechaDesde;
        }
      }
      this.obtenerHistorialBetweenDays();
    }

    resetFilterByDate() {

      if(this.isAppliedFilters) {
          this.obtenerHistorialPorCarroPaginado();
          this.isAppliedFilters = false;
      }

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
        this.p - 1,
        this.itemsPerPage
      ).subscribe({
        next: (response) => {
          this.carroSeleccionadoDetalles.registroHistorial = response.content;
          this.totalItems = response.totalElements;
          this.applyToolTipStyles();
        },
        error: (error) => {
          console.error('Error al obtener el historial por carro:', error);
        },
        complete: () => {
          console.log('Proceso de carga de historial finalizado.');
        }
      }).add(() => this.isLoading = false);
    }
    
    getToolTipMsj(): string {
      if(this.fechaDesde){
        this.toolTipMsjFiltros = 'Aplicar filtro para la(s) fecha(s) dada(s)'
        return this.toolTipMsjFiltros;
      }
      return this.toolTipMsjFiltros;
    }

    onPageChange(page: number) {
      this.p = page; 
      this.obtenerHistorialPorCarroPaginado();
    }

    async verDetallesServicio(viajeId: number): Promise<void> {
      this.isLoading = true;
      try {
          this.viajeSelDetails = await lastValueFrom(this.viajeServicio.obtenerViajeById(viajeId));
          this.globalService.abrirModalProgramatico('confirma-servicio-modal');
      } catch (error) {
          console.error('Error al obtener el viaje:', error);
      } finally {
          this.isLoading = false;
      }
  }

}