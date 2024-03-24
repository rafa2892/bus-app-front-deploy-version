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
  conductoresListafiltrado : Conductor [];
  nombre : string = '';
  apellido : string= '';
  dni : string= '';
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
      this.conductoresListafiltrado = this.conductoresLista
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

    const nombre = this.nombre.trim().toLowerCase();
    const apellido = this.apellido.trim().toLowerCase();
    const dni = this.dni.trim().toLowerCase();

    this.conductoresListafiltrado = this.conductoresLista.filter(c => {
        const marcaCoincide = nombre === '' || c.nombre.toString().toLowerCase().includes(nombre);
        const añoCoincide = apellido === '' || c.apellido.toString().toLowerCase().includes(apellido);
        const cedula = dni === '' || c.dni.toString().toLowerCase().includes(dni);
        return marcaCoincide && añoCoincide && cedula;
    });


  }  


  onInputChangeApellidoFilter() {



  }


  onInputChangeDniFilter() {


    
  }





}
