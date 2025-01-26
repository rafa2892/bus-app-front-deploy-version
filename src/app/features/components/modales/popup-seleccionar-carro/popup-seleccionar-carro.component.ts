import { Component, EventEmitter, Optional, Output } from '@angular/core';
import {CarroService} from "../../../../core/services/carro.service";
import {Carro} from "../../../../core/models/carro";
import {RegistrarViajeComponent} from "../../formularios/registrar-viaje/registrar-viaje.component";
import { Router } from '@angular/router';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';

@Component({
  selector: 'app-popup-seleccionar-carro',
  templateUrl: './popup-seleccionar-carro.component.html',
  styleUrl: './popup-seleccionar-carro.component.css'
})
export class PopupSeleccionarCarroComponent {

  p: number = 1;
  carros: Carro[];
  carrosFiltrado: Carro[];
  detailsIcon = fontAwesomeIcons.detailsIcon;
  selectIcon = fontAwesomeIcons.selectIcon
  numeroUnidad: string = '';
  modelo : string = '';
  anyo : string ='';
  marca : string = '';

  tituloPopUp :string = 'Seleccionar vehiculo';
  modalLabel = 'seleccionarVehiculoLabel';
  idModal: string = 'seleccionaVehiculoModal';

  @Output() selectVehiculoHandlerFromSon = new EventEmitter<any>();


  ngOnInit(): void {
    this.obtenerCarros();
  }


  constructor(
    private carroServicio:CarroService, 
    @Optional() private registrarViajeComponent : RegistrarViajeComponent, 
    private router:Router) {}


  private obtenerCarros () {
    this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
    this.carros = dato;
    this.carrosFiltrado = this.carros;
    });
  }

verDetalles(id:number){
  }

seleccionar(carro:Carro) {
    this.registrarViajeComponent.seleccionarCarro(carro);
    this.clearFilters();
  }

  onInputChangeNumeroUnidad() {
    this.carrosFiltrado = this.carros.filter(carro => carro.numeroUnidad.toString() == this.numeroUnidad);
    if(this.numeroUnidad.trim() === '') {
    this.carrosFiltrado = this.carros;
    }
  }

  onInputChangeBrandFilter() {
    this.carrosFiltrado = this.carros;
    const marca = this.marca.trim().toLowerCase();
    const año = this.anyo.trim().toLowerCase();
    const modelo = this.modelo.trim().toLowerCase();

    this.carrosFiltrado = this.carros.filter(carro => {
        const marcaCoincide = marca === '' || carro.marca.toString().toLowerCase().includes(marca);
        const añoCoincide = año === '' || carro.anyo.toString().toLowerCase().includes(año);
        const modeloCoincide = modelo === '' || carro.modelo.toString().toLowerCase().includes(modelo);
        return marcaCoincide && añoCoincide && modeloCoincide;
    });

}

Searchfilters(){
}

onInputChangeModelFilter() {
  this.carrosFiltrado = this.carros;

  if (this.modelo.trim() === '') {
      return;
  } 
  else {
      const modeloBuscado = this.modelo.toLowerCase(); // Convertir a minúsculas para hacer la comparación insensible a mayúsculas y minúsculas
      this.carrosFiltrado = this.carrosFiltrado.filter(carro => 
          carro.modelo.toString().toLowerCase().includes(modeloBuscado)
      );
  }
}


onInputChangeYearFilter() {
  this.carrosFiltrado = this.carros;

  if (this.anyo.trim() === '') {
    return;
  }else {
      const modeloBuscado = this.anyo.toLowerCase(); // Convertir a minúsculas para hacer la comparación insensible a mayúsculas y minúsculas
      this.carrosFiltrado = this.carrosFiltrado.filter(carro => 
          carro.anyo.toString().toLowerCase().includes(modeloBuscado)
      );
      
  }
}

onBlurNumeroUnidad() {
  this.numeroUnidad = '';
  this.carrosFiltrado = this.carros;
}

clearFilters(){
  this.anyo = '';
  this.numeroUnidad = '';
  this.modelo = '';
  this.marca = '';
  this.carrosFiltrado = this.carros;
}

//Datos desde el hijo (Vehiculo seleccionado)
selectVehiculoHandler(carro:any) {
  this.selectVehiculoHandlerFromSon.emit(carro);
}


}
