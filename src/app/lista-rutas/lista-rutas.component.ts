import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RutaServiceService } from '../ruta-service.service';
import { Router } from '@angular/router';
import { Ruta } from '../ruta'
import { RegistrarViajeComponent } from '../registrar-viaje/registrar-viaje.component';
import { fontAwesomeIcons } from '../fontawesome-icons';

;

@Component({
  selector: 'app-lista-rutas',
  templateUrl: './lista-rutas.component.html',
  styleUrl: './lista-rutas.component.css'
})
export class ListaRutasComponent {

  rutas:Ruta []  = [];
  @Input() origen: string = '';
  @Input() destino: string = '';
  @Input() viajeNum: string = '';
  @Input() rutasFiltradas: any[];
  @Input() p: number;

  @Output() blurNumeroUnidad = new EventEmitter<void>();
  @Output() inputChangeOriginFilter = new EventEmitter<void>();
  @Output() verDetallesEvent = new EventEmitter<number>();
  @Output() seleccionarRuta  = new EventEmitter<any>();
  

  
  detailsIcon = fontAwesomeIcons.detailsIcon;
  selectIcon = fontAwesomeIcons.selectIcon;
  

  constructor(private rutaServicio:RutaServiceService,private router:Router) {
  }

  ngOnInit(): void {
    this.obtenerRutas();
    this.destino = '';
    this.origen = '';
    this.viajeNum = '';
 }


 private obtenerRutas() {
  this.rutaServicio.obtenerListaRuta().subscribe(rutas => {
  this.rutas = rutas;
  this.rutasFiltradas = rutas;
});
}




onBlurNumeroUnidad() {
  this.blurNumeroUnidad.emit();
}

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
  this.inputChangeOriginFilter.emit();
}

verDetalles(rutaId: number) {
  this.verDetallesEvent.emit(rutaId);
}

seleccionar(ruta: any) {
  this.seleccionarRuta.emit(ruta); // Emitiendo el evento con el nuevo nombre
}

}
