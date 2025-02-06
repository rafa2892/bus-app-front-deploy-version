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

      constructor(
                    // private historialService:HistorialService
                    private readonly regAudService:RegistrosAuditoriaService
                  
                  ) {}

      editIcon = faEdit;
      deleteIcon = faTrash;
      historyIcon = faHistory;
      eyeIcon = faEye;
      p: number = 1;

      // historialDeActividades:Historial [] = [];
      rigistroActividades:RegistroActividad [] = [];

      checkIcon = fontAwesomeIcons.checkIcon;
      maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
      infoIcon = fontAwesomeIcons.infoIcon;

      ngOnInit(): void {
        this.getHistorialDeActividades();
      }

      getHistorialDeActividades() {
        this.regAudService.getAllActivityAudits().subscribe(r => {
          this.rigistroActividades = r;
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

}
