import { Component } from '@angular/core';
import { faCar, faEdit, faEye, faHistory, faPlus, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Carro } from '../../../core/models/carro';
import { HistorialService } from '../../../core/services/historial.service';
import { Historial } from '../../../core/models/historial';

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

  ngOnInit(): void {
    console.log("Recuperamos lista de actividades");
    this.getHistorialDeActividades();
 }

 getHistorialDeActividades() {
  this.historialService.getHistorialDeActividades().subscribe(historial => {
    this.historialDeActividades = historial;
  });
}
}
