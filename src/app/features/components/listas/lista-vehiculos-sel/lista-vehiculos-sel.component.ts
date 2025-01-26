import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { Carro } from '../../../../core/models/carro';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import { CarroService } from '../../../../core/services/carro.service';
import { RegistrarViajeComponent } from '../../formularios/registrar-viaje/registrar-viaje.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-vehiculos-sel',
  templateUrl: './lista-vehiculos-sel.component.html',
  styleUrl: './lista-vehiculos-sel.component.css'
})
export class ListaVehiculosSelComponent {

  p: number = 1;
  carros: Carro[];
  carrosFiltrado: Carro[];
  detailsIcon = fontAwesomeIcons.detailsIcon;
  selectIcon = fontAwesomeIcons.selectIcon
  numeroUnidad: string = '';
  modelo : string = '';
  anyo : string ='';
  marca : string = '';

  //Receptores
  @Input() modalModoSeleccionarConductor : boolean;


  //Transmisores
  @Output() selectVehiculoHandlerFromSon = new EventEmitter<any>();


  constructor(
    private carroServicio:CarroService, 
    @Optional() private registrarViajeComponent : RegistrarViajeComponent, 
    private router:Router) {}
    
  ngOnInit(): void {
      this.obtenerCarros();
  }

  private obtenerCarros () {
    this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
    this.carros = dato;
    this.carrosFiltrado = this.carros;
    });
  }


  verDetalles(id:number){
  }

  seleccionar(carro:Carro) {

    if(!this.registrarViajeComponent) {
      this.selectVehiculoHandlerFromSon.emit(carro);
    }else {
      this.registrarViajeComponent.seleccionarCarro(carro);
    }
    this.clearFilters();
    // this.router.navigate(['/registrar-viaje']);

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
    } else {
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
}
