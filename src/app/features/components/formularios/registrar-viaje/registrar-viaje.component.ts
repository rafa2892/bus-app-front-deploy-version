import { ChangeDetectorRef, Component, NgZone, ViewEncapsulation } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Carro } from '../../../../core/models/carro';
import { Conductor } from '../../../../core/models/conductor';
import { Ruta } from '../../../../core/models/ruta';
import { TipoVehiculo } from '../../../../core/models/tipo-vehiculo';
import { Viaje } from '../../../../core/models/viaje';
import { CarroService } from '../../../../core/services/carro.service';
import { ConductorService } from '../../../../core/services/conductor.service';
import { ViajeServicioService } from '../../../../core/services/viaje-servicio.service';
import { TITLES } from '../../../../constant/titles.constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupMensajeConfirmarViajeComponent } from '../../modales/popup-mensaje-confirmar-viaje/popup-mensaje-confirmar-viaje.component';
import Swal from 'sweetalert2';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';

@Component({
  selector: 'app-registrar-viaje',
  templateUrl: './registrar-viaje.component.html',
  styleUrls: ['./registrar-viaje.component.css', './registrar-viaje.component.scss'],
  encapsulation: ViewEncapsulation.None,
    // Set ViewEncapsulation.None for encapsulation property
})
export class RegistrarViajeComponent {

    viaje : Viaje =  new Viaje();
    conductor: Conductor = new Conductor();
    ruta: Ruta = new Ruta();

    //spinner de carga
    loading = false;

    proposalPlaceSelectedEvent = false;
    modalConfirmacion = false;

    address: string = '';
    autocomplete: any;
    direccionSalida: string = '';
    direccionDestino: string = '';
    distancia: string = ''; // Distancia entre los puntos
    duracion: any = ''; // Duración estimada del viaje
    ciudadOrigen: string = '';
    ciudadDestino: string = '';
    estadoOrigen: string = '';
    estadoDestino: string = '';
    datosNoEncontrados = false;
    modalProgramatico: boolean = false;

    carros : Carro [];
    vehiculosAutoCompleteFilters : Carro [];
    carrosOrdenados : Carro [];
    conductores : Conductor [];
    conductoresAutoCompleteFilters : Conductor[];
    conductoresOrdenados : Conductor [];
    rutasLista : Ruta [];
    rutasListaDestino : Ruta [] = [];
    rutaListaOrigen : Ruta [] ;
    tipoVehiculoLista : TipoVehiculo [] = [];
    origen : any;
    destino : any;
    carroId : number  = 0;
    conductorId: number = 0;
    errorMessage: string = '';
    formSubmitted = false;
    searchIcon = faSearch;
    selectedConductor: any;
    selectedVehiculo :any;
    selectedRuta : any;
    modalModoSeleccionarConductor: boolean = true;
    nombreEmpresaServicio: string = '';

    //Variables de validaciones
    errorVali = false;
    conductorError = false;
    vehiculoError = false;
    origenSelected = false;
    rutaErrorOrigen = false;
    rutaErrorDestino= false;
    idModalBuscarRuta : string = '';

    //Constantes literales
    DESDE_LABEL = TITLES.FROM;
    HACIA_LABEL = TITLES.DESTINY;
    PLACEHOLDER_DISTANCE_KMS = TITLES.PLACEHOLDER_DISTANCE_KMS;
    DISTANCIA_KMS = TITLES.DISTANCE_KMS
    EMPRESA_NOMBRE_SERVICIO = TITLES.COMPANY_NAME
    COMPANY_NAME_PLACEHOLDER = TITLES.COMPANY_NAME_PLACEHOLDER;
    DURACION_VIAJE_LABEL = TITLES.ENDURANCE_TRAVEL_LABEL;
    DURACION_VIAJE_PLACEHOLDER = TITLES.ENDURANCE_TRAVEL_PLACEHOLDER;
    RUTA_TITLE = TITLES.ROUTE
    SELECCIONA_CONDUCTOR_LABEL = TITLES.SELECT_DRIVER;
    SELECCIONA_VEHICULO = TITLES.SELECT_CAR;
    GUARDAR = TITLES.SAVE;
    EDITAR = TITLES.EDIT
    NUEVA_RUTA = TITLES.NEW_ROUTE;
    MENSAJE_DATA_FOUND = TITLES.DATA_FOUND;
    MENSAJE_NO_DATA_FOUND = TITLES.DATA_NO_FOUND;

