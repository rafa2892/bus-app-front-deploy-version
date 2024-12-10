import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faEye, faIdCard, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Conductor } from '../../../../core/models/conductor';
import { ConductorService } from '../../../../core/services/conductor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-registro-conductor',
  templateUrl: './registrar-conductor.component.html',
  styleUrl: './registrar-conductor.component.css',
})
export class RegistrarConductorComponent {

  tiposDNI: string[] = ['V', 'E'];

  //Iconos 
  faIdCard = faIdCard;  
  plusIcon = faPlusCircle;
  eyeicon = faEye;

  // Parámetros de la vista o component
  nonNumericError: boolean;
  nuevoConductor: Conductor = new Conductor();
  conductorGuardado: any = new Conductor();
  fechaString: string | null = '';
  isDesdeDetalles: boolean = false;

  // Campos faltantes en el formulario
  camposFaltantes: string[] = [];

  constructor(
    private conductorService:ConductorService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe ) {
   // Tipo de documento por defecto (Cédula)
   this.nuevoConductor.dniTipo = 'V';
 }

  ngOnInit(): void {
    const id = + this.activatedRoute.snapshot.paramMap.get('id')!;
    const isDesdeDetalles = this.activatedRoute.snapshot.paramMap.get('isDesdedetalles'); 
    this.isDesdeDetalles = isDesdeDetalles === 'true';

    if(id) {
      this.obtenerConductorPorId(id);
    }
  }


  obtenerConductorPorId(id: number) {
    this.conductorService.obtenerConductorPorId(id).subscribe({
      next: (c) => {
        this.nuevoConductor = c;
        // if (c.fechaNacimiento) {
        //   this.fechaString = this.datePipe.transform(c.fechaNacimiento, 'yyyy-MM-dd');
        //   console.log(this.fechaString);
        // }
      },
      error: (error) => console.log(error),
      complete: () => console.log('Conductor cargado')
    });
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(){
      if(this.validarDatos()) {
        this.guardarNuevoConductor();
      }
  }

  // Método que se ejecuta al enviar el formulario
  validarDatos(): boolean {

    console.log(this.nuevoConductor);
  
    // Inicializa el array de campos faltantes
    this.camposFaltantes = [];
    const { nombre, apellido, dni, fechaNacimiento } = this.nuevoConductor;
  
    // Verifica cada campo
    if (!nombre) this.camposFaltantes.push('nombre-conductor');
    if (!apellido) this.camposFaltantes.push('apellido-conductor');
    if (!dni) this.camposFaltantes.push('cedula-conductor');
    if (!fechaNacimiento) this.camposFaltantes.push('fecha-nacimiento');
  
    // Si hay campos faltantes, muestra un mensaje de error y aplica un efecto visual
    if (this.camposFaltantes.length > 0) {
      this.activarParpadeo(this.camposFaltantes);
      this._snackBar.open('Por favor, complete los campos requeridos.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return false;
    }
    this.nuevoConductor.fechaAlta = new Date();
    return true;
  }

  // Método para activar el parpadeo de los campos faltantes
  activarParpadeo(campos: string[]) {
    campos.forEach((campoId) => {
      const elemento = document.getElementById(campoId);
      if (elemento) {
        elemento.classList.add('input-error-blink');
        // Remueve la clase después de 2 segundos
        setTimeout(() => {
          elemento.classList.remove('input-error-blink');
        }, 1500);
      }
    });
  }

  // Método para quitar el efecto visual de error de un campo
  quitarError(campoId: string): void {
    const elemento = document.getElementById(campoId);
    if (elemento) {
      elemento.classList.remove('input-error');
    }
  }
  
  // Método para guardar un nuevo conductor
  guardarNuevoConductor() {
    this.conductorService.registrarConductor(this.nuevoConductor).subscribe({
      next: (c) => {
        console.log(c);
        this.conductorGuardado = c;
      },
      error: (error) => console.log(error),
      complete: () => {
        // Redirige a la lista de conductores pasando el id del nuevo conductor como parámetro
        this.router.navigate(['/lista-conductores'], { queryParams: { newConductorId: this.conductorGuardado.id } });
      }
    });
  }
  
  // Método que solo permite ingresar números en el campo de cédula (DNi)
  handleNonNumericCount(count: number, anyo: string) {
    (count >= 3 && anyo === 'cedula') ?   this.nonNumericError = true :  this.nonNumericError = false;
  }

  // Método para redirigir a la lista de viajes de un conductor
  irListaViajes(id:number){
    this.router.navigate(['/lista-viajes', id]);
  }

}
