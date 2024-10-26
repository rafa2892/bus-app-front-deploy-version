import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Carro } from '../../../core/models/carro';
import { Historial } from '../../../core/models/historial';
import { fontAwesomeIcons } from '../../../../assets/fontawesome-icons';
import { CarroService } from '../../../core/services/carro.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-lista-historial',
  templateUrl: './lista-historial.component.html',
  styleUrl: './lista-historial.component.css'
})
export class ListaHistorialComponent {
 
  @Input() carroSeleccionadoDetalles: Carro;
  @Input() historialActualizado: boolean;
  @Output() agregarHistorial = new EventEmitter<void>();
 
  
  
  p: number = 1;
  checkIcon = fontAwesomeIcons.checkIcon;
  maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
  infoIcon = fontAwesomeIcons.infoIcon;
  carroSelected : any;
  carro:Carro;

  constructor(private carroServicio:CarroService) {}


  ngOnChanges(changes: SimpleChanges): void {
    if(this.carroSeleccionadoDetalles.id != undefined) {
        this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id);
     }
  }

  private obtenerCarroPorId(id: number) {
    this.carroServicio.obtenerCarroPorId(id).pipe(
      tap(c => {
        this.carro = c;
      })
    ).subscribe(() => {
      this.carroSeleccionadoDetalles = this.carro; // Realiza la acción después de recibir el valor
    });
  }

 addHistory() {
  this.agregarHistorial.emit();
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