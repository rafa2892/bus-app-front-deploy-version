import { Component, OnInit } from '@angular/core';
import { Carro } from '../../../../core/models/carro';
import { CarroService } from '../../../../core/services/carro.service';
import { Router,ActivatedRoute } from '@angular/router';
import { faCar, faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Imagen } from '../../../../core/models/imagen';
import { TipoVehiculo } from '../../../../core/models/tipo-vehiculo';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TITLES } from '../../../../constant/titles.constants';


@Component({
  selector: 'app-registrar-carro',
  templateUrl: './registrar-carro.component.html',
  styleUrl: './registrar-carro.component.css'
})
export class RegistrarCarroComponent  implements OnInit {

  carroForm: FormGroup;
  step: number = 4;
  ; // Para rastrear el paso actual

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

//Parametros
selectedFiles: File[] = [];
imagenes: string [];
imagenesBase64 : string [];
imagenGuardar : Imagen [] = [];
listaTipoVehiculos : TipoVehiculo [] = [];
tipoVehiculo :string;
idSeleccionada: number = 0;


//LITERALES
OBSERVACION_TITULO = TITLES.COMMENTS_LABEL_TITLE;
RAZON_TITULO = TITLES.NAME_COMPANY_PERSON_TITLE;

//Mensajes Error
mensajeNumeroUnidadFormato : string = 'El número de unidad que intentas ingresar ya se encuentra registrado, por favor ingresa otro numero de unidad';
mensajeNumeroUnidadCampoObligatorio = 'El número de unidad es un campo obligatorio';
mensajeNumeroUnidadRegistrada = 'El número de unidad que has intentado registrar ya se encuentra asignado a otro carro, por favor registra la unidad con otro número'
mensajeCampoMarcaObligatorio = 'El campo Marca es obligario'

constructor(
  private carroServicio:CarroService,
  private router:Router,
  private _snackBar: MatSnackBar,
  private route: ActivatedRoute,
  private fb: FormBuilder){
    this.inicializateCarroForm(fb);
  }

  

ngOnInit(): void {
  this.route.params.subscribe(params => {
      const id = +params['id'];
      this.idSeleccionada = id;
      if (id) {
          this.obtenerCarroPorId(id);
      }
      this.obtenerCarros();
  });
  this.obtenerListaTipoVehiculos();
}

ngAfterViewInit(): void {
  this.addCommonStyles();
}

ngAfterViewChecked(): void {
  this.addCommonStyles();
}

inicializateCarroForm(fb:FormBuilder) {
  this.carroForm = this.fb.group({
    carro: this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anyo: ['', Validators.required],
      tipoVehiculo: ['', Validators.required],
      consumo: ['', Validators.required],
      numeroUnidad: ['', Validators.required],
    }),
    bateria: this.fb.group({
      marca: [''],
      modelo: [''],
      capacidad: [''],
      fechaInstalacion: [''],
      fechaRetiro: [''],
      observaciones: [''],
    }),
    tituloPropiedad: this.fb.group({
      nombre: [''],
      apellido: [''],
      observaciones: [''],
      imagen: [''],
    }),
    poliza: this.fb.group({
      aseguradora: [''],
      poliza: [''],
      vigente: [null],
      tipo: [''],
      cobertura: [''],
      observaciones: [''],
      fechaExpire: [null],
      fechaInicio: [null],
      diasPorVencer: [{ value: null, disabled: true }],
    }),
    imagenes: this.fb.array([]),
  });
}

addCommonStyles() {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.classList.add('form-control');
    input.classList.add('defaultSizeInput');
  });

  const textAreas = document.querySelectorAll('textarea');
  textAreas.forEach(input => {
    input.classList.add('form-control');
    input.classList.add('textarea-custom-style');
  });
  
}

obtenerListaTipoVehiculos(){
  this.carroServicio.obtenerListaTipoVehiculos().subscribe(dato =>  {
    this.listaTipoVehiculos = dato;
  });
}

obtenerCarroPorId(id: number): Carro {
  this.carroServicio.obtenerCarroPorId(id).subscribe(carro => {
    this.carro = carro;
    this.selectedFiles = []; // Limpiar la lista de archivos seleccionados
    // Agregar las imágenes del carro a la lista de archivos seleccionados
    if (this.carro.imagenes && this.carro.imagenes.length > 0) {
      this.carro.imagenes.forEach(imagen => {
        // Simular la creación de un objeto File utilizando la URL de la imagen
        const file = new File([imagen.imagenUrl], imagen.imagenDesc);
        this.selectedFiles.push(file);
      });
    }
  });
  return this.carro;
}

obtenerCarros(){
  this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
    this.carroLista = dato;
  });
}



