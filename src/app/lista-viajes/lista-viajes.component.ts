import { Component } from '@angular/core'
import {Viaje} from "../viaje";
import {ViajeServicioService} from "../viaje-servicio.service";
import { Router } from '@angular/router';
import { fontAwesomeIcons } from '../fontawesome-icons';

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
  eyeIcon = fontAwesomeIcons.deleteIcon;

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
}
