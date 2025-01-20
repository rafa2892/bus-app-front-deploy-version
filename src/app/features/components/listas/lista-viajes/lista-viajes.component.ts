import { Component } from '@angular/core'
import {Viaje} from "../../../../core/models/viaje";
import {ViajeServicioService} from "../../../../core/services/viaje-servicio.service";
import { ActivatedRoute, Router } from '@angular/router';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';

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

  constructor(
    private viajeServicio:ViajeServicioService,
    private router:Router,
    private activatedRoute: ActivatedRoute,) {
  }

  ngOnInit(): void {
    const idConductorStr = this.activatedRoute.snapshot.paramMap.get('idConductor'); 
    
    //Convertimos el valor a número
    const idConductor = idConductorStr ? +idConductorStr : null;

    // Si se recibe un id de conductor, se filtran los viajes por ese conductor
    if(idConductor) {
      this.obtenerListaViajePorConductor(idConductor);
    } else {
      this.obtenerListaViaje();
    }
  }

  private obtenerListaViaje() {
    this.viajeServicio.obtenerListaViaje().subscribe(dato =>  {
      this.viajes = dato;
      console.log(this.viajes);
    });
  }

  private obtenerListaViajePorConductor(idConductor: number) {
    this.viajeServicio.obtenerListaViajePorConductor(idConductor).subscribe(dato =>  {
      this.viajes = dato;
    });
  }

  getNumeroUnidadFormateado(numeroUnidad: number): string {
    return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
  }

}
