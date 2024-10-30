import { Component } from '@angular/core';
import { faCar, faEdit, faEye, faHistory, faPlus, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Carro } from '../../../core/models/carro';
import { HistorialService } from '../../../core/services/historial.service';
import { Historial } from '../../../core/models/historial';
import { fontAwesomeIcons } from '../../../../assets/fontawesome-icons';

@Component({
  selector: 'app-registros',
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.css'
})
export class RegistrosComponent {

 constructor(private historialService:HistorialService) {}

  editIcon = faEdit;
  deleteIcon = faTrash;
  historyIcon = faHistory;
  eyeIcon = faEye;
  p: number = 1;
  historialDeActividades:Historial [] = [];

  checkIcon = fontAwesomeIcons.checkIcon;
  maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
  infoIcon = fontAwesomeIcons.infoIcon;

  ngOnInit(): void {
    console.log("Recuperamos lista de actividades");
    this.getHistorialDeActividades();
 }

 getHistorialDeActividades() {
  this.historialService.getHistorialDeActividades().subscribe(historial => {
    this.historialDeActividades = historial;
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
}
