import { Component, Input } from '@angular/core';
import { Carro } from '../carro';


@Component({
  selector: 'app-card-bus-detail',
  templateUrl: './card-bus-detail.component.html',
  styleUrl: './card-bus-detail.component.css'
})
export class CardBusDetailComponent {

  @Input() carroSeleccionadoDetalles: Carro;

  constructor(){
  }

  ngOnInit(): void {
    this.carroSeleccionadoDetalles = new Carro();
 }

}
