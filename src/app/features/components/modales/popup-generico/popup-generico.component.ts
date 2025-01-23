import { Component, Input, Output,EventEmitter  } from '@angular/core';
import { Ruta } from '../../../../core/models/ruta';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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


  //Emisores de datos
  @Output() confirmarAccion: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  reset() {
    if(this.isModalProgramatico) {
      this.modalService.dismissAll();
    }
  }

  onAceptar() {
    console.log("confirmacion desde componente pop generico");
    this.confirmarAccion.emit(true);
  }

}
