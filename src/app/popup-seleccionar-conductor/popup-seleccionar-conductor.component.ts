import { Component } from '@angular/core';
import { ConductorServiceService } from '../conductor-service.service';
import { RegistrarViajeComponent } from '../registrar-viaje/registrar-viaje.component';
import { Router } from '@angular/router';
import { Conductor } from '../conductor';
import { fontAwesomeIcons } from '../fontawesome-icons';

@Component({
  selector: 'app-popup-seleccionar-conductor',
  templateUrl: './popup-seleccionar-conductor.component.html',
  styleUrls: ['./popup-seleccionar-conductor.component.css', '../../../src/styles.css'],
})
export class PopupSeleccionarConductorComponent {


  conductoresLista : Conductor [];
  nombre : string;
  apellido : string;
  dni : string;
  p: number = 1;
  detailsIcon = fontAwesomeIcons.detailsIcon;
  selectIcon = fontAwesomeIcons.selectIcon;



  ngOnInit(): void {
    this.obtenerConductores();
 }


  constructor(private coductorService:ConductorServiceService, private registrarViajeComponent : RegistrarViajeComponent, private router:Router) { }



  obtenerConductores(){
      this.coductorService.obtenerListaConductores().subscribe(dato =>  {
      this.conductoresLista = dato;
      // this.carrosFiltrado = this.carros;
      // this.getSeparateModelAndBrand();
      });
  }


  verDetalles(id:number) {


  }

  seleccionar(conductor:Conductor) {

    this.registrarViajeComponent.seleccionarConductor(conductor);
    this.clearFilters();
    this.router.navigate(['/registrar-viaje']);
  }


  clearFilters(){



  }

  onBlurNombre() {



  }

  onInputChangeNombre() {




  }  


  onInputChangeApellidoFilter() {



  }


  onInputChangeDniFilter() {


    
  }





}
