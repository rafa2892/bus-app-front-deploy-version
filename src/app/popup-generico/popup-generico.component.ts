import { Component, Input, Output,EventEmitter  } from '@angular/core';
import { Ruta } from '../ruta';

@Component({
  selector: 'app-popup-generico',
  templateUrl: './popup-generico.component.html',
  styleUrl: './popup-generico.component.css'
})
export class PopupGenericoComponent {

  @Input() modalLabel!: string;
  @Input() tituloPopUp!: string;
  @Input() idModal!: string;

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();


  reset() {
    this.closeModal.emit();
  }

}
