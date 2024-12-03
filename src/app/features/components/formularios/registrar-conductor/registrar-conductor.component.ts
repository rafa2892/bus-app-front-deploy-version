import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faIdCard, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Conductor } from '../../../../core/models/conductor';
import { ConductorService } from '../../../../core/services/conductor.service';

@Component({
  selector: 'app-registro-conductor',
  templateUrl: './registrar-conductor.component.html',
  styleUrl: './registrar-conductor.component.css'
})
export class RegistrarConductorComponent {

constructor(private conductorService:ConductorService, private _snackBar: MatSnackBar) {
  this.nuevoConductor.dniTipo = 'V-';
}

  // Lista de cadenas
  tiposDNI: string[] = ['V-', 'E-'];

  //Iconos 
  faIdCard = faIdCard;
  plusIcon = faPlusCircle;

  // Parámetros de la vista o component
  nonNumericError: Boolean;
  nuevoConductor: Conductor = new Conductor();
  conductorGuardado: any = new Conductor();


  onSubmit(){
      if(this.validarDatos()) {
        this.guardarNuevoConductor();
      }
  }

  validarDatos(): boolean {
    const { nombre, apellido, dni, dniTipo } = this.nuevoConductor;
  
    // Verifica si alguno de los campos obligatorios está vacío.
    if (!nombre || !apellido || !dni || !dniTipo) {
        this._snackBar.open('Por favor, rellene los campos requeridos marcados en rojo, son requeridos.', 'Cerrar', {
             duration: 3000, // Duración del Snackbar en milisegundos
             panelClass: ['error-snackbar'],
             horizontalPosition: 'end', // Options: 'start', 'center', 'end'
             verticalPosition: 'top', // Options: 'top', 'bottom'
 
         });
    }
  
    return true;
  }


  guardarNuevoConductor(){
    this.conductorService.registrarConductor(this.nuevoConductor).subscribe(c => {
      console.log(caches);
      this.conductorGuardado = c;
    }, error => console.log(error));
  }

  handleNonNumericCount(count: number, anyo: string) {
    (count >= 3 && anyo === 'cedula') ?   this.nonNumericError = true :  this.nonNumericError = false;
  }

}
