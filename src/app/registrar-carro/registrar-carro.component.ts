import { Component, OnInit } from '@angular/core';
import { Carro } from '../carro';
import { CarroService } from '../carro.service';
import { Router } from '@angular/router';
import { faCar, faPlus, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-registrar-carro',
  templateUrl: './registrar-carro.component.html',
  styleUrl: './registrar-carro.component.css'
})
export class RegistrarCarroComponent  implements OnInit{

carro : Carro =  new Carro();
carroLista : Carro [] ;
carIcon = faCar;
plusIcon = faPlusCircle;
mensaje : string = '';
anyoActual = new Date().getFullYear();

//variables validaciones input
generalErrorFlag = false;
noModeloError = false;
noMarcaError = false;
noAnyoError = false;
noNumeroUnidad = false;
nonNumericError = false;
nonNumericConsumo = false;
nonNumericNumUnidad = false;
unidadRepetida =  false;


//Mensajes Error
mensajeNumeroUnidadFormato : string = 'El número de unidad que intentas ingresar ya se encuentra registrado, por favor ingresa otro numero de unidad';
mensajeNumeroUnidadCampoObligatorio = 'El número de unidad es un campo obligatorio';
mensajeNumeroUnidadRegistrada = 'El número de unidad que has intentado registrar ya se encuentra asignado a otro carro, por favor registra la unidad con otro número'
mensajeCampoMarcaObligatorio = 'El campo Marca es obligario'

constructor(private carroServicio:CarroService,private router:Router,private _snackBar: MatSnackBar){}

ngOnInit(): void {
 this.obtenerCarros();
}

obtenerCarros(){
  this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
    this.carroLista = dato;
  });
}

validandoDatos(listaCarros: Carro[], nuevoNumeroUnidad: number): boolean {
  
  this.generalErrorFlag = false;
  const anyoActual = new Date().getFullYear();


    
  if (listaCarros.some(carro => carro.numeroUnidad == nuevoNumeroUnidad)) {
      this.generalErrorFlag = true;
      this.nonNumericNumUnidad = true;
  }

  if(this.carro.numeroUnidad === undefined || this.carro.numeroUnidad === null || this.carro.numeroUnidad === 0 || this.carro.numeroUnidad.toString().trim() == '') {
    this.noNumeroUnidad = true;
    this.generalErrorFlag = true;
}

  if (this.carro.solo_marca === undefined || this.carro.solo_marca === null ||  this.carro.solo_marca === '') {
     this.noMarcaError = true;
     this.generalErrorFlag = true;
  }


  if(this.carro.solo_modelo === undefined ||  this.carro.solo_modelo === null ||   this.carro.solo_modelo === '') {
      this.noModeloError = true;
      this.generalErrorFlag = true;
  }
 
  else {
  //trimeamos los inputs
  this.trimInputs();
  this.carro.modelo = this.carro.solo_marca.toUpperCase().concat(' ').concat(this.carro.solo_modelo.toUpperCase());
 
 }

  if(this.carro.anyo === undefined || this.carro.anyo ===null || this.carro.anyo === 0 || this.carro.anyo.toString().trim() == '') {
      this.noAnyoError = true;
      this.mensaje = 'El año es un campo obligatorio, por favor introduce el año del carro a registrar'
      this.generalErrorFlag = true;
  }


  else if((this.carro.anyo.toString().trim() != '')  &&  this.carro.anyo < 1900 || this.carro.anyo > anyoActual) {
    this.noAnyoError = true;
    this.mensaje = 'Año invalido, introduzca un año entre 1900 y ' + anyoActual;
    this.generalErrorFlag = true;
  }


  if(this.generalErrorFlag === true)
  return false;

  else
  return true;

}

guardarCarro(){

  if(this.validandoDatos(this.carroLista, this.carro.numeroUnidad)){
    this.carroServicio.registrarCarro(this.carro).subscribe(dato => {
    console.log(dato)
    this._snackBar.open('Carro registrado con éxito.', '', {
      duration: 2000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
  })
    this.irListaCarro();
    }, error => console.log(error));
  }

}

private trimInputs(){
  if(this.carro.solo_marca)
  this.carro.solo_marca = this.carro.solo_marca.trim();
  if(this.carro.solo_modelo)
  this.carro.solo_modelo = this.carro.solo_modelo.trim();
}


irListaCarro() {
this.router.navigate(['/carros']);
}

onSubmit(){
  this.guardarCarro();
}


handleNonNumericCount(count: number , anyo: string) {
  (count >= 3 && anyo === 'anyo') ?   this.nonNumericError = true :  this.nonNumericError = false;
  (count >= 3 && anyo === 'consumo') ?   this.nonNumericConsumo = true :  this.nonNumericConsumo = false;
  (count >= 3 && anyo === 'numeroUni') ?   this.nonNumericNumUnidad = true :  this.nonNumericNumUnidad = false;
}

  onInputChange() {
    // Aquí puedes agregar la lógica que deseas ejecutar mientras escribes en el input.

        if(this.carro.solo_marca != '' && this.carro.solo_marca != undefined)
        this.noMarcaError = false;
    
        if(this.carro.solo_modelo != '' && this.carro.solo_modelo != undefined) 
          this.noModeloError = false;

        if(this.carro.anyo != undefined &&  this.carro.anyo.toString().trim()  != '')  
          this.noAnyoError = false;

        if(this.carro.numeroUnidad != undefined &&  this.carro.numeroUnidad.toString().trim() != '') 
          this.noNumeroUnidad = false;
  }
}



