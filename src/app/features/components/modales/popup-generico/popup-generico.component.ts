import { Component, Input, Output,EventEmitter  } from '@angular/core';
import { Ruta } from '../../../../core/models/ruta';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TITLES } from '../../../../constant/titles.constants';
import { Viaje } from '../../../../core/models/viaje';

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
    this.modalService.dismissAll();
  }

  getButtonMsj() {
    if(this.isModalConfirmacion) {
      return TITLES.CANCEL_MODAL_MSJ;
    }

    else {
      return TITLES.CLOSE_MODAL_MSJ;
    }

  }

}
