import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Carro } from '../carro';
import { Historial } from '../historial';
import { fontAwesomeIcons } from '../fontawesome-icons';
import { CarroService } from '../carro.service';

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

  constructor(private carroServicio:CarroService) {}

   ngOnChanges(changes: SimpleChanges) {
      if(this.carroSeleccionadoDetalles != undefined) {
        const id=this.carroSeleccionadoDetalles.id;
        this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
        this.carroSeleccionadoDetalles = c;
    });
   }
  }
  

  ngOnInit(): void {
    if(this.carroSeleccionadoDetalles != undefined) {
    this.carroSelected = this.carroSeleccionadoDetalles;
    }

    else {
    this.carroSeleccionadoDetalles = new Carro();
     }
 }

 




cargarHistorial(): void {
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
    return 'btn btn-secondary'

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