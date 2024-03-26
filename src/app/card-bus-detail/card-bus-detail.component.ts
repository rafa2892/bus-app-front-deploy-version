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

  let imagen = carroSeleccionado.imagenes[0].imagen;

  if(!imagen) {
    imagen = this.imagen;
  }
  // Check if the URL is already cached
  if (this.imageCache.has(imagen)) {
    return this.imageCache.get(imagen);
  } else {
    const binaryString = window.atob(imagen);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const imageBlob = new Blob([bytes], { type: 'image/jpeg' }); 
    const url = URL.createObjectURL(imageBlob);
    // Cache the URL
    this.imageCache.set(imagen, url);
    return url;
  }

}

}