validandoDatos(listaCarros: Carro[], nuevoNumeroUnidad: number): boolean {

  this.convertirImagenesABase64();
  this.asignarValoresCarro();

  this.generalErrorFlag = false;
  const anyoActual = new Date().getFullYear();

  if(listaCarros.some(carro => carro.numeroUnidad === nuevoNumeroUnidad)) {
      console.log(listaCarros);
      this.generalErrorFlag = true;
      this.nonNumericNumUnidad = true;
  }

  if(this.carro.numeroUnidad) {
    this.noNumeroUnidad = true;
    this.generalErrorFlag = true;
  }

  if (this.carro.marca) {
      this.noMarcaError = true;
      this.generalErrorFlag = true;
  }

  if(this.carro.modelo) {
      this.noModeloError = true;
      this.generalErrorFlag = true;
  }

  if(this.carro.anyo) {
      this.noAnyoError = true;
      this.mensaje = 'El año es un campo obligatorio, por favor introduce el año del carro a registrar'
      this.generalErrorFlag = true;
  }

  else if((this.carro.anyo)  &&  this.carro.anyo < 1900 || this.carro.anyo > anyoActual) {
    this.noAnyoError = true;
    this.mensaje = 'Año invalido, introduzca un año entre 1900 y ' + anyoActual;
    this.generalErrorFlag = true;
  }

  if(this.generalErrorFlag === true)
    return false;

  else
    return true;
}

asignarValoresCarro() {
  const formData = this.carroForm.value;
  this.carro = formData.carro;
  this.carro.bateria = formData.bateria;
  this.carro.poliza = formData.poliza;
  this.carro.tituloPropiedad = formData.tituloPropiedad;
}

convertirImagenesABase64(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.imagenes = [];
    const promises: Promise<void>[] = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      promises.push(this.leerArchivoComoDataURL(this.selectedFiles[i]));
    }
    Promise.all(promises)
      .then(() => resolve())
      .catch(error => reject(error));
  });
}

async leerArchivoComoDataURL(file: File): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.imagenes.push(base64String);
      let imagen = new Imagen();
      imagen.imagenDesc = file.name;
      imagen.imagenUrl = base64String; // url
      imagen.imagen = base64String; // url
      this.imagenGuardar.push(imagen);
      resolve();
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

guardarCarro() {

  this.convertirImagenesABase64().then(() => {
    if (this.validandoDatos(this.carroLista, this.carro.numeroUnidad)) {
      this.convertirMayus();
      this.carro.imagenes = this.imagenGuardar;

      if(this.carro.id != null && this.carro.id != undefined && this.carro.id > 0) {
        this.carroServicio.actualizarCarro(this.carro.id, this.carro).subscribe(dato => {
        this._snackBar.open('Carro registrado con éxito.', '', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.irListaCarro();
      }, error => console.log(error));
    }
    else {
      console.log(this.carro);
        this.carroServicio.registrarCarro(this.carro).subscribe(dato => {
        this._snackBar.open('Carro registrado con éxito.', '', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        this.irListaCarro();
      }, error => console.log(error));
    }
    }
  }).catch(error => {
    console.error('Error al convertir imágenes a base64:', error);
  });
}

private trimInputs(){
  if(this.carro.marca)
  this.carro.marca = this.carro.marca.trim();
  if(this.carro.modelo)
  this.carro.modelo = this.carro.modelo.trim();
}

convertirMayus() {
// this.carro.marca = this.carro.marca.trim().toLocaleUpperCase();
// this.carro.modelo = this.carro.modelo.trim().toLocaleUpperCase();
}

irListaCarro() {
this.router.navigate(['/lista-carros']);
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

        if(this.carro.marca != '' && this.carro.marca != undefined)
        this.noMarcaError = false;
    
        if(this.carro.modelo != '' && this.carro.modelo != undefined) 
          this.noModeloError = false;

        if(this.carro.anyo != undefined &&  this.carro.anyo.toString().trim()  != '')  
          this.noAnyoError = false;

        if(this.carro.numeroUnidad != undefined &&  this.carro.numeroUnidad.toString().trim() != '') 
          this.noNumeroUnidad = false;
  }



  onFileSelected(event:any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        // Verificar si el archivo no está ya en la lista
        if (!this.selectedFiles.some(existingFile => existingFile.name === file.name)) {
          this.selectedFiles.push(file);
        }
      }
    }
  }

  backStep() {
    if(this.step > 1) 
        this.step = (this.step - 1);
    }

  nextStep() {
      if(this.step === 1)
      this.step = 2;
     else if (this.step === 2 && this.carroForm.get('bateria')?.valid) {
      this.step = 3;
    } else if (this.step === 3 && this.carroForm.get('tituloPropiedad')?.valid) {
      this.step = 4;
    } else if (this.step === 4 && this.carroForm.get('poliza')?.valid) {
    this.step = 5; // Paso 5: Imágenes
    } else if (this.step === 5 && this.carroForm.get('imagenes')?.valid) {

    // Si estamos en el paso 5, envía los datos del formulario
      // this.onSubmit();

    } else {
      // Si el paso actual no es válido, mostrar un mensaje de error
      this._snackBar.open('Por favor complete todos los campos del paso actual.', '', {
        duration: 2000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }
  


  
  




}



