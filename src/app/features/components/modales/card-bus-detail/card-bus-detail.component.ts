import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Carro } from '../../../../core/models/carro';
import { CarroService } from '../../../../core/services/carro.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
import { Router } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-card-bus-detail',
  templateUrl: './card-bus-detail.component.html',
  styleUrl: './card-bus-detail.component.css'
})
export class CardBusDetailComponent {

  @Input() carroSeleccionadoDetalles: Carro ;
  @Input() numeroViajes: number;
  @Input() numeroHistories: number;
  @Output() modalClosed: EventEmitter<void> = new EventEmitter<void>();
  

  imagenURL: string;
  imagen:string = '';
  imagenesCodificadasFront : any [] | undefined;
  imagenNotFound  = 'assets/no_image_avaible.jpg';
  index : number = 0;

  eyeIcon = faEye;
  isEnableViajes = false;
  isEnableHistories = false; 


  constructor(
    private globalService :GlobalUtilsService,
    private carroService:CarroService,
    private router: Router,){
    this.imagenURL = '';
  }
  
  onCloseModal() {
    this.carroSeleccionadoDetalles = new Carro();
    this.index = 0;
    this.modalClosed.emit();
  }


  ngOnInit(): void {
    this.carroSeleccionadoDetalles = new Carro();
 }
 

  ngAfterViewInit(): void {
    this.applyToolTipStyles();
 }

 ngAfterViewChecked(): void {
  
} 

applyToolTipStyles() {
  // Delay to allow styles to be applied with transition effect
  setTimeout(() => {
    this.globalService.buildCustomsToolTipBS();
  }, 50);
  }

  getImagenUrl(carroSeleccionado: any) {
    this.imagenesCodificadasFront =
            this.carroService.getImagenUrl(carroSeleccionado);
      
      if(this.imagenesCodificadasFront) {
        return this.imagenesCodificadasFront;
      }else{
        this.index = 0;
        return [this.imagenNotFound];
      }
  }


  mostrarCambioImg() : boolean {
  const imagenes =  this.carroSeleccionadoDetalles.imagenesDecodificadas;

    if(imagenes && imagenes.length > 1) {
        return true;
    }
    return false;
  }
      

  nextImage() {
    const imagenes =  this.carroSeleccionadoDetalles.imagenesDecodificadas;
    if(imagenes && this.index < (imagenes.length - 1 )){
        this.index++;
    }else {
      this.index = 0;
    }
  }

  prevImage() {
    if(this.index > 0){
      this.index--;
    }else {
      const imagenes = this.carroSeleccionadoDetalles.imagenesDecodificadas;
      if(imagenes) {
        this.index = imagenes.length - 1;
      }
    }
  }

  selectImage(index: number): void {
    this.index = index;
  }


  noImage() {
    if(this.carroSeleccionadoDetalles.imagenesBd && this.carroSeleccionadoDetalles.imagenesBd.length > 0) {
      return false;
    }
    return true;
  }

  getImagesLength() : number [] {
    if (this.carroSeleccionadoDetalles && this.carroSeleccionadoDetalles.imagenesBd) {
      return Array.from({ length: this.carroSeleccionadoDetalles.imagenesBd.length }, (_, i) => i);
    }
    return [];
  }

  getNumeroUnidadFormateado(numeroUni:number) : string {
    return this.globalService.getNumeroUnidadFormateado(numeroUni);
  }

  verViajesByCarro(id:number) {
    this.router.navigate(['lista-viajes/byCarro/', id]);
  }

  verHistorialByCarro(id:number) {
    this.router.navigate(['lista-historial/', id], { 
      queryParams: { 
        isNotModalMode: true
      } 
    });
  }
      
  irFormularioCarroConsulta(id:number) {
    const esEdicion = false; // O el valor que desees (true o false)
    this.router.navigate(['actualizar-vehiculo', id], { queryParams: { esEdicion } });
  }

  getRegisterDate() {
    if(this.carroSeleccionadoDetalles.fechaAlta) {
      return this.globalService.getStringDate(this.carroSeleccionadoDetalles.fechaAlta);
    }else {
      return 'Sin datos';
    }
  }

}