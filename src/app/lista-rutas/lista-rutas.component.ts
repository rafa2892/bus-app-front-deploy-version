import { Component } from '@angular/core';
import { RutaServiceService } from '../ruta-service.service';
import { Router } from '@angular/router';
import { Ruta } from '../ruta';

@Component({
  selector: 'app-lista-rutas',
  templateUrl: './lista-rutas.component.html',
  styleUrl: './lista-rutas.component.css'
})
export class ListaRutasComponent {

  rutas:Ruta [];

  constructor(private rutaServicio:RutaServiceService,private router:Router) {
  }

  ngOnInit(): void {
    this.obtenerRutas();
 }


 private obtenerRutas() {
  this.rutaServicio.obtenerListaRuta().subscribe(rutas => {
  this.rutas = rutas;
});
}


}
