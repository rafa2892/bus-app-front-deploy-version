import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-mensaje-confirmar-viaje',
  templateUrl: './popup-mensaje-confirmar-viaje.component.html',
  styleUrl: './popup-mensaje-confirmar-viaje.component.css'
})
export class PopupMensajeConfirmarViajeComponent {

  tituloPopUp :string = 'Confirmar servicio';
  modalLabel = 'confirmarServicioLabel';
  idModal: string = 'confirma-servicio-modal';

  isModalProgramatico : boolean = false;

  //Emisores de datos
  @Output() confirmarAccion: EventEmitter<boolean> = new EventEmitter<boolean>();

  //Receptores de datos
  @Input() modalProgramatico: boolean = false; // Recibe el booleano desde el padre.

  manejarConfirmacion(confirmado: boolean) {
    console.log("confirmacion desde componente mensaje-confirmar-viaje");
    this.confirmarAccion.emit(true);
  }

}
