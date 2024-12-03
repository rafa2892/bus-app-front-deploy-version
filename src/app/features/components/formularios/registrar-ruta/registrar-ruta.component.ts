import { Component } from '@angular/core';
import { RutasService } from '../../../../core/services/rutas.service';
import { Estado } from '../../../../core/models/estado';
import { Ruta } from '../../../../core/models/ruta';

@Component({
  selector: 'app-registrar-ruta',
  templateUrl: './registrar-ruta.component.html',
  styleUrl: './registrar-ruta.component.css'
})
export class RegistrarRutaComponent {

  constructor(private rutaService: RutasService) {};

  listaEstados : Estado [] = [];
  estadoOrigen : Estado = new Estado() ;
  estadoDestino: Estado = new Estado() ;
  id:number = 0;
  ruta : Ruta =  new Ruta();


  ngOnInit(): void {
    this.obtenerEstados();
  }

  private obtenerEstados () {
    this.rutaService.obtenerListaEstados().subscribe(dato =>  {
    this.listaEstados = dato;
    });
  }
  

  onSubmit(){
    if(this.validacionDatos()) {
      this.guardarOActualizarRuta();
    }
  }


  guardarOActualizarRuta(){
    this.rutaService.registrarRuta(this.ruta).subscribe(dato => {
      console.log(dato);
    }, error => console.log(error));;
  }

  validacionDatos(): boolean{
    return true;
  }
}