    constructor(
      private modalService: NgbModal,
      private viajeServicio:ViajeServicioService,
      private router:Router, private carroServicio:CarroService,
      private _snackBar: MatSnackBar,public dialog: MatDialog,
      private conductorService:ConductorService,
      private ngZone: NgZone,
      private readonly route: ActivatedRoute,
      private globalUtilsService : GlobalUtilsService){}


    ngOnInit(): void {

      this.obtenerListaCarro();
      this.obtenerListaConductores();
      
      // Obtener el parámetro 'id' de la URL de haber uno
      const id = +this.route.snapshot.paramMap.get('id')!;
      if(id) {
        this.loading = true;
        this.obtenerViajePorId(id);
      }
  }

  obtenerViajePorId(id: number) {
    this.viajeServicio.obtenerViajeById(id).subscribe({
      next: (v) => {
        this.viaje = v;
        this.poblarFormularioEdicionViaje(this.viaje);
      },
      error: (error) => console.log(error),
      complete: () => console.log('Viaje cargado')
    }).add(() => this.loading = false);
  }

  poblarFormularioEdicionViaje(viaje:Viaje) {

    this.selectedConductor = viaje.conductor;
    this.selectedVehiculo = viaje.carro;
    this.direccionSalida = viaje.ruta.origen;
    this.direccionDestino = viaje.ruta.destino;
    this.distancia = viaje.ruta.distanciaKm;
    this.duracion = viaje.ruta.tiempoEstimado;
    this.ciudadOrigen = viaje.ruta.ciudadOrigen;
    this.ciudadDestino = viaje.ruta.ciudadDestino;
    this.estadoOrigen = viaje.ruta.estadoOrigen;
    this.estadoDestino = viaje.ruta.estadoDestino;
    this.nombreEmpresaServicio = viaje.empresaServicioNombre;

  }

  poblarFormularioCrearViaje() {
    this.viaje.conductor = this.selectedConductor;
    this.viaje.fecha = new Date();
    this.viaje.carro = this.selectedVehiculo;

    // Valores de la ruta
    this.viaje.ruta.origen = this.direccionSalida;
    this.viaje.ruta.destino = this.direccionDestino;
    this.viaje.ruta.distanciaKm = this.distancia;
    this.viaje.ruta.tiempoEstimado = this.duracion;
    this.viaje.ruta.ciudadOrigen = this.ciudadOrigen;
    this.viaje.ruta.ciudadDestino = this.ciudadDestino;
    this.viaje.ruta.estadoOrigen = this.estadoOrigen;
    this.viaje.ruta.estadoDestino = this.estadoDestino;
    this.viaje.ruta.tiempoEstimado = this.duracion;

    this.viaje.conductor = this.selectedConductor;
    this.viaje.empresaServicioNombre = this.nombreEmpresaServicio;
  }

    ngAfterViewInit() {
      this.initAutocomplete('direccion-desde', (direccion: string) => {
        this.direccionSalida = direccion;
      });

      this.initAutocomplete('direccion-destino', (direccion: string) => {
        this.direccionDestino = direccion;
      });
    }

