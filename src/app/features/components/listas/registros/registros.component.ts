    import { Component } from '@angular/core';
    import { faEdit, faEye, faHistory, faTrash } from '@fortawesome/free-solid-svg-icons';
    import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
    import { RegistroActividad } from '../../../../core/models/registro-actividad';
    import { RegistrosAuditoriaService } from '../../../../core/services/registros-auditoria.service';
    import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
    import { TITLES } from '../../../../constant/titles.constants';

    @Component({
      selector: 'app-registros',
      templateUrl: './registros.component.html',
      styleUrl: './registros.component.css'
    })
    export class RegistrosComponent {

      constructor(
        private readonly regAudService:RegistrosAuditoriaService,
        private readonly globalUtilsService:GlobalUtilsService
      ){}

      editIcon = faEdit;
      deleteIcon = faTrash;

      historyIcon = faHistory;
      eyeIcon = faEye;
      registroActividades:RegistroActividad [] = [];

      checkIcon = fontAwesomeIcons.checkIcon;
      maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
      infoIcon = fontAwesomeIcons.infoIcon;

      //dates params
      fechaDesde : Date | null;
      fechaHasta : Date | null;
      fechaDesdeStr : string;
      fechaHastaStr : string;

      isAppliedFilters : boolean = false;
      toolTipMsjFiltros :string = 'Selecciona una fecha o ambas fechas para aplicar filtro por fechas';

      // Pagination variables
      p: number = 1;
      itemsPerPage = 20; 
      totalItems = 10; 

      //TITLES LITERALS
      RESET_FILTER = TITLES.RESET_FILTER_TITLE_BUTTON;

      //indicador de carga
      isLoading: boolean = false;

      ngOnInit(): void {
        this.getHistorialActividadesPaginado();
      }

      ngAfterViewInit(): void {
        this.globalUtilsService.buildCustomsToolTipBS();
      }

      onPageChange(page: number) {
        this.p = page;  // Actualiza el valor de la página actual
        // this.getHistorialActividadesPaginado();
        this.getHistorialActividadesPaginadoBetweenDates();
      }

      async validatesDates() {
        if(this.fechaDesde && !this.fechaHasta) {
          const stringDate = this.globalUtilsService.getStringDate(this.fechaDesde);
          const title = 'Atención';
          const text =`Has seleccionado una sola fecha. 
                      Se buscarán los registros de actividades correspondientes solo para el día <strong>${stringDate}</strong>.`;

          const isConfirmed = await this.globalUtilsService.getMensajeConfirmaModal(title,text);

          if (!isConfirmed.isConfirmed) {
            return;
          }else {
              this.fechaHasta = this.fechaDesde;
          }
        }
        this.getHistorialActividadesPaginadoBetweenDates();
      }

      getHistorialActividadesPaginadoBetweenDates() {
         // Activating loading state while fetching data
        this.isLoading = true;

        this.regAudService.obtenerAuditBetweenDaysPageable(this.p - 1, this.itemsPerPage, this.fechaDesde, this.fechaHasta).subscribe({
          next: (response) => {
            if(response && response.content.length > 0) {
              this.registroActividades = response.content;
              this.totalItems = response.totalElements;
              this.isAppliedFilters = true;
            }else {
              this.globalUtilsService.showErrorMessageSnackBar(TITLES.ERROR_NOT_REGISTERS_FOUND);
            }
          },
          error: (error) => {
            console.error('Error al obtener el historial de actividades:', error);
          },
          complete: () => {}
        }).add(() => {
          // Data loading completed, disabling loading state
          this.isLoading = false
        });
      }

      getHistorialActividadesPaginado() {
        // Activating loading state while fetching data
        this.isLoading = true;

        this.regAudService.obtenerRegistrosAudPageable(this.p - 1, this.itemsPerPage).subscribe({
          next: (response) => {
            this.registroActividades = response.content;
            this.totalItems = response.totalElements;
          },
          error: (error) => {console.error('Error al obtener el historial de actividades:', error);
          },
          complete: () => {this.isAppliedFilters = false}
        }).add(() => {
          // Data loading completed, disabling loading state
          this.isLoading = false
        });
      }
      
      getColorFont(r:RegistroActividad) :string {
        if(r.tipoActividad === 1) /*1 == guardado*/ 
        return 'blue-color-font';
        else if (r.tipoActividad === 2)/*2 == edicion*/ 
          return 'warning-color-font'
            else if(r.tipoActividad === 3)/*3 == borrado*/ 
              return 'danger-color-font'

        return '';    
      }

      resetFilterByDate() {
        if(this.isAppliedFilters) {
          this.fechaDesde = null;
          this.fechaHasta = null;
          this.getHistorialActividadesPaginado();
        }
      }

      selectedDateHandler(fecha: Date | null, fechaTipo: string) {
        setTimeout(() => {
        this.globalUtilsService.buildCustomsToolTipBS();
        }, 100); //
      }

      getToolTipMsj(){
        return 'Aplicar filtros'
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
}
