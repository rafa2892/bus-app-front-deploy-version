import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Carro } from '../../../../core/models/carro';
import { CarroService } from '../../../../core/services/carro.service';


@Component({
  selector: 'app-card-bus-detail',
  templateUrl: './card-bus-detail.component.html',
  styleUrl: './card-bus-detail.component.css'
})
export class CardBusDetailComponent {

  @Input() carroSeleccionadoDetalles: Carro;
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  

  // Define a map to cache the URLs
  imageCache: Map<string, string> = new Map<string, string>();
  imagenURL: string;
  imagen:string = '';
  imagenesCodificadasFront : any [] | undefined;
  imagenNotFound  = '../../assets/no_image_avaible.jpg';
  index : number = 0;


  constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private carroService:CarroService){
    this.imagenURL = '';
  }
  
  onCloseModal() {
    this.index = 0;
    this.modalClosed.emit();
  }

  
  ngOnInit(): void {
    this.carroSeleccionadoDetalles = new Carro();
 }

  getImagenUrl(carroSeleccionado: any) {

      this.imagenesCodificadasFront = this.carroService.getImagenUrl(carroSeleccionado)
      
      if(this.imagenesCodificadasFront) {
        return this.imagenesCodificadasFront;
      }else{
        this.index = 0;
        return [this.imagenNotFound];
      }

  }

  mostrarCambioImg() : boolean {
    if(this.imagenesCodificadasFront && this.imagenesCodificadasFront.length > 1) {
        return true;
    }
    return false;
  }
      

  nextImage() {
    if(this.imagenesCodificadasFront && this.index < (this.imagenesCodificadasFront.length - 1 )){
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
      if(this.imagenesCodificadasFront) 
        this.index = this.imagenesCodificadasFront.length - 1;
    }
  }

  selectImage(index: number): void {
    this.index = index;
  }


  noImage() {
    if(this.imagenesCodificadasFront && this.imagenesCodificadasFront.length < 1) {
        return true;
    }
    return false;
  }
}