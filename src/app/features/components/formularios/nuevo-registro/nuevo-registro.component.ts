import { Component } from '@angular/core';
import { faCar, faEdit, faEye, faHistory, faPlus, faPlusCircle, faTrash, faScrewdriverWrench} from '@fortawesome/free-solid-svg-icons';
import { Carro } from '../../../../core/models/carro';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-registro',
  templateUrl: './nuevo-registro.component.html',
  styleUrl: './nuevo-registro.component.css'
})
export class NuevoRegistroComponent {

  editIcon = faEdit;
  deleteIcon = faTrash;
  historyIcon = faHistory;
  eyeIcon = faEye;
  p: number = 1;
  faPlus = faPlus;
  carro : Carro = new Carro();
  id!: number;

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) { }

  ngOnInit(): void {
        // Obtener el parámetro 'id' de la URL
        this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  agregarRegistroDeMantenimiento(id:number) {
    console.log('Agregando registro de mantenimiento');
    this.router.navigate(['/nuevo-mantenimiento', id]);
  }

  agregarRegistroDeOtros(id:number) {
    console.log('Agregando registro de otros');
  }

  agregarViajeRegistro(id:number) {
    this.router.navigate(['/registrar-viaje', id]);
    console.log('Agregando viaje', id);
  }
}
