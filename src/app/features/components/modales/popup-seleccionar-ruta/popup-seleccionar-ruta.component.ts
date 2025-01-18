import { Component, ViewChild } from '@angular/core';
import { Ruta } from '../../../../core/models/ruta';
import { RutasService } from '../../../../core/services/rutas.service';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import { RegistrarViajeComponent } from '../../formularios/registrar-viaje/registrar-viaje.component';
import { ListaRutasComponent } from '../../listas/lista-rutas/lista-rutas.component';

@Component({
  selector: 'app-popup-seleccionar-ruta',
  templateUrl: './popup-seleccionar-ruta.component.html',
  styleUrl: './popup-seleccionar-ruta.component.css'
})
export class PopupSeleccionarRutaComponent {

  constructor(
    private rutaService: RutasService, 
    private registrarViajeComponent: RegistrarViajeComponent) {};

  @ViewChild(ListaRutasComponent) listaRutasComponent: ListaRutasComponent;

  tituloPopUp :string = 'Rutas';
  modalLabel = 'rutasModalLabel';
  idModal: string = 'selectRoutePopUp';

  p: number = 1;
  rutas : Ruta [];
  rutasFiltradas : Ruta [];
  ruta : Ruta = new Ruta();
  origen : any = "";
  destino :any = "";
  viajeNum : string="";

  
  // seleccionar(ruta:Ruta) {
  // this.registrarViajeComponent.seleccionarRuta(ruta);
// }

  verDetalles(id:number){}
  
  //Se reinicia el modal al cerrarlo con su información, incluyendo filtros
  onCloseModal() {
    this.listaRutasComponent.ngOnInit();
  }

  ngOnInit(): void {
    this.obtenerListaRutas();
  }
  
   convertirACamelCase(input: string): string {
    // Dividir el string por espacios
    let words = input.split(' ');
  
    // Convertir cada palabra a camelCase y unirlas
    let result = words.map((word, index) => {
      // Capitalizar la primera letra y convertir el resto a minúsculas
      let capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      // Para la primera palabra, no añadir espacio
      if (index === 0) {
        return capitalizedWord;
      }
      // Para el resto, convertir a camelCase
      return capitalizedWord;
    }).join('');
  
    return result;
  }


  private obtenerListaRutas () {
    this.rutaService.obtenerListaRutas().subscribe(dato =>  {
    this.rutas = dato;
    this.rutasFiltradas = this.rutas;
    });
  }

  obtenerIdModal(): string {
    return this.idModal;
  }


  onInputChangeNumeroUnidad() {}
  onBlurNumeroUnidad(){}
  onInputChangeOriginFilter() {}



}