    // Función reutilizable para inicializar el autocompletado
    initAutocomplete(elementId: string, callback: (direccion: string) => void): void {
      const input = document.getElementById(elementId) as HTMLInputElement;

      // Configuración del autocompletado con restricciones de país
      const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'VE' }, // Restricción para Venezuela
        fields: ['geometry', 'formatted_address','address_components'], // Campos necesarios
      });

      // Listener para manejar el evento cuando se selecciona un lugar
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const direccion = place.formatted_address || '';
            this.ngZone.run(() => {
              if (elementId === 'direccion-desde') {
                this.direccionSalida = direccion;
              } else if (elementId === 'direccion-destino') {
                this.direccionDestino = direccion;
              }
              if (this.direccionSalida && this.direccionDestino) {
                  this.calculaDistancia();
                  this.proposalPlaceSelectedEvent = true;
              }
              // Obtener ciudad y estado
              let ciudad = '';
              let estado = '';

              place.address_components?.forEach((component) => {
                if (component.types.includes('locality')) {
                  ciudad = component.long_name; // Asignar la ciudad
                }
                if (component.types.includes('administrative_area_level_1')) {
                  estado = component.long_name; // Asignar el estado
                }
                if(this.direccionSalida !== '' && this.direccionDestino === '') {
                  this.ciudadOrigen = ciudad;
                  this.estadoOrigen = estado;
                }
                if(this.direccionDestino !== '') {
                  this.ciudadDestino = ciudad;
                  this.estadoDestino = estado;
                }
              });
          callback(direccion);
        }); // Llamamos al callback con la dirección seleccionada
        } else {
          console.warn('No se seleccionó un lugar válido.');
        }
      });
    }

    getBorderStyles(): string {
      if(this.datosNoEncontrados && this.proposalPlaceSelectedEvent){
          return 'border-warning';
      }else if(!this.datosNoEncontrados && this.proposalPlaceSelectedEvent){
          return 'border-success';
      }
      return '';
    }

    private obtenerCarroPorId(id: number): void {
      this.carroServicio.obtenerCarroPorId(id).subscribe(carro => {
        if (carro) {
          this.selectedVehiculo = carro;
        } else {
          console.error("No se encontró el carro con el ID:", id);
        }
      });
    }

    private obtenerListaConductores () {
      this.conductorService.obtenerListaConductores().subscribe(dato => {
        this.conductoresOrdenados = [...dato].sort((a, b) => {
          if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
            return -1;
          }
          if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        this.conductores = this.conductoresOrdenados;
        this.conductoresAutoCompleteFilters = this.conductoresOrdenados;
      });
    }

    resetearEstilosAlseleccionar(idElemento:string) {
      let element = document.getElementById(idElemento);
        if (element != null) {
          element.classList.remove('errorValInput');
        }
    }

    displayConductor = (conductor: any): string => {
      this.resetearEstilosAlseleccionar('autoCompleteConductor');
      return conductor ? `${conductor.nombre} ${conductor.apellido}` : '';
    };

    displayVehiculo = (carro: any): string => {
      this.resetearEstilosAlseleccionar('autoCompleteCarro');
      return carro ? ` ${this.getNumeroUnidadFormateado(carro.numeroUnidad)}  -  ${carro.marca} ${carro.modelo} - ${carro.anyo}` : '';
    };

    getNumeroUnidadFormateado(numeroUnidad:number) : string {
      return this.globalUtilsService.getNumeroUnidadFormateado(numeroUnidad);
    }

    private isConductor(object: any): boolean {
      return object && typeof object === 'object' &&
        'nombre' in object && typeof object.nombre === 'string' &&
        'apellido' in object && typeof object.apellido === 'string' &&
        'id' in object && typeof object.id === 'number';
    }

    private isVehiculo(object: any): boolean {
      return object && typeof object === 'object' &&
        'id' in object && typeof object.id === 'number' &&
        'modelo' in object && typeof object.modelo === 'string' &&
        'anyo' in object && typeof object.anyo === 'number' &&
        'consumo' in object && typeof object.consumo === 'number' &&
        'numeroUnidad' in object && typeof object.numeroUnidad === 'number' &&
        'marca' in object && typeof object.marca === 'string' &&
        'modelo' in object && typeof object.modelo === 'string';
    }

    async validarDatos(): Promise<boolean> {

      this.formSubmitted = true;
      this.errorVali = false;

      // Validar conductor
      if (!this.isConductor(this.selectedConductor) || this.selectedConductor === '') {
        this.selectedConductor = '';
        this.conductorError = true;
        this.errorVali = true;
        const autoCompleteConductor = document.getElementById('autoCompleteConductor');
        if (autoCompleteConductor) {
          autoCompleteConductor.classList.remove('errorValInput');
          setTimeout(() => {
            autoCompleteConductor.classList.add('errorValInput');
          });
        }
      }

      // Validar vehículo
      if (!this.isVehiculo(this.selectedVehiculo) || this.selectedVehiculo === '') {
        this.selectedVehiculo = '';
        this.vehiculoError = true;
        this.errorVali = true;
        const autoCompleteCarro = document.getElementById('autoCompleteCarro');
        if (autoCompleteCarro) {
          autoCompleteCarro.classList.remove('errorValInput');
          setTimeout(() => {
            autoCompleteCarro.classList.add('errorValInput');
          });
        }
      }

      // Validar dirección de salida
      if (this.direccionSalida === '') {
        const elemento = document.getElementById('direccion-desde');
        if (elemento) {
          elemento.classList.add('input-error-blink');
        }
      }

      // Validar dirección de destino
      if (this.direccionDestino === '') {
        const elemento = document.getElementById('direccion-destino');
        if (elemento) {
          elemento.classList.add('input-error-blink');
        }
      }

      // Validar nombre de la empresa
      if (this.nombreEmpresaServicio === '') {
        const elemento = document.getElementById('nombre-empresa-servicio');
        if (elemento) {
          elemento.classList.add('input-error-blink');
        }
      }

      // Validar duración
      if (!this.errorVali && (!this.duracion || !this.distancia)) {

          let title = !this.duracion ? 'Duración aproximada' : 'Distancia aproximada';
          let inputDisDur = !this.duracion ? 'Duración aproximada' : 'Distancia aproximada';

          if(!this.duracion && !this.distancia) {
              title = 'Duración y distancia aproximada'
              inputDisDur = 'duración y distancia aproximada'
          }
          
          const text = `No es obligatorio completar la ${inputDisDur}, pero es muy recomendable.`
          const result = await Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Atras',
            confirmButtonText: 'Continuar',
            reverseButtons: true,
          });

          if (!result.isConfirmed) {
            return false; // Detenemos el flujo
          }
      }

      if (this.errorVali) {
        return false;
      } else {
        return true;
      }
    }

    formatearHorasEspera(){
      const horas = this.viaje.ruta.tiempoEstimado;
      const horasFormateadas = ('0' + horas).slice(-2); // Asegura dos dígitos para las horas
      const minutosFormateados = '00';
      const segundosFormateados = '00';
      return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
    }


    async validar() {

      //Reiniciamos estilos a todos los componentes de haber habido errores
      this.quitarErrorEstilos('');
      const esValido = await this.validarDatos();

      if(esValido){
        
          //Carga datos nuevo viaje
          this.poblarFormularioCrearViaje();

          // Abre el modal creando una instancia nueva
          const modalRef = this.modalService.open(PopupMensajeConfirmarViajeComponent);
          modalRef.componentInstance.isModalProgramatico = true;
          modalRef.componentInstance.viaje = this.viaje;

          if(this.viaje.id) {
            modalRef.componentInstance.isEdicionModeEnabled = true;
          }

          // Aquí te suscribes al evento 'confirmar' del componente hijo (PopupMensajeConfirmarViajeComponent)
          modalRef.componentInstance.confirmarAccion.subscribe((confirmado: boolean) => {
            this.manejarConfirmacion(confirmado); // Manejas el evento en el componente padre
          });
      }else if(this.errorVali) {
              this._snackBar.open('Por favor, rellene los campos requeridos marcados en rojo, son requeridos.', 'Cerrar', {
              duration: 3000, // Duración del Snackbar en milisegundos
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'end', // Options: 'start', 'center', 'end'
              verticalPosition: 'top', // Options: 'top', 'bottom'
          });
      }
    }

    // Método para manejar la confirmación del usuario
    manejarConfirmacion(confirmado: boolean) {
      this.guardarViaje();
    }

    guardarViaje(){
      
      if(!this.viaje.id) {
        this.viajeServicio.registrarViaje(this.viaje).subscribe(
            dato => {
                  this._snackBar.open('Viaje Registrado con éxito.', '', {
                    duration: 2000,
                    panelClass: ['success-snackbar'],
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                })
                  this.irListaViaje();
            },
            error => {
              // Si ocurre un error
              console.log(error);
              this._snackBar.open(TITLES.ERROR_SERVIDOR_BACK, '', {
                duration: 5000,
                panelClass: ['error-snackbar'],
                horizontalPosition: 'end',
                verticalPosition: 'top',
              });
            }
        );}else{
        this.viajeServicio.actualizarViaje(this.viaje).subscribe(
          dato => {
                this._snackBar.open('Viaje Registrado con éxito.', '', {
                  duration: 2000,
                  panelClass: ['success-snackbar'],
                  horizontalPosition: 'end',
                  verticalPosition: 'top',
              })
                this.irListaViaje();
          },error => {
            // Si ocurre un error
            console.log(error);
            this._snackBar.open(TITLES.ERROR_SERVIDOR_BACK, '', {
              duration: 5000,
              panelClass: ['error-snackbar'],
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          }
        );
      }
    }
    private cargarListasFiltrosCarro() {
        if(this.selectedVehiculo == undefined || this.selectedVehiculo === '') {
          this.vehiculosAutoCompleteFilters = this.carros;
          }
    }

    private obtenerListaCarro () {
      this.carroServicio.obtenerListaCarro().subscribe(dato =>  {
      this.carros = dato;
      this.cargarListasFiltrosCarro();
      });
    }

    irListaViaje() {
      this.router.navigate(['/lista-viajes']);
    }

    mostrarCarroSelect(carro:Carro)  {
    return  carro.numeroUnidad === 0 ?  carro.modelo :  carro.numeroUnidad + ' - ' + carro.modelo;
    }

    mostrarConductorSelect(conductor:Conductor){
      return conductor.id === 0 ? conductor.nombre : conductor.nombre + ' ' + conductor.apellido;
    }
    seleccionarCarro(carroSeleccionado:Carro) {
      this.selectedVehiculo = carroSeleccionado;
    }

    seleccionarConductor(conductorSeleccionado:Conductor) {
      if(conductorSeleccionado && conductorSeleccionado.nombre) {
        conductorSeleccionado.nombre = conductorSeleccionado.nombre.toLocaleUpperCase();
          if(conductorSeleccionado.apellido) {
            conductorSeleccionado.apellido = conductorSeleccionado.apellido.toLocaleUpperCase();
          }
      }
      this.selectedConductor = conductorSeleccionado;
    }

  filtrarAutocompletarConductor(conductor:Conductor) {
    if( this.selectedConductor === undefined
      || this.selectedConductor === null
      || this.selectedConductor === '') {
        this.conductoresAutoCompleteFilters = this.conductoresOrdenados;
      }else {
        const filtro = this.selectedConductor.toLowerCase();
        this.conductoresAutoCompleteFilters = this.conductoresOrdenados.filter(conductor => {
        const nombreCompleto = (conductor.nombre + ' ' + conductor.apellido).toLowerCase();
        return nombreCompleto.includes(filtro);
      });
    }
  }

  filtrarAutocompletarCarro(carro:Carro) {
    if(  this.selectedVehiculo === undefined
      || this.selectedVehiculo === null
      || this.selectedVehiculo === '') {
          this.vehiculosAutoCompleteFilters = this.carros;
      } else {
      const filtro = this.selectedVehiculo.toLowerCase();
      this.vehiculosAutoCompleteFilters = this.carros.filter(c => {
      const modelo_completo = (c.marca + ' ' + c.modelo).toLowerCase();
      return modelo_completo.includes(filtro);
    });
    }
  }

  quitarErrorEstilos(idElemento:string) {
    if(idElemento === '') {
    // Método para activar el parpadeo de los campos faltantes
    const elementos = document.querySelectorAll('.input-error-blink');
    elementos.forEach((elemento) => {
      elemento.classList.remove('input-error-blink');
    });
    }else {
      const elemento = document.getElementById(idElemento);
      if(elemento) {
        elemento.classList.remove('input-error-blink');
      }
    }
  }

  onInputBlur() {
    if(!this.isConductor(this.selectedConductor))
        this.selectedConductor = '';
    else
      return;
  }

  onFocusEventConductor() {
    this.conductorError = false;
  }

  onFocusEventVehiculo() {
    this.vehiculoError = false;
  }


  onOptionSelectedConductor(event: MatAutocompleteSelectedEvent) {
    let element = document.getElementById('autoCompleteConductor');
    if (element != null) {
      element.classList.remove('errorValInput');
    }
  }

  onOptionSelectedVehiculo(event: MatAutocompleteSelectedEvent) {
  this.viaje.carro = this.selectedVehiculo;
  this.vehiculoError = false;
  }

  calculaDistancia() {
    if(this.direccionSalida && this.direccionSalida) {
      this.loading = true;
      this.calculateDistance(this.direccionSalida, this.direccionDestino);
    }
  }

  calculateDistance(startAddress: string, endAddress: string): void {
    const directionsService = new google.maps.DirectionsService();
    const request = {
      origin: startAddress,
      destination: endAddress,
      travelMode: google.maps.TravelMode.DRIVING,
      transitOptions: {
        modes: [google.maps.TransitMode.BUS], // Solo considerar transporte en autobús
      },
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // Usamos encadenamiento opcional para evitar el error de 'undefined'
        const distance = result?.routes?.[0]?.legs?.[0]?.distance?.text;
        const duration = result?.routes?.[0]?.legs?.[0]?.duration?.text; // Duración estimada

        if (distance && duration) {
          this.datosNoEncontrados = false;
          this.distancia = distance; // Asignamos la distancia al modelo
          this.duracion = this.formatearDuracion(duration);
          this.loading = false;
        } else {
          this.loading = false;
          this.datosNoEncontrados = true;
          this.resetInputFields();
          console.error('No se pudieron obtener la distancia o la duración');
        }
      } else {
          this.loading = false;
          this.datosNoEncontrados = true;
          this.resetInputFields();
          console.error('Error al obtener la información: ', status);
    }});
  }

  private resetInputFields() {
    this.distancia = '';
    this.duracion = '';
  }

  formatearDuracion(duracionString: string): string {
    // Dividir el string por espacios para extraer las partes
    const timeParts = duracionString.split(' ');

    // Variables para almacenar horas y minutos
    let hours = 0;
    let minutes = 0;
    // Iterar por las partes para identificar horas y minutos
    for (let i = 0; i < timeParts.length; i++) {
      if (timeParts[i].endsWith('h')) { // Detectar horas con 'h'
        hours = parseInt(timeParts[i].replace('h', ''), 10);
      }
      if (timeParts[i] === 'min' && i > 0) { // Detectar minutos con 'min'
        minutes = parseInt(timeParts[i - 1], 10); // Tomar el número anterior
      }
    }
    // Asegurar que las horas y minutos tengan dos dígitos
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    // Retornar en formato HH:MM
    return `${formattedHours}:${formattedMinutes}`;
  }


  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Esto previene el comportamiento de enviar el formulario con "Enter"
    }
  }

  intercambiarDirecciones(){
    if(this.direccionSalida && this.direccionDestino) {
      const temp = this.direccionSalida;
      this.direccionSalida = this.direccionDestino;
      this.direccionDestino = temp;
    }
  }

  onTypeDown() {
    this.proposalPlaceSelectedEvent = false;
    this.duracion = '';
    this.distancia = '';
  }


  distanciaInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    // Eliminar cualquier carácter que no sea un número
    let valor = inputElement.value.replace(/\D/g, '');

    // Actualizar el valor del modelo (ngModel) solo con números
    this.distancia = valor;
  }

  agregarKm(): void {
    // Verificar si el valor es un número y no está vacío
    if (!isNaN(Number(this.distancia)) && this.distancia.trim() !== '') {
      this.distancia = `${this.distancia} km`;
    } else {
      this.distancia = '0 Km';
    }
  }

  // Método que se ejecuta cuando el usuario escribe en el campo
  onInput(event: any) {
    let value = event.target.value;

    // Eliminar cualquier carácter que no sea un número o el separador ":"
    value = value.replace(/[^0-9:]/g, '');

    // Si ya hay un ":" en el valor y el largo es mayor a 5, cortar a 5 caracteres
    if (value.indexOf(':') !== -1 && value.length > 5) {
        value = value.slice(0, 5);
    }

    // Verificar si el valor contiene exactamente dos dígitos antes del ":"
    if (value.length === 3 && value.indexOf(':') === -1) {
        // Si tiene 2 números sin ":" agregar el ":"
        value = value.slice(0, 2) + ':' + value.slice(2);
    }

    // Asegurarse de que haya exactamente 2 dígitos después de ":"
    if (value.indexOf(':') !== -1) {
        let [hours, minutes] = value.split(':');

      // Limitar los minutos a 2 dígitos
        if (minutes && minutes.length > 2) {
            // Limitar los minutos a 2 dígitos
            value = `${hours}:${minutes.slice(0, 2)}`;
        }

      //Sustituimos los minutos por 59 si es mayor a 59
        if (minutes && minutes.length === 2) {
          if (parseInt(minutes) > 59) {
            minutes = '59';  // Ajustamos los minutos a 59
            value = `${hours}:${minutes}`;
        }
      }
    }
    // Actualizar la variable con el valor modificado
    this.duracion = value;

    // Establecer el valor en el campo de entrada
    event.target.value = this.duracion;
}




