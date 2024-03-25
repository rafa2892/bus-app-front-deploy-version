import { Component } from '@angular/core';
import { Ruta } from '../ruta';
import { RutasService } from '../rutas.service';
import { fontAwesomeIcons } from '../fontawesome-icons';
import { RegistrarViajeComponent } from '../registrar-viaje/registrar-viaje.component';

@Component({
  selector: 'app-popup-seleccionar-ruta',
  templateUrl: './popup-seleccionar-ruta.component.html',
  styleUrl: './popup-seleccionar-ruta.component.css'
})
export class PopupSeleccionarRutaComponent {

  constructor(private rutaService: RutasService, private registrarViajeComponent: RegistrarViajeComponent) {};

  p: number = 1;
  rutas : Ruta [];
  rutasFiltradas : Ruta [];

  detailsIcon = fontAwesomeIcons.detailsIcon;
  selectIcon = fontAwesomeIcons.selectIcon;
  ruta : Ruta = new Ruta();


  origen : any = "";
  destino :any = "";
  viajeNum : string="";

  
  seleccionar(ruta:Ruta) {
  this.registrarViajeComponent.seleccionarRuta(ruta);
}


  verDetalles(id:number){
  }

  clearFilters(){}


  ngOnInit(): void {
    this.obtenerListaRutas();
  }


  private obtenerListaRutas () {
    this.rutaService.obtenerListaRutas().subscribe(dato =>  {
    this.rutas = dato;
    this.rutasFiltradas = this.rutas;
    });
  }

  onInputChangeNumeroUnidad() {


  }


  onBlurNumeroUnidad(){}


  onInputChangeOriginFilter() {

    this.rutasFiltradas = this.rutas;
    const origen = this.origen.trim().toLowerCase();
    const destino = this.destino.trim().toLowerCase();
    const numViaje = this.viajeNum.trim().toLowerCase();
    const numViajeEsNumero = numViaje === '' || /^\d+$/.test(numViaje);

    if(numViajeEsNumero) {
    this.rutasFiltradas = this.rutasFiltradas.filter(r => {
        const origenCoincide = origen === '' || r.origen.toString().toLowerCase().includes(origen);
        const destinoCoincide = destino === '' || r.destino.toString().toLowerCase().includes(destino);
        const numViajeCoincide = numViaje === '' || r.numRutaIdentificativo.toString().toLowerCase().includes(numViaje);
        return origenCoincide && destinoCoincide && numViajeCoincide;
    });

    }

  }

  onInputChangeDestinyFilter(){

    // this.rutasFiltradas = this.rutas;
    
    
    // this.rutasFiltradas = this.rutasFiltradas.filter(r => {
    //     const origenCoincide = destino === '' || r.origen.toString().toLowerCase().includes(destino);
    //     const destinoCoincide =
    //     return origenCoincide;
    // })



    // const marcaCoincide = marca === '' || carro.marca.toString().toLowerCase().includes(marca);
    // const añoCoincide = año === '' || carro.anyo.toString().toLowerCase().includes(año);
    // const modeloCoincide = modelo === '' || carro.modelo.toString().toLowerCase().includes(modelo);
    // return marcaCoincide && añoCoincide && modeloCoincide;


  }

  onInputChangeNumViaje() {



  }

  



}
