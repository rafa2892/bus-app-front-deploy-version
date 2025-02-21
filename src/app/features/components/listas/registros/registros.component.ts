    import { Component } from '@angular/core';
    import { faCar, faEdit, faEye, faHistory, faPlus, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
    import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
    import { RegistroActividad } from '../../../../core/models/registro-actividad';
    import { RegistrosAuditoriaService } from '../../../../core/services/registros-auditoria.service';

    @Component({
      selector: 'app-registros',
      templateUrl: './registros.component.html',
      styleUrl: './registros.component.css'
    })
    export class RegistrosComponent {

      constructor(private readonly regAudService:RegistrosAuditoriaService){}

      editIcon = faEdit;
      deleteIcon = faTrash;

      historyIcon = faHistory;
      eyeIcon = faEye;
      p: number = 1;

      rigistroActividades:RegistroActividad [] = [];

      checkIcon = fontAwesomeIcons.checkIcon;
      maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
      infoIcon = fontAwesomeIcons.infoIcon;


      itemsPerPage = 25; // Items per page
      totalItems = 10;  // Total items for pagination

      //indicador de carga
      isLoading: boolean = false;

      ngOnInit(): void {
        this.isLoading = true;
        this.getHistorialActividadesPaginado();
      }

      // getHistorialDeActividades() {
      //   this.regAudService.getAllActivityAudits().subscribe({
      //     next: (r) => {
      //       this.rigistroActividades = r;
      //     },
      //     error: (error) => {
      //       console.error('Error al obtener el historial de actividades:', error);
      //     },
      //     complete: () => {
      //       this.isLoading = false;
      //     }
      //   });
      // }

      onPageChange(page: number) {
        this.isLoading = true;
        this.p = page;  // Actualiza el valor de la página actual
        this.getHistorialActividadesPaginado();
      }

      getHistorialActividadesPaginado() {
        this.regAudService.obtenerRegistrosAudPaginados(this.p - 1, 20).subscribe({
          next: (response) => {
            this.rigistroActividades = response.content;
            this.totalItems = response.totalElements;
          },
          error: (error) => {
            console.error('Error al obtener el historial de actividades:', error);
          },
          complete: () => {
            console.log('Historial de actividades obtenido correctamente');
          }
        }).add(() => this.isLoading = false);
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
      

}