// onOptionSelectedDestino(event: MatAutocompleteSelectedEvent) {
//   let element = document.getElementById('autoCompleteRutaDestino');
//   if (element != null) {
//     element.classList.remove('errorValInput');
//   }
// }



// displayRutaDesde(rutaDesde: any): string {
//   return rutaDesde ? `${rutaDesde.origen}` : '';
// }

// displayRutaHasta(rutaDestino: any): string {
//   return rutaDestino ? `${rutaDestino.destino}` : '';
// }

// if(!this.isRuta(this.origen) || (this.origen === '')){
      //   this.origen = ''  ;
      //   this.destino = '';
      //   this.rutaErrorOrigen = true;
      //   this.errorVali = true;

      //   const autoCompleteRutaOrigen = document.getElementById('autoCompleteRutaOrigen');
      //   if(autoCompleteRutaOrigen) {
      //     autoCompleteRutaOrigen.classList.remove('errorValInput');
      //     setTimeout(() => {
      //       autoCompleteRutaOrigen.classList.add('errorValInput');
      //     });
      //   }
      // }

      // if(!this.isRuta(this.destino) || (this.destino === '')){
      //   this.origen = ''  ;
      //   this.destino = '';
      //   this.rutaErrorDestino = true;
      //   this.errorVali = true;
      //   const autoCompleteRutaDestino = document.getElementById('autoCompleteRutaDestino');
      //   if(autoCompleteRutaDestino) {
      //     autoCompleteRutaDestino.classList.remove('errorValInput');
      //     setTimeout(() => {
      //       autoCompleteRutaDestino.classList.add('errorValInput');
      //     });
      //   }
      // }

      // else if(!this.errorVali) {
      //   this.getRuta();
      //   return true;
      // }



  // onInputBlurOrigen() {
  //   if(!this.origenSelected)
  //     this.origen = '';
  // }

  // onFocusEventOrigen() {
  //   this.rutaErrorOrigen = false;
  // }

  // onFocusEventODestino() {
  //   this.rutaErrorDestino = false;
  // }

  // getDestinosSegunOrigen(): Ruta[]{
  //   return this.rutasLista.filter(ruta => ruta.origen?.toLowerCase() ===  this.origen.origen?.toLowerCase());
  // }


  // onOptionSelectedOrigen(event: MatAutocompleteSelectedEvent) {
  //   this.destino = '';
  //   this.origenSelected = true;
  //   this.rutasListaDestino = this.getDestinosSegunOrigen();

  // }

  // seleccionarRuta(ruta:Ruta) {
  //   this.rutaErrorDestino = false;
  //   this.rutaErrorOrigen = false
  //   this.ruta = ruta;
  //   this.destino = ruta;
  //   this.origen = ruta;
  // }

    // filtrarAutocompletarRutaOrigen() {
  //   this.origenSelected = false;
  //   this.destino = '';
  //   let  rutasOrigenNoRepetidas =  this.eliminarOrigenesRepetidos(this.rutasLista);
  //       if(  this.origen === undefined
  //         || this.origen === null
  //         || this.origen === '') {
  //             this.rutaListaOrigen = rutasOrigenNoRepetidas;
  //         } else {
  //           const filtro = this.origen.toLowerCase();
  //           this.rutaListaOrigen = rutasOrigenNoRepetidas.filter(ruta => {
  //           const origen_ruta = ruta.origen.toLowerCase();
  //           return origen_ruta.includes(filtro);
  //       });
  //     }
  //   }

  // obtenerListaRutas() {
  //   this.rutaServicio.obtenerListaRutas().subscribe(dato =>  {
  //   this.rutasLista = dato;
  //   // Filtrar y eliminar rutas con origen repetido
  //   this.rutaListaOrigen = this.eliminarOrigenesRepetidos(this.rutasLista);
  //   });
  // }

  // eliminarOrigenesRepetidos(rutas: Ruta[]): Ruta[] {
  //   // Crear un mapa para almacenar el primer origen encontrado de cada ruta
  //   const mapaOrigenes = new Map<string, Ruta>();

  //   // Filtrar y guardar las rutas únicas por origen en el mapa
  //   rutas.forEach(ruta => {
  //     if (!mapaOrigenes.has(ruta.origen)) {
  //       mapaOrigenes.set(ruta.origen, ruta);
  //     }
  //   });

  //   // Convertir el mapa de nuevo en un array de rutas
  //   const rutasUnicas = Array.from(mapaOrigenes.values());
  //   return rutasUnicas;
  // }

//   getRuta() {
//     const foundRuta = this.rutasLista.find(ruta => {
//     const origenComparator = this.origen.origen.toLowerCase();
//     const destinoComparator = this.destino.destino.toLowerCase();
//     const origen = ruta.origen.toLowerCase();
//     const destino = ruta.destino.toLowerCase();
//     return origen === origenComparator && destino === destinoComparator;
// });

// if (foundRuta) {
//     this.ruta = foundRuta;
//     this.viaje.ruta = this.ruta;
// } else {
//     // Handle the case where the route is not found, for example:
//     console.error('Route not found.'); // Display an error message
//     // You might also set this.ruta to null or perform other actions.
// }
// }

// private isRuta(object: any): boolean {
//   return object && typeof object === 'object' &&
//     'id' in object && typeof object.id === 'number' &&
//     'origen' in object && typeof object.origen === 'string' &&
//     'destino' in object && typeof object.destino === 'string' &&
//     'distancia' in object && typeof object.distancia === 'string';
// }
}
