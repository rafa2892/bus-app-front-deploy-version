    import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faCar, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { TITLES } from '../../../../constant/titles.constants';
import { Carro } from '../../../../core/models/carro';
import { Imagen } from '../../../../core/models/imagen';
import { TipoVehiculo } from '../../../../core/models/tipo-vehiculo';
import { CarroService } from '../../../../core/services/carro.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
    
    export interface FileWithId {
      file: File;
      id: number | null;
    }

    @Component({
      selector: 'app-registrar-carro',
      templateUrl: './registrar-carro.component.html',
      styleUrl: './registrar-carro.component.css'
    })
    export class RegistrarCarroComponent  implements OnInit {

    carroForm: FormGroup;
    step: number = 5;

    selectedFilesWithId: FileWithId[] = [];

    carro : Carro =  new Carro();
    carroLista : Carro [] ;
    carIcon = faCar;
    plusIcon = faPlusCircle;
    mensaje : string = '';
    anyoActual = new Date().getFullYear();
    existePDFTitulo : boolean | undefined = false;

    //Poliza variables aux
    diasVencimiento : any = '';
    diasVencimientoStyle: string = '';

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
    tituloPropiedadPDFSelectedFile : File | null = null;
    tituloProPiedadPDFName : string;

    imagenes: string [];
    imagenesBase64 : string [];
    imagenesGuardar : Imagen [] = [];
    imagenesBD : Imagen [] = [];

    listaTipoVehiculos : TipoVehiculo [] = [];
    tipoVehiculo :string;
    idSeleccionada: number = 0;

    // Campos faltantes en el formulario
    camposFaltantes: string[] = [];

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
      private fb: FormBuilder,
      private gb:GlobalUtilsService,
      private cdr: ChangeDetectorRef){
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

    async checkPDFexist(carro:Carro) {
      if(carro && carro.id) {
        this.existePDFTitulo = await this.carroServicio.existeTituloPropiedadPdfFILE(carro.id);
      }
    }

    ngAfterViewInit(): void {
      this.addCommonStyles();
    }

    ngAfterViewChecked(): void {
      this.addCommonStyles();
    }

    inicializateCarroForm(fb: FormBuilder) {

      this.carroForm = this.fb.group({
        carro: this.fb.group({
          id:[null],
          marca: [null, Validators.required],
          modelo: [null, Validators.required],
          anyo: [null, Validators.required],
          tipoVehiculo: [null, Validators.required],
          consumo: [null, Validators.required],
          numeroUnidad: [null, Validators.required],

          bateria: this.fb.group({
            id:[null],
            marca: [null],
            modelo: [null],
            capacidad: [null],
            fechaInstalacion: [null],
            fechaRetiro: [null],
            observaciones: [null],
          }),

          tituloPropiedad: this.fb.group({
            id:[null],
            nombre: [null],
            observaciones: [null],
            archivoPDF: [null],
            archivoPDFnombre : [null]
          }),

          poliza: this.fb.group({
            id:[null],
            aseguradora: [null],
            poliza: [null],
            vigente: [null],
            tipo: [null],
            cobertura: [null],
            observaciones: [null],
            fechaExpire: [null],
            fechaInicio: [null],
            diasPorVencer: [{ value: null, disabled: true }],
          }),
          imagenes: this.fb.array([]),
        }),
      });
    }

    addCommonStyles() {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        input.classList.add('form-control');
        input.classList.add('defaultSizeInput');
        input.classList.add('input-custom-style');
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
        this.setFiles();
        this.setFormulario();
        this.checkPDFexist(this.carro);
      });
      return this.carro;
    }


    setFiles() {
      // Agregar las imágenes del carro a la lista de archivos seleccionados
      if (this.carro.imagenesBd && this.carro.imagenesBd.length > 0) {
            this.imagenesBD = this.carro.imagenesBd;
            this.carro.imagenesBd.forEach(imagen => {
              // Simular la creación de un objeto File utilizando la URL de la imagen
              const file = new File([imagen.imagenUrl], imagen.imagenDesc);
              this.selectedFilesWithId.push({ file, id: imagen.id });
            });
      }
      // Agrega el archivo de la base de datos al formulario
      if(this.carro.tituloPropiedad && this.carro.tituloPropiedad.archivoPDF) {
          this.tituloPropiedadPDFSelectedFile = this.carro.tituloPropiedad.archivoPDF;
      } 
    }

    setFormulario() {

        // Rellenar el formulario con los datos del carro
        this.carroForm.patchValue({
          carro: {
            id : this.carro.id,
            marca: this.carro.marca,
            modelo: this.carro.modelo,
            anyo: this.carro.anyo,
            tipoVehiculo: this.carro.tipoVehiculo,
            consumo: this.carro.consumo,
            numeroUnidad: this.carro.numeroUnidad,
            bateria: this.carro.bateria,
            tituloPropiedad: this.carro.tituloPropiedad,
            poliza: this.carro.poliza,
            imagenes: this.carro.imagenes,
          }
        });
    }

    //Obtiene el nombre del archivo
    getNamePDFFile() : string {

      if(this.tituloPropiedadPDFSelectedFile && this.tituloPropiedadPDFSelectedFile.name) {
          return this.tituloPropiedadPDFSelectedFile.name;
      }

      else if (this.carro && this.carro.tituloPropiedad && this.carro.tituloPropiedad.archivoPDF && this.carro.tituloPropiedad.archivoPDFnombre) {
              return this.carro.tituloPropiedad.archivoPDFnombre
      }

      else 
      return 'Nombre no encontrado';
    }

    obtenerCarros(){
      this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
        this.carroLista = dato;
      });
    }

    async onSubmit(){
      const formValido = await this.validandoDatos();
      if(formValido) {
        this.guardarCarro(formValido);
      }
    }

    parametrizarCarro() {
      const datosLimpios = JSON.parse(JSON.stringify(this.carroForm.value, (key, value) =>
        (value && typeof value === "object" && Object.values(value).every(v => v === null)) ? null : value
      ));

      if(datosLimpios){
        this.carro = datosLimpios.carro;
      }
    }

    async guardarCarro(formValido:boolean) {
        if(formValido) {
            this.convertirImagenesABase64().then(() => {
              this.convertirMayus();
              this.carro.imagenes = this.imagenesGuardar;
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
          }else {
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
        }).catch(error => {
          console.error('Error al convertir imágenes a base64:', error);
        });
      }
    }

    async validandoDatos():  Promise<boolean> {

        this.parametrizarCarro();
        const anyoActual = new Date().getFullYear();
        this.camposFaltantes = [];

        const { numeroUnidad, marca, modelo, anyo, tipoVehiculo } = this.carro;

        // Verifica cada campo
        if (!numeroUnidad) this.camposFaltantes.push('carro-numero-unidad');
        if (!marca) this.camposFaltantes.push('carro-marca');
        if (!modelo) this.camposFaltantes.push('carro-modelo');
        if (!anyo) this.camposFaltantes.push('carro-anyo');
        if (!tipoVehiculo) this.camposFaltantes.push('tipo-vehiculo-select-component');

        let mensajeError = TITLES.ERROR_REQUIRED_FIELDS;

        if(anyo && (this.carro.anyo < 1900 || this.carro.anyo > anyoActual)) {
          mensajeError = 'El año introducido tiene que ser un año valido'
          this.camposFaltantes.push('carro-anyo');
        }

        // Esperar respuesta de la API antes de continuar
        if (numeroUnidad) {
          const existe = await this.carroServicio.verificarExistenciaPorNumeroUnidad(numeroUnidad).toPromise();
          if (existe) {
            this.camposFaltantes.push('numero-unidad');
            mensajeError = 'El número de unidad ya se  encuentra registrado a otra unidad'
          }
        }
        // Si hay campos faltantes, muestra un mensaje de error y aplica un efecto visual
        if (this.camposFaltantes.length > 0) {
          this.gb.activarParpadeo(this.camposFaltantes);
          this._snackBar.open(mensajeError, 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          return true;
        };
        return true;
  }

    async guardadoBasico() {
        const formValido = await this.validandoDatos();
        if(formValido){
          const confirmarGuardado = await this.confirmaGuardado(this.carro);
          if(confirmarGuardado)
            this.guardarCarro(formValido);
        }
      }

    async confirmaGuardado(carro:Carro): Promise<boolean> {
      const result = await Swal.fire({
          title: 'Registro basico',
          html: 'Se guardara el vehiculo en la base de datos solo con los datos basicos',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar',
          reverseButtons: true,
      });
      if (!result.isConfirmed) {
        return false; // Detenemos el flujo
      }else {
      return true;
      }
    }

    convertirImagenesABase64(): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const promises: Promise<void>[] = [];
        for (let i = 0; i < this.selectedFilesWithId.length; i++) {
          // promises.push(this.leerArchivoComoDataURL(this.selectedFiles[i], this.imagenesBD[i]));
          promises.push(this.leerArchivoComoDataURL(this.selectedFilesWithId[i]));
        }
        Promise.all(promises)
          .then(() => resolve())
          .catch(error => reject(error));
      });
    }

    async leerArchivoComoDataURL(fileWithId:FileWithId ): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const base64String = reader.result as string;
          let imagen = new Imagen();

          imagen.imagenDesc = fileWithId.file.name;
          imagen.imagenUrl = base64String; // url
          imagen.imagen = base64String; // url

          if(fileWithId.id) {
            imagen.id = fileWithId.id
          }
          //Agregamos cada imagen en formato base64 para enviar al back
          this.imagenesGuardar.push(imagen);
          resolve();
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(fileWithId.file);
      });
    }

    convertirMayus() {
    // this.carro.marca = this.carro.marca.trim().toLocaleUpperCase();
    // this.carro.modelo = this.carro.modelo.trim().toLocaleUpperCase();
    }

    irListaCarro() {
    this.router.navigate(['/lista-carros']);
    }

    handleNonNumericCount(count: number , anyo: string) {
      (count >= 3 && anyo === 'anyo') ?   this.nonNumericError = true :  this.nonNumericError = false;
      (count >= 3 && anyo === 'consumo') ?   this.nonNumericConsumo = true :  this.nonNumericConsumo = false;
      (count >= 3 && anyo === 'numeroUni') ?   this.nonNumericNumUnidad = true :  this.nonNumericNumUnidad = false;
    }

    onInputChange() {
      if(this.carro.marca != '' && this.carro.marca != undefined)
      this.noMarcaError = false;
  
      if(this.carro.modelo != '' && this.carro.modelo != undefined) 
        this.noModeloError = false;

      if(this.carro.anyo != undefined &&  this.carro.anyo.toString().trim()  != '')  
        this.noAnyoError = false;

      if(this.carro.numeroUnidad != undefined &&  this.carro.numeroUnidad.toString().trim() != '') 
        this.noNumeroUnidad = false;
    }

    // onFileSelected(event:any) {
    //   const files: FileList = event.target.files;
    //   for (let i = 0; i < files.length; i++) {
    //     const file = files.item(i);
    //     if (file) {
    //       // Verificar si el archivo no está ya en la lista
    //       if (!this.selectedFilesWithId.some(existingFile => existingFile.file.name === file.name)) {
    //             this.selectedFilesWithId.push({file, id:null});
    //       }
    //     }
    //   }
    // }

    onFileSelected(event: any) {


      const files: FileList = event.target.files;


      for (let i = 0; i < files.length; i++) {

        const file = files.item(i);


        if (file) {

          const reader = new FileReader();
          
          reader.onload = (e: any) => {


            let  imageUrl = e.target.result;

            // Crear un objeto de tipo Imagen
            const nuevaImagen: Imagen = {
              id: null,
              imagen: imageUrl,  // Usamos la URL de la imagen en base64
              imagenDesc: file.name,  // Usamos el nombre del archivo como descripción
              imagenUrl: imageUrl    // La URL de la imagen
            };

            // Agregar la nueva imagen a la lista
            if (!this.carro.imagenesBd) {
              this.carro.imagenesBd = [];
            }
            this.selectedFilesWithId.push({file, id:null});
            this.carro.imagenesBd.push(nuevaImagen);

            // Forzar la actualización de la vista
            this.cdr.detectChanges();
          };
    
          // Leer el archivo como URL de datos
          reader.readAsDataURL(file);
        }
      }
    }
    
    

    onPdfSelected(event: any) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);  // Leer el archivo como Base64
        reader.onload = () => {

          const base64File = reader.result as string;  // El archivo en formato Base64
          this.tituloPropiedadPDFSelectedFile = file;
    
          // Eliminar el prefijo 'application/pdf;base64,' del Base64
          const base64Data = base64File.split(',')[1];  // Obtiene solo la parte base64 sin el prefijo
          console.log(base64Data);
    
          // Asignar el archivo Base64 al formulario
          this.carroForm.patchValue({
            carro: {
              tituloPropiedad: {
                archivoPDF: base64Data,
                archivoPDFnombre: file.name
                  // Asignar la cadena Base64 sin el prefijo
              }
            }
          });
        };
      }
    }
      
    backStep() {
      if(this.step > 1) 
          this.step = (this.step - 1);
    }

    nextStep() {
        if(this.step === 1)
        this.step = 2;
        else if (this.step === 2 && this.carroForm.get('carro.bateria')?.valid) {
        this.step = 3;
      } else if (this.step === 3 && this.carroForm.get('carro.tituloPropiedad')?.valid) {
        this.step = 4;
      } else if (this.step === 4 && this.carroForm.get('carro.poliza')?.valid) {
      this.step = 5; // Paso 5: Imágenes
      } else if (this.step === 5 && this.carroForm.get('carro.imagenes')?.valid) {
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

    calculoDiasVencimiento() {
      const dataForm = this.carroForm.value;

      if(dataForm.carro.poliza.fechaInicio && dataForm.carro.poliza.fechaExpire) {

      const fechaExp = dataForm.carro.poliza.fechaInicio;
      const fechaVenc = dataForm.carro.poliza.fechaExpire;

      const diffTime = Math.abs(fechaVenc.getTime() - fechaExp.getTime()); // Diferencia en milisegundos
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); 

      if(fechaVenc > fechaExp) {
        this.carroForm.get('carro.poliza.diasPorVencer')?.setValue(diffDays);
        if(diffDays > 30 && diffDays < 60) {this.diasVencimientoStyle = 'yellow-warn'}
        if(diffDays < 30) {this.diasVencimientoStyle = 'danger-warn'}
        if(diffDays > 60) {this.diasVencimientoStyle = 'green'}
      }else{ this.carroForm.get('carro.poliza.diasPorVencer')?.setValue('');}
        

        // const diasControl = this.carroForm.get('carro.poliza.diasPorVencer');
        // console.log(diasControl);

        // this.carroForm.get('carro.poliza')?.setValue({
        //   ...this.carroForm.get('carro.poliza')?.value,  // Mantiene los valores actuales
        //   diasPorVencer: diffDays  // Actualiza el valor específico
        // });
      //   if(fechaVenc > fechaExp) {
      //    // Actualizar el valor en el formulario
      //     this.carroForm.patchValue({
      //       carro: {
      //           poliza: {
      //               diasPorVencer: diffDays // Asigna el valor de los días vencidos al formulario
      //           }
      //       }
      //   });
      // }else {
      //   this.carroForm.patchValue({
      //     carro: {
      //         poliza: {
      //             diasPorVencer: '' // Asigna el valor de los días vencidos al formulario
      //         }
      //     }
      // });
      // }
      }
    }

  getDiasVencimientoStyle():string {
    return this.diasVencimientoStyle ? this.diasVencimientoStyle : '';
  }

  async descargarTituloPdf(carroId: number) {
    if(this.existePDFTitulo) {
      try {
        // Servicio descarga titulo propiedad pdf
        this.carroServicio.descargarTituloPropiedad(carroId);
        console.log('Se ha iniciado la descarga del archivo');
      } catch (error) {
        console.error('Error al iniciar la descarga del archivo:', error);
      }
    }
  }

  getImagenUrl(carro:Carro):any {
    return this.carroServicio.getImagenUrl(carro);
  }

  pruebaMostrarImagenes() {
    console.log(this.carro);
  }
}
