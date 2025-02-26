import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TITLES } from '../../../../constant/titles.constants';
import { Viaje } from '../../../../core/models/viaje';
declare var bootstrap: any;

@Component({
  selector: 'app-popup-generico',
  templateUrl: './popup-generico.component.html',
  styleUrl: './popup-generico.component.css'
})
export class PopupGenericoComponent {


    constructor(
    private modalService: NgbModal) {}

  //Receptores de datos
  @Input() modalLabel!: string;
  @Input() tituloPopUp!: string;
  @Input() idModal!: string;
  @Input() isModalProgramatico : boolean;

  //Receptores de datos (caracteristicas singulares de componentes padres)
  @Input() isModalConfirmacion: boolean = false; // Recibe el booleano desde el padre.
  @Input() viaje: Viaje; // Recibe el booleano desde el padre.

  @Input() modalSizeClase: string; // Recibe el booleano desde el padre.
  

  //Emisores de datos
  @Output() confirmarAccion: EventEmitter<boolean> = new EventEmitter<boolean>();


  //Literales
  CONFIRMAR_MODAL = TITLES.CONFIRM_MODAL_MSJ;


  ngOnInit(): void {
  }

  reset() {
    if(this.isModalProgramatico) {
      this.modalService.dismissAll();
    }
  }

  onAceptar() {
    this.confirmarAccion.emit(true);
  }

  getButtonMsj() {
    if(this.isModalConfirmacion) {
      return TITLES.CANCEL_MODAL_MSJ;
    }else {
      return TITLES.CLOSE_MODAL_MSJ;
    }
  }

  getModalSizeClass() :string {
    if(this.modalSizeClase) {
        return this.modalSizeClase;
    }else {
      return 'modal-lg';
    }
  }

  cerrarModal(): void {
    let modalElement = document.getElementById(this.idModal!);
  
    if (modalElement) {
      // Obtener la instancia del modal
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
  
      if (modalInstance) {
        modalInstance.hide();  // Cierra el modal
      } else {
        console.error('No se pudo obtener la instancia del modal.');
      }
    } else {
      console.error('No se encontró el modal con el ID especificado.');
    }
  }
  

}
