import { Component } from '@angular/core';
import { RutasService } from '../rutas.service';
import { Estado } from '../estado';

@Component({
  selector: 'app-registrar-ruta',
  templateUrl: './registrar-ruta.component.html',
  styleUrl: './registrar-ruta.component.css'
})
export class RegistrarRutaComponent {

  constructor(private rutaService: RutasService) {};

  listaEstados : Estado [] = [];


  ngOnInit(): void {
    this.obtenerEstados();
  }

  private obtenerEstados () {
    this.rutaService.obtenerListaEstados().subscribe(dato =>  {
    this.listaEstados = dato;
    });
  }
  

  onSubmit(){
  }


}
