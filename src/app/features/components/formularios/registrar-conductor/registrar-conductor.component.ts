import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faIdCard, faListAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Conductor } from '../../../../core/models/conductor';
import { ConductorService } from '../../../../core/services/conductor.service';
import { TITLES } from '../../../../constant/titles.constants';




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
  detailIcon = faListAlt;

  // Parámetros de la vista o component
  nonNumericError: boolean;
  nuevoConductor: Conductor = new Conductor();
  conductorGuardado: any = new Conductor();
  isDesdeDetalles: boolean = false;
  titulo : string = TITLES.ADD_DRIVER;

  // Parametros de la vista detalles del conductor
  numeroViajes: any;

  // Campos faltantes en el formulario
  camposFaltantes: string[] = [];

  //constantes
  KM_REGISTRADOS_LABEL = TITLES.KM_REGISTERED;
  DADO_ALTA_POR_LABEL = TITLES.CREATED_BY_USER;
  NUM_VIAJES_LABEL = TITLES.REGISTERED_TRIPS;
  FECHA_ALTA = TITLES.REGISTRATION_DATE;
  GUARDAR = TITLES.SAVE;
  EDITAR = TITLES.EDIT;
  VOLVER = TITLES.BACK;
  CEDULA_CONDUCTOR_LABEL = TITLES.DNI_DRIVER;
  DATE_OF_BIRTH_LABEL = TITLES.DATE_OF_BIRTH;
  ERROR_ONLY_NUMBERS = 'Solo se permiten números';
  NOMBRE_LABEL = TITLES.NAME;
  APELLIDO_LABEL = TITLES.LAST_NAME
  NO_KM_REGISTERED = TITLES.NO_DATA;

  constructor(
    private conductorService:ConductorService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location ) {
   // Tipo de documento por defecto (Cédula)
    this.nuevoConductor.dniTipo = 'V';
  }

  ngOnInit(): void {

    //Reinicia el valor de la variable, para evitar que se mantenga en true y se muestren
    //los detalles del conductor cuando se está registrando uno nuevo o editando
    this.isDesdeDetalles = false;

    const id = + this.activatedRoute.snapshot.paramMap.get('id')!;
    const isDesdeDetalles = this.activatedRoute.snapshot.paramMap.get('isDesdedetalles'); 
    this.isDesdeDetalles = isDesdeDetalles === 'true';

    if(id) {
      this.titulo = TITLES.EDIT_DRIVER;
      this.obtenerConductorPorId(id);
    }

    if(this.isDesdeDetalles) {
      this.titulo = TITLES.VIEW_CONDUCTOR;
      this.obtenerListaViajePorConductor(id);
    }
  }

  obtenerConductorPorId(id: number) {
    this.conductorService.obtenerConductorPorId(id).subscribe({
      next: (c) => {
        this.nuevoConductor = c;
        this.darFormatoFecha(this.nuevoConductor);
        // this.parametrizeConductor(this.nuevoConductor);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Conductor cargado')
    });
  }

  darFormatoFecha(conductor: Conductor) {
    if (conductor.fechaAlta) {
      const fecha = new Date(conductor.fechaAlta);
      // Extraer el día, mes y año
      const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
      const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // getMonth() empieza desde 0, así que sumamos 1
      const año = fecha.getFullYear();
      
      // Formatear la fecha como dd/mm/yyyy
      conductor.fechaAltaString = `${dia}/${mes}/${año}`;
      
    }
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit(){
      if(this.validarDatos()) {
        if(this.nuevoConductor.id) { 
          this.editarConductor();
        }
        else{
        this.guardarNuevoConductor();
        }
      }
  }

  editarConductor() {
    this.conductorService.editar(this.nuevoConductor).subscribe({
      next: (c) => {
        console.log(c);
        this.conductorGuardado = c;
      },
      error: (error) => console.log(error),
      complete: () => {
        this.router.navigate(['/lista-conductores'], { queryParams: { newConductorId: this.conductorGuardado.id } });
      }
    });
  }
  // Método que se ejecuta al enviar el formulario
  validarDatos(): boolean {
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
      this._snackBar.open(TITLES.ERROR_REQUIRED_FIELDS, 'Cerrar', {
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

  private obtenerListaViajePorConductor(idConductor: number)  {
    this.conductorService.viajeCounter(idConductor).subscribe(dato =>  {
      if(dato === 0) {
        this.numeroViajes = TITLES.NO_VIAJES;
      }
      else{
        this.numeroViajes = dato; 
      }
    });
  }

  // Método para redirigir a la lista de viajes de un conductor
  irListaViajes(id:number){
    this.obtenerListaViajePorConductor(id);
    if(this.numeroViajes === 0 || this.numeroViajes === TITLES.NO_VIAJES) { 
      const nombreCompleto = this.nuevoConductor.nombre.concat(' ').concat(this.nuevoConductor.apellido);
      this._snackBar.open(TITLES.NO_VIAJES_REGISTERED(nombreCompleto), 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      return;
    }
    else{
    this.router.navigate(['/lista-viajes', id]);
    }
  }

  volverAtras() {
    this.location.back();
  }

}
