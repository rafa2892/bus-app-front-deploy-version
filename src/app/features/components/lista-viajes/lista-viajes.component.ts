import { Component } from '@angular/core'
import {Viaje} from "../../../core/models/viaje";
import {ViajeServicioService} from "../../../core/services/viaje-servicio.service";
import { Router } from '@angular/router';
import { fontAwesomeIcons } from '../../../../assets/fontawesome-icons';

@Component({
  selector: 'app-lista-viajes',
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent {

  viajes: Viaje[];
  p: number = 1;
  editIcon = fontAwesomeIcons.editIcon;
  deleteIcon = fontAwesomeIcons.deleteIcon;
  eyeIcon = fontAwesomeIcons.eyeIcon;


  constructor(private viajeServicio:ViajeServicioService,private router:Router) {
  }

  ngOnInit(): void {
    this.obtenerListaViaje();
 }

  private obtenerListaViaje () {
    this.viajeServicio.obtenerListaViaje().subscribe(dato =>  {
      this.viajes = dato;
    });

  }

  formatearHorasEspera(viaje:Viaje){
    const horas = viaje.horasEspera;
    const horasFormateadas = ('0' + horas).slice(-2); // Asegura dos dígitos para las horas
    const minutosFormateados = '00';
    const segundosFormateados = '00';
    return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
  }


}
