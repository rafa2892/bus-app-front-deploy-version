import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Viaje } from '../../../../core/models/viaje';

@Component({
  selector: 'app-popup-mensaje-confirmar-viaje',
  templateUrl: './popup-mensaje-confirmar-viaje.component.html',
  styleUrl: './popup-mensaje-confirmar-viaje.component.css'
})
export class PopupMensajeConfirmarViajeComponent {

  tituloPopUp :string = 'Confirmar servicio';
  modalLabel = 'confirmarServicioLabel';
  idModal: string = 'confirma-servicio-modal';

  //Los datos pasados desde el padre a la instancia del modal 
  isModalProgramatico : boolean = false;
  viaje: Viaje; 

  //Emisores de datos
  @Output() confirmarAccion: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  //RECEPTORES DATOS 
  @Input() viajeSelDetails: Viaje;
  @Input() isModalConfirmacion: boolean;

  ngOnInit(): void {
  }

  manejarConfirmacion(confirmado: boolean) {
    this.confirmarAccion.emit(true);
  }

  getNumeroUnidadFormateado(numeroUnidad: number): string {
    return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
  }

  getViajeSeleccionado(){
    if(this.viajeSelDetails) {
        this.viaje = this.viajeSelDetails;
        this.isModalConfirmacion = false;
        return true;
    }else {
        return false;
    }
  }

  getTituloModal(): string{
    if(this.viaje) {
      return 'Confirmar servicio';
    }
    else {
      return 'Detalles servicio';
    }
  }
}