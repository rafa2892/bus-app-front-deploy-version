import { Component, Input, Output,EventEmitter  } from '@angular/core';
import { Ruta } from '../../../core/models/ruta';

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
  
  isModalProgramatico : boolean;

  ngOnInit(): void {
    console.log("modalGenerico", this.isModalProgramatico);
  }

  reset() {
    this.closeModal.emit();
  }

}
