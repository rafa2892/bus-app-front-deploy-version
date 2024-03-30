import { Component, Input, ChangeDetectorRef  } from '@angular/core';
import { Carro } from '../carro';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-bootstrap/carousel';


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
  imagenescodificadasFront : any [];
  imagenNotFound  = '../../assets/no_image_avaible.jpg';
  index : number = 0;


  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef){
    this.imagenURL = '';
  }

  ngOnInit(): void {
    this.carroSeleccionadoDetalles = new Carro();
 }



getImagenUrl(carroSeleccionado: any) {
      if(carroSeleccionado != undefined && carroSeleccionado.imagenes != undefined && carroSeleccionado.imagenes.length >= 1) {
        let imagenesDecodificadas: string[] = []; 
        if (carroSeleccionado != undefined && carroSeleccionado.imagenes != undefined && carroSeleccionado.imagenes.length >= 1) {
          carroSeleccionado.imagenes.forEach((imagen: { imagen: string }) => {
            if (imagen.imagen) {
              let imagenDecodificada = atob(imagen.imagen);
              imagenesDecodificadas.push(imagenDecodificada);
            }
          });
          this.imagenescodificadasFront = imagenesDecodificadas;
        }
        return this.imagenescodificadasFront;
  }
  else {
    this.index = 0;
    return [this.imagenNotFound];
  }
}

  nextImage() {
    if(this.index < (this.imagenescodificadasFront.length - 1 )){
        this.index++;
    }

    else {
      this.index = 0;
    }
  }

  prevImage() {
    if(this.index > 0){
      this.index--;
    }

    else {
      this.index = this.imagenescodificadasFront.length - 1;
    }
  }
}