import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Viaje } from '../../../../core/models/viaje';
import { TITLES } from '../../../../constant/titles.constants';

@Component({
  selector: 'app-popup-mensaje-confirmar-viaje',
  templateUrl: './popup-mensaje-confirmar-viaje.component.html',
  styleUrl: './popup-mensaje-confirmar-viaje.component.css'
})
export class PopupMensajeConfirmarViajeComponent {

  tituloPopUp :string = TITLES.CONFIRM_SERVICE;
  modalLabel = 'confirmarServicioLabel';
  idModal: string = 'confirma-servicio-modal';

  //Los datos pasados desde el padre a la instancia del modal 
  isModalProgramatico : boolean = false;
  viaje: Viaje; 

  //Banderas features modal generico
  isEdicionModeEnabled : boolean = false;

  //Emisores de datos
  @Output() confirmarAccion: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  //RECEPTORES DATOS 
  @Input() viajeSelDetails: Viaje;
  @Input() isModalConfirmacion: boolean = true;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    if(this.viaje && 
       this.viaje.id &&
       this.isModalConfirmacion) {
          this.tituloPopUp = TITLES.EDITING_SERVICE;
    }
  }

  ngOnChanges() {
    // Forzar la detección de cambios cuando las propiedades de entrada cambien
    this.cdr.detectChanges(); 

    //Forzamos actualizar el detalle del viaje
    if(this.viajeSelDetails){
        this.viaje = this.viajeSelDetails;
        this.tituloPopUp = TITLES.SERVICE_DETAILS;
    }
  }

  manejarConfirmacion() {
    this.confirmarAccion.emit(true);
  }

  getNumeroUnidadFormateado(numeroUnidad: number): string {
    return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
  }

  getViajeSeleccionado(){
    if(this.viajeSelDetails) {
        this.viaje = this.viajeSelDetails;
        return true;
    }else {
        return false;
    }
  }
}