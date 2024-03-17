import { Component } from '@angular/core';
import {Carro} from "../carro";
import {CarroService} from "../carro.service";
import { Router } from '@angular/router';
import { faCar, faEdit, faEye, faPlus, faPlusCircle, faTrash} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lista-carros',
  templateUrl: './lista-carros.component.html',
  styleUrl: './lista-carros.component.css',
  
})
export class ListaCarrosComponent {

  carros: Carro[];
  editIcon = faEdit;
  deleteIcon = faTrash;
  eyeIcon = faEye;


  constructor(private carroServicio:CarroService,private router:Router) {
 }

  ngOnInit(): void {
    this.obtenerCarros();
 }

  private obtenerCarros () {
    this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
      this.carros = dato;
    });

  }

  actualizarCarro(id:number) {
    this.router.navigate(['actualizar-empleado',id])
  }

  verFichaTecnica(id:number) {
    this.router.navigate(['actualizar-empleado',id])
  }

  eliminarCarro(id:number) {
      this.carroServicio.eliminarCarro(id).subscribe(dato => {
      console.log(dato);
      this.obtenerCarros();
    })
  }
}