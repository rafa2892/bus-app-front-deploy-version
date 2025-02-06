import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Carro } from '../../../../core/models/carro';
import { Historial } from '../../../../core/models/historial';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import { CarroService } from '../../../../core/services/carro.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HistorialService } from '../../../../core/services/historial.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-lista-historial',
  templateUrl: './lista-historial.component.html',
  styleUrl: './lista-historial.component.css'
})
export class ListaHistorialComponent {


  @Input() carroSeleccionadoDetalles: Carro;
  @Input() historialActualizado: boolean;
  @Output() agregarHistorial = new EventEmitter<void>();
  @Output() cerrarModalProgramatico = new EventEmitter<any>();
  @Input() verSoloRegistroMantenimiento : boolean;
  @Input() detectedChangesPopUpFlag : boolean;


  p: number = 1;
  checkIcon = fontAwesomeIcons.checkIcon;
  maintenanceIcon = fontAwesomeIcons.maintenanceIcon;
  infoIcon = fontAwesomeIcons.infoIcon;
  carroSelected : any;
  carro : Carro = new Carro();
  detailsIcon = fontAwesomeIcons.eyeIcon;
  editIcon = fontAwesomeIcons.editIcon;

  @Input() changeDetecterFlag : boolean;
  constructor(
    private readonly carroServicio:CarroService, 
    private router: Router, 
    private historialService:HistorialService,
    private modalService: NgbModal) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (this.carroSeleccionadoDetalles?.id !== undefined) {
      this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id);
    }
  }

  ngOnInit(): void {
  // this.obtenerHistorialById(228);
  }

  private obtenerHistorialById(id: number) {
    this.historialService.getHistorialPorId(id).subscribe(c => {
    });

  }
    
  private obtenerCarroPorId(id: number) {
    this.carroServicio.obtenerCarroPorId(id).pipe(
      tap(c => {
        this.carro = c;
      })
    ).subscribe(() => {
      this.carroSeleccionadoDetalles = { ...this.carro };


    //Preseleccionar opción por defecto en el select de tipo de historial ****historial.idTipo***
    //DATA come from BBDD 
    // int 0 = default value = 0
    // int 1 = new Service
    // int 2 = mantinence 
    // int 3 = comment 

    /* Muestra la lista de historial de acuerdo a si es por mantenimiento o vista general*/

      if (this.verSoloRegistroMantenimiento) {
            this.carroSeleccionadoDetalles.registroHistorial = this.carro.registroHistorial.filter(
            historial => historial.idTipo === 2
        );
      }
      
      // else{
      //       this.carroSeleccionadoDetalles.registroHistorial = this.carro.registroHistorial.filter(
      //       historial => historial.idTipo === 3
      //   );
      // }


    });
  }

 addHistory() { 
  // this.agregarHistorial.emit();
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
  // this.cerrarModalProgramatico.emit();
}

async deleteHistorial(id: number) {
  if (!confirm('¿Estás seguro de que quieres eliminar este historial?')) {
    return;
  }

  try {
    await firstValueFrom(this.historialService.deleteHistorial(id));
    alert('Historial eliminado correctamente');
    await this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id); // Recargar historial
  } catch (error) {
    console.error('Error al eliminar el historial:', error);
    alert('Ocurrió un error al eliminar el historial');
  }
}



}