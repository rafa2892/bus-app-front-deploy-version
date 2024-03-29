import { Component, Input, ChangeDetectorRef  } from '@angular/core';
import { Carro } from '../carro';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-card-bus-detail',
  templateUrl: './card-bus-detail.component.html',
  styleUrl: './card-bus-detail.component.css'
})
export class CardBusDetailComponent {

  @Input() carroSeleccionadoDetalles: Carro;

  // Define a map to cache the URLs
  imageCache: Map<string, string> = new Map<string, string>();
  imagenURL: string;
  imagen:string = '';

  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef){
    this.imagenURL = '';
  }

  ngOnInit(): void {
    this.carroSeleccionadoDetalles = new Carro();
 }



getImagenUrl(carroSeleccionado: any) {

      if(carroSeleccionado != undefined && carroSeleccionado.imagenes != undefined && carroSeleccionado.imagenes.length >= 1) {

      let imagen = carroSeleccionado.imagenes[0].imagen;
      
      // Decodificar la imagen Base64
      let imagenDecodificada = atob(imagen);
      return imagenDecodificada;
    
      }
      else 
      return '';
}



}

