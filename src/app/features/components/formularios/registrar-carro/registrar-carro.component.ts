import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faCar, faComment, faEdit, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { TITLES } from '../../../../constant/titles.constants';
import { Carro } from '../../../../core/models/carro';
import { Imagen } from '../../../../core/models/imagen';
import { TipoVehiculo } from '../../../../core/models/tipo-vehiculo';
import { CarroService } from '../../../../core/services/carro.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
declare var bootstrap: any;


    export interface FileWithId {
      file: File;
      id: number | null;
      url : any;
    }

    @Component({
      selector: 'app-registrar-carro',
      templateUrl: './registrar-carro.component.html',
      styleUrl: './registrar-carro.component.css'
    })
    export class RegistrarCarroComponent  implements OnInit {

    carroForm: FormGroup;
    step: number =  1;

    selectedFilesWithId: FileWithId[] = [];

    carro : Carro =  new Carro();
    // carroLista : Carro [] ;
    carIcon = faCar;
    plusIcon = faPlusCircle;
    mensaje : string = '';
    anyoActual = new Date().getFullYear();
    existePDFTitulo : boolean | undefined = false;

    //Poliza variables aux
    diasPorVencer : any = '';
    diasVencimientoStyle: string = '';

    //Parametros
    tituloPropiedadPDFSelectedFile : File | null = null;
    tituloProPiedadPDFName : string;

    imagenes: string [];
    imagenesGuardar : Imagen [] = [];

    listaTipoVehiculos : TipoVehiculo [] = [];
    tipoVehiculo :string;
    idSeleccionada: number = 0;

    // Campos faltantes en el formulario
    camposFaltantes: string[] = [];
    cambiosFormularioFiles: boolean = false;

    isDisabledTitleFlag : boolean = true
    isEditMode : boolean = true;

    //LITERALES
    OBSERVACION_TITULO = TITLES.COMMENTS_LABEL_TITLE;
    RAZON_TITULO = TITLES.NAME_COMPANY_PERSON_TITLE;
    MSJ_BTON_NEXT_STEP = TITLES.TITLE_DISABLED_BTON_NEXT_STEP;
    TOOLTIP_MSJ_GUARDADO_BASICO = TITLES.SAVE_BASIC_INFO_CAR_TOOLTIP

    //Static Icon
    editIcon = faEdit;
    commentIcon = faComment;
    faPlus = faPlusCircle;

    //Bandera de carga
    isLoading: boolean = false;

    steps: number[] = [1, 2, 3, 4, 5]; // Los pasos disponibles

    async goToStep(stepNumber: number) {
      const datosValidos = await this.validandoDatos();
    
      if (datosValidos) {
        this.step = stepNumber;
    
        // Esperar a que Angular actualice la vista antes de hacer el scroll
        setTimeout(() => {
          window.scrollTo({
            top: window.scrollY + window.innerHeight / 3, // Ajusta según la posición deseada
            behavior: 'smooth' // Hace que el desplazamiento sea suave
          });
        }, 100);
      }
    }
    
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

          this.isLoading = true
          
          if (id) {
              this.obtenerCarroPorId(id);
          }else {
            // setTimeout(() => {  }, 2000);
              this.isLoading = false;
              this.customScroll(id);
          }
      });
      this.obtenerListaTipoVehiculos();
    }

    disableForm() {
      this.carroForm.disable();
    }

    ngAfterViewInit(): void {
      this.buildCustomsToolTipBS();
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
          anyo: [null, Validators.required,],
          tipoVehiculo: [null, Validators.required],
          consumo: [null],
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
          imagenesBd: this.fb.array([]),
        }),
      });
    }

    buildCustomsToolTipBS() {
      var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
      delay: { "show": 500, "hide": 500 } // Retraso en milisegundos
      });});
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

    async onSubmit(){
      const formValido = await this.validandoDatos();
      if(formValido) {
        this.guardarCarro(formValido);
      }
    }

    obtenerListaTipoVehiculos(){
      this.carroServicio.obtenerListaTipoVehiculos().subscribe(dato =>  {
        this.listaTipoVehiculos = dato;
      });
    }

    obtenerCarroPorId(id: number) {
      this.isLoading = true;

      this.carroServicio.obtenerCarroPorId(id).subscribe({
        next: (carro) => {
          this.carro = carro;
          this.setFiles();
          this.setFormulario();
          this.checkPDFexist(this.carro);
          this.checkIfEditionMode();
        },
        error: (error) => {
          console.error("Error al obtener el carro:", error);
        },
        complete: () => {
           //Scroll al medio automaticamente
          this.customScroll(id);
          this.isLoading = false;
        }
      });
    }

    customScroll(id:number) {
      setTimeout(() => {
        let scrollPosition = 0;

        if(id){
          scrollPosition = document.documentElement.scrollHeight / 2 - window.innerHeight / 2 + 100;
        } else {
          scrollPosition = document.documentElement.scrollHeight / 2 - window.innerHeight / 2 + 100;
        }
        this.isLoading = false;  // Desactivar la bandera de carga
        window.scrollTo({
          top: scrollPosition,  // Mueve el scroll al medio del contenido de la página
          behavior: 'smooth'    // Desliza suavemente hasta el centro
        });
      }, 0);
    }
    

    checkIfEditionMode() {
        // Recuperar el valor de `esEdicion` y asegurarse de que es booleano
      this.route.queryParams.subscribe(params => {
      this.isEditMode = params['esEdicion'] === 'true';
      });
      if(!this.isEditMode) {
        this.disableForm();
      }
    }
  

    setFiles() {
      // Agregar las imágenes del carro a la lista de archivos seleccionados
      if (this.carro.imagenesBd && this.carro.imagenesBd.length > 0) {
            this.carro.imagenesBd.forEach(imagen => {
              // Simular la creación de un objeto File utilizando la URL de la imagen
              const file = new File([imagen.imagenUrl], imagen.imagenDesc);
              this.selectedFilesWithId.push({ file, url: imagen.imagenUrl, id: imagen.id });
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
          }
        });

        // Agregar las imagenes al form
        this.carro.imagenesBd.forEach(imagen => {
          const imagenFormGroup = this.fb.group({
            id: [imagen.id],
            imagen: [imagen.imagen],
            imagenDesc: [imagen.imagenDesc],
            imagenUrl: [imagen.imagenUrl]
          });
          (this.carroForm.get('carro.imagenesBd') as FormArray).push(imagenFormGroup);
        });
        this.calculoDiasVencimiento();
    }


    async checkPDFexist(carro:Carro) {
      if(carro && carro.id) {
        this.existePDFTitulo = await this.carroServicio.existeTituloPropiedadPdfFILE(carro.id);
      }
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

    // obtenerCarros(){
    //   this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
    //     this.carroLista = dato;
    //   });
    // }

    parametrizarCarro() {
      const datosLimpios = JSON.parse(JSON.stringify(this.carroForm.value, (key, value) =>
        (value && typeof value === "object" && Object.values(value).every(v => v === null)) ? null : value
      ));
      if(datosLimpios){this.carro = datosLimpios.carro;}
    }

    async guardarCarro(formValido:boolean) {
      if(formValido) {
          this.convertirImagenesABase64().then(() => {
            this.convertirMayus();
            this.carro.imagenes = this.imagenesGuardar;
          if(this.carro.id != null && this.carro.id != undefined && this.carro.id > 0) {
            this.carroServicio.actualizarCarro(this.carro.id, this.carro).subscribe(c => {
            const id= c.id;
            this.gb.getSuccessfullMsj('Vehiculo editado con éxito.');
            this.irListaCarro(id);
          }, error => this.gb.showErrorMessageSnackBar('Error servidor '.concat(error)));
        }else {
            this.carroServicio.registrarCarro(this.carro).subscribe(c => {
            const id = c.id;  
            this.gb.getSuccessfullMsj('Vehiculo registrado con éxito.');
            this.irListaCarro(id);
          }, error => this.gb.showErrorMessageSnackBar('Error servidor '.concat(error)));
        }
      }).catch(error => {
        this.gb.showErrorMessageSnackBar('Error al convertir imágenes a base64:');
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

        //Evalua si el numero de unidad ya se encuentra registrado con otra unidad en modo edicion o creacion nueva
        if (numeroUnidad) {
            let existe;
            if(this.carro.id) {
              existe = await this.carroServicio.verificarNumeroUnidadModoEdicion(numeroUnidad, this.carro.id).toPromise();
            }else{
              existe = await this.carroServicio.verificarExistenciaPorNumeroUnidad(numeroUnidad).toPromise();
            }
        if (existe) {
          this.camposFaltantes.push('carro-numero-unidad');
          mensajeError = 'El número de unidad ya se encuentra registrado a otra unidad'
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
          return false; //FIXME
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

      let title;
      let text;

      if(carro.id) {
        title = 'Modificación de vehiculo';
        text = 'Atención, se modificara el vehiculo con los datos introducidos, ¿Desea continuar?'
      } else {
        title ='Registro basico';
        text = 'Se guardara el vehiculo en la base de datos solo con los datos basicos, ¿Desea continuar?'
      }


      const result = await Swal.fire({
          title: title,
          html: text,
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
      if(this.carro.marca && this.carro.modelo) {
        this.carro.marca = this.carro.marca.trim().toLocaleUpperCase();
        this.carro.modelo = this.carro.modelo.trim().toLocaleUpperCase();
      }
    }

    irListaCarro(id?:number) {
      this.router.navigate(['/lista-carros'], {
        queryParams: { newCarId: id } 
      });
    }

    onFileSelected(event: any) {

      //Activamos bandera de cambio
      this.cambiosFormularioFiles = true;

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

           //Inicializamos lista de imagenesBD en caso de que no este
            if (!this.carro.imagenesBd) {
              this.carro.imagenesBd = [];
            }
             // Agregar la nueva imagen a la lista y al selector
            this.selectedFilesWithId.push({file, url: imageUrl, id:null});

            //Al llenar esta lista, se renderiza en el front las imagenes seleccionadas con el getImgURL del servicio
            this.carro.imagenesBd.push(nuevaImagen);

            // Forzar la actualización de la vista
            this.cdr.detectChanges();
          };
          // Leer el archivo como URL de datos
          reader.readAsDataURL(file);
        }
      }
    }

    removeImage(imagen: Imagen) {
      //Activamos bandera de cambio
      this.cambiosFormularioFiles = true;
      this.carro.imagenesBd = this.carro.imagenesBd.filter(img => {
        // Comparar por imagenUrl cuando no tiene id (Imagen no persistida)
        if (!imagen.id && img.imagenUrl === imagen.imagenUrl) {
            return false;
        }else if (img.id === imagen.id) {
           return false; // Si todo coincide, eliminar la imagen
        }
        return true; // Mantener las imágenes que no coincidan completamente
      });

      this.selectedFilesWithId = this.selectedFilesWithId.filter(f => {
        // Comparar por imagenUrl
        if ( !f.id && f.url === imagen.imagenUrl) {
            return false;
        }else if (f.id && f.id === imagen.id) {
           return false; // Si todo coincide, eliminar la imagen
        }
        return true; // Mantener las imágenes que no coincidan completamente
      });

      //Buscar en `selectedFilesWithId` usando el nombre del archivo
      this.selectedFilesWithId = this.selectedFilesWithId.filter(item => item.id !== imagen.id);
      // Forzar actualización de la vista
      this.cdr.detectChanges();
    }
    
    onPdfSelected(event: any) {

      //Activamos bandera de cambio
      this.cambiosFormularioFiles = true;
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);  // Leer el archivo como Base64
        reader.onload = () => {

          const base64File = reader.result as string;  // El archivo en formato Base64
          this.tituloPropiedadPDFSelectedFile = file;
    
          // Eliminar el prefijo 'application/pdf;base64,' del Base64
          const base64Data = base64File.split(',')[1];  // Obtiene solo la parte base64 sin el prefijo
    
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
      console.log(this.step, "step")
      if(this.step > 1)  {
          this.step = (this.step - 1);
        }
    }

    async nextStep() {

    const isValidCarroForm = await this.validandoDatos();
      if(this.step === 1 && isValidCarroForm){
          this.step = 2;
      }else if (this.step === 2) {
          this.step = 3;
      } else if (this.step === 3) {
          this.step = 4;
      } else if (this.step === 4) {
          this.step = 5; 
      }
    }

    calculoDiasVencimiento() {
      const dataForm = this.carroForm.value;
      if(dataForm.carro.poliza.fechaInicio && dataForm.carro.poliza.fechaExpire) {

      // Asegúrate de que fechaInicio y fechaExpire sean Date (si no lo son, convertirlas)
      let fechaExp = new Date(dataForm.carro.poliza.fechaInicio);
      let fechaVenc = new Date(dataForm.carro.poliza.fechaExpire)

      const diffTime = Math.abs(fechaVenc.getTime() - fechaExp.getTime()); // Diferencia en milisegundos
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); 

      //Guardamos valor de dias vencimiento
      this.diasPorVencer = diffDays;

      if(fechaVenc >= fechaExp) {
      
        if(diffDays > 60) {this.diasVencimientoStyle = 'green'}
        if(diffDays > 30 && diffDays < 60){this.diasVencimientoStyle = 'yellow-warn'}
        if(diffDays < 30) {this.diasVencimientoStyle = 'danger-warn'}
        this.carroForm.get('carro.poliza.diasPorVencer')?.setValue(diffDays);
      }else{
          this.carroForm.get('carro.poliza.diasPorVencer')?.setValue('')
          this.diasPorVencer = '';
        }
        

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

  guardarDisabledButton() : boolean {
    if(this.cambiosFormularioFiles || this.carroForm.dirty) {return false;}
    else{return true;} 
  }

  getIconExpireDateCalculation(): string {
    if(this.diasPorVencer || this.diasPorVencer === 0) {
      const dv = this.diasPorVencer;
      if(dv > 60) return 'assets/okey-icon.png'
      if(dv > 30 && dv < 60) return 'assets/warning-icon.png'
      if(dv < 30) return 'assets/danger-icon.png'
    }
    return ''
  }

  getIconByStep(step:number)  {
    if(step === 0)
      return 'assets/bus-icon.png'
    if(step === 1) 
      return 'assets/battery-icon.png'
    if(step === 2) 
      return 'assets/property-title-icon.png'
    if(step === 3) 
      return 'assets/insurance-policy-icon.png'
    if(step === 4) 
      return'assets/images-icon.png'

    return '';
  }

  deleteTituloPDF() {
    // Limpiar la variable que contiene el archivo
    this.tituloPropiedadPDFSelectedFile = null;
    this.cambiosFormularioFiles = true;

    // Restablecer el input de archivo (opcional)
    const fileInput = document.getElementById('pdfUploader') as HTMLInputElement;

    if (fileInput) {
      fileInput.value = ''; // Borra el archivo seleccionado en el input
    }

    // Si tienes un FormControl para el PDF, también lo reseteas
    this.carroForm.get('carro.tituloPropiedad.archivoPDF')?.setValue(null);
    }

  async resetFormulario(carro:Carro) {
    const title = TITLES.RESTORE_MSJ_CONFIRM_TITLE_MODAL;
    const text = TITLES.RESTORE_MSJ_CONFIRM_MODAL;
    const confirma = await this.carroServicio.msjConfirmaModal(title, text);

    this.carroForm.reset();
    this.cambiosFormularioFiles = false

    if(confirma) {
      this.obtenerCarroPorId(carro.id);
    }
  }

  quitarError(campoId: string) {
    const elemento = document.getElementById(campoId);
    if(elemento && campoId === 'carro-anyo') {
      const elemento = document.getElementById(campoId);
      const anyoActual = new Date().getFullYear();
  
      this.carroForm.get('carro.anyo')?.valueChanges.subscribe(value => {
      if((value && value.length === 4 && value > 1900 && value <= anyoActual)) {
        elemento?.classList.remove('input-error');
      }});
    }else if(elemento) {
        elemento.classList.remove('input-error');
    }
  }
}
