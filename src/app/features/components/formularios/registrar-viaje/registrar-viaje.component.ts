import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
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
import { RutasService } from '../../../../core/services/rutas.service';
import { ViajeServicioService } from '../../../../core/services/viaje-servicio.service';
import { TITLES } from '../../../../constant/titles.constants';




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

    address: string = '';
    autocomplete: any;
    direccionSalida: string = '';
    direccionDestino: string = '';
    distancia: string = ''; // Distancia entre los puntos
    duracion: any = ''; // Duración estimada del viaje


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

    //Variables de validaciones
    errorVali = false;
    conductorError = false;
    vehiculoError = false;
    origenSelected = false;
    rutaErrorOrigen = false;
    rutaErrorDestino= false;
    idModalBuscarRuta : string = '';

    //Constantes Vistas
    DESDE_LABEL = TITLES.FROM;
    HACIA_LABEL = TITLES.DESTINY;
    PLACEHOLDER_DISTANCE_KMS = TITLES.PLACEHOLDER_DISTANCE_KMS;
    DISTANCIA_KMS = TITLES.DISTANCE_KMS
    DURACION_VIAJE_LABEL = TITLES.ENDURANCE_TRAVEL_LABEL;
    DURACION_VIAJE_PLACEHOLDER = TITLES.ENDURANCE_TRAVEL_PLACEHOLDER;
    RUTA_TITLE = TITLES.ROUTE
    SELECCIONA_CONDUCTOR_LABEL = TITLES.SELECT_DRIVER;
    SELECCIONA_VEHICULO = TITLES.SELECT_CAR;
    GUARDAR = TITLES.SAVE;
    NUEVA_RUTA = TITLES.NEW_ROUTE;

    constructor(
      private viajeServicio:ViajeServicioService,private router:Router, private carroServicio:CarroService,
      private _snackBar: MatSnackBar,public dialog: MatDialog, private conductorService:ConductorService,
      private rutaServicio:RutasService, private cdr: ChangeDetectorRef,
      private readonly route: ActivatedRoute){}


    ngOnInit(): void {
    this.obtenerListaCarro();
    this.obtenerListaConductores();
    this.obtenerListaRutas();
    // Obtener el parámetro 'id' de la URL de haber uno
    const id = +this.route.snapshot.paramMap.get('id')!;
    console.log("ID recibido en registrarViaje:", id);
    if(id) {
      this.selectedVehiculo = this.obtenerCarroPorId(id);
      console.log("Carro seleccionado:", this.selectedVehiculo);
    }
  }

    ngAfterViewInit() {
      this.initAutocomplete('direccion-desde', (direccion: string) => {
        this.direccionSalida = direccion;
      });

      this.initAutocomplete('direccion-destino', (direccion: string) => {
        this.direccionDestino = direccion;
      });
    }
    
    onSubmit(){
      this.guardarViaje();
    }

    private obtenerCarroPorId(id: number): void {
      this.carroServicio.obtenerCarroPorId(id).subscribe(carro => {
        if (carro) {
          this.selectedVehiculo = carro;
          console.log("Carro seleccionado dentro del subscribe:", this.selectedVehiculo);
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

    obtenerListaRutas() {
      this.rutaServicio.obtenerListaRutas().subscribe(dato =>  {
      this.rutasLista = dato;
      // Filtrar y eliminar rutas con origen repetido
      this.rutaListaOrigen = this.eliminarOrigenesRepetidos(this.rutasLista);
      });
    }


    displayConductor(conductor: any): string {
      return conductor ? `${conductor.nombre} ${conductor.apellido}` : '';
    }

    displayVehiculo(carro: any): string {
      return carro? `${carro.marca} ${carro.modelo} - Unidad: ${carro.numeroUnidad}`: '';
    }

    displayRutaDesde(rutaDesde: any): string {
      return rutaDesde ? `${rutaDesde.origen}` : '';
    }

    displayRutaHasta(rutaDestino: any): string {
      return rutaDestino ? `${rutaDestino.destino}` : '';
    }


    eliminarOrigenesRepetidos(rutas: Ruta[]): Ruta[] {
      // Crear un mapa para almacenar el primer origen encontrado de cada ruta
      const mapaOrigenes = new Map<string, Ruta>();

      // Filtrar y guardar las rutas únicas por origen en el mapa
      rutas.forEach(ruta => {
        if (!mapaOrigenes.has(ruta.origen)) {
          mapaOrigenes.set(ruta.origen, ruta);
        }
      });

      // Convertir el mapa de nuevo en un array de rutas
      const rutasUnicas = Array.from(mapaOrigenes.values());
      return rutasUnicas;
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

    private isRuta(object: any): boolean {
      return object && typeof object === 'object' &&
        'id' in object && typeof object.id === 'number' &&
        'origen' in object && typeof object.origen === 'string' &&
        'destino' in object && typeof object.destino === 'string' &&
        'distancia' in object && typeof object.distancia === 'string';
    }


  validandoDatos() {
    this.formSubmitted = true;
    this.errorVali = false;

    if(!this.isConductor(this.selectedConductor) || this.selectedConductor === ''){
          this.selectedConductor = ''
          this.conductorError = true;
          this.errorVali = true
          const autoCompleteConductor = document.getElementById('autoCompleteConductor');
          if(autoCompleteConductor) {
            autoCompleteConductor.classList.remove('errorValInput');
            setTimeout(() => {
              autoCompleteConductor.classList.add('errorValInput');
            });
          }
      }
    if(!this.isVehiculo(this.selectedVehiculo) || this.selectedVehiculo === ''){
      this.selectedVehiculo = ''
      this.vehiculoError = true;
      this.errorVali = true;
      const autoCompleteCarro = document.getElementById('autoCompleteCarro');
      if(autoCompleteCarro) {
        autoCompleteCarro.classList.remove('errorValInput');
        setTimeout(() => {
            autoCompleteCarro.classList.add('errorValInput');
        });
      }
    }

    if(this.direccionSalida === '') {
      // Método para activar el parpadeo de los campos faltantes
      const elemento = document.getElementById('direccion-desde');
      if (elemento) {
        elemento.classList.add('input-error-blink');
      }
    }

    if(this.direccionDestino === '') {
      // Método para activar el parpadeo de los campos faltantes
    const elemento = document.getElementById('direccion-destino');
    if (elemento) {
      elemento.classList.add('input-error-blink');
      }
    }

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

      if(this.viaje.horasEspera) {
      }

      if(this.errorVali)
        return false;

      else
        return true;
    }


    formatearHorasEspera(){
      const horas = this.viaje.horasEspera;
      const horasFormateadas = ('0' + horas).slice(-2); // Asegura dos dígitos para las horas
      const minutosFormateados = '00';
      const segundosFormateados = '00';
      return `${horasFormateadas}:${minutosFormateados}:${segundosFormateados}`;
    }

    getRuta() {
          const foundRuta = this.rutasLista.find(ruta => {
          const origenComparator = this.origen.origen.toLowerCase();
          const destinoComparator = this.destino.destino.toLowerCase();
          const origen = ruta.origen.toLowerCase();
          const destino = ruta.destino.toLowerCase();
          return origen === origenComparator && destino === destinoComparator;
      });

      if (foundRuta) {
          this.ruta = foundRuta;
          this.viaje.ruta = this.ruta;
      } else {
          // Handle the case where the route is not found, for example:
          console.error('Route not found.'); // Display an error message
          // You might also set this.ruta to null or perform other actions.
      }
    }


    guardarViaje(){

        // this.viaje.carroId = this.selectedConductor.carroId;
        // this.viaje.conductor = this.selectedConductor;
        // this.viaje.fecha = new Date();
        // this.viaje.carro = this.selectedVehiculo;
        // this.viaje.origen = this.direccionSalida;
        // this.viaje.destino = this.direccionDestino;
        // this.viaje.conductor = this.selectedConductor;


        // let texto = '';
        // if(this.distancia && this.distancia != 'Sin datos') {
        //   texto = this.distancia;
        // }
        // const numero = parseInt(texto, 10); // El segundo argumento es la base (10 para decimal)
        // this.viaje.kilometraje = numero;
        // console.log(this.viaje);


      //Validamos datos antes de hacer el guardado
      if (this.validandoDatos()) {
        this.viaje.carroId = this.selectedConductor.carroId;
        this.viaje.conductor = this.selectedConductor;
        this.viaje.fecha = new Date();
        this.viaje.carro = this.selectedVehiculo;
        this.viaje.origen = this.direccionSalida;
        this.viaje.destino = this.direccionDestino;
        this.viaje.conductor = this.selectedConductor;
        this.viajeServicio.registrarViaje(this.viaje).subscribe(
            dato => {
                  this._snackBar.open('Viaje Registrado con éxito.', '', {
                    duration: 2000,
                    panelClass: ['success-snackbar'],
                    horizontalPosition: 'end',
                    verticalPosition: 'top',
                })
                  this.irListaViaje(); // Redireccionar después de que se cierre el snackbar
            },
            error => console.log(error)
        );
    }else {
        this._snackBar.open('Por favor, rellene los campos requeridos marcados en rojo, son requeridos.', 'Cerrar', {
              duration: 3000, // Duración del Snackbar en milisegundos
              panelClass: ['custom-snackbar'],
              horizontalPosition: 'end', // Options: 'start', 'center', 'end'
              verticalPosition: 'top', // Options: 'top', 'bottom'
          });
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


  filtrarAutocompletarRutaOrigen() {
    this.origenSelected = false;
    this.destino = '';
    let  rutasOrigenNoRepetidas =  this.eliminarOrigenesRepetidos(this.rutasLista);
        if(  this.origen === undefined
          || this.origen === null
          || this.origen === '') {
              this.rutaListaOrigen = rutasOrigenNoRepetidas;
          } else {
            const filtro = this.origen.toLowerCase();
            this.rutaListaOrigen = rutasOrigenNoRepetidas.filter(ruta => {
            const origen_ruta = ruta.origen.toLowerCase();
            return origen_ruta.includes(filtro);
        });
      }
    }

  
  quitarErrorEstilos(idElemento:string) {
    // Método para activar el parpadeo de los campos faltantes
    if(idElemento === 'no-input') {
        const elemento = document.getElementById('direccion-desde');
        const elemento2 = document.getElementById('direccion-destino');
        if (elemento && elemento2) {
              elemento.classList.remove('input-error-blink');
              elemento2.classList.remove('input-error-blink');
        }
    }else {
      const elemento = document.getElementById(idElemento);
      if (elemento) {
            elemento.classList.remove('input-error-blink');
      }
    }
  } 

  filtrarAutocompletarRutaDestino() {
  }

  onInputBlur() {
    if(!this.isConductor(this.selectedConductor))
        this.selectedConductor = '';
    else
      return;
  }

  onInputBlurOrigen() {

    if(!this.origenSelected)
      this.origen = '';
  }

  onFocusEventOrigen() {
    this.rutaErrorOrigen = false;
  }

  onFocusEventODestino() {
    this.rutaErrorDestino = false;
  }

  onFocusEventConductor() {
    this.conductorError = false;
  }

  onFocusEventVehiculo() {
    this.vehiculoError = false;
  }


  onOptionSelectedOrigen(event: MatAutocompleteSelectedEvent) {
    this.destino = '';
    this.origenSelected = true;
    this.rutasListaDestino = this.getDestinosSegunOrigen();

  }

  onOptionSelectedDestino(event: MatAutocompleteSelectedEvent) {
    let element = document.getElementById('autoCompleteRutaDestino');
    if (element != null) {
      element.classList.remove('errorValInput');
    }
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


  getDestinosSegunOrigen(): Ruta[]{
    return this.rutasLista.filter(ruta => ruta.origen?.toLowerCase() ===  this.origen.origen?.toLowerCase());
  }

  seleccionarRuta(ruta:Ruta) {
    this.rutaErrorDestino = false;
    this.rutaErrorOrigen = false
    this.ruta = ruta;
    this.destino = ruta;
    this.origen = ruta;
  }

  calculaDistancia() {
    console.log(this.direccionSalida, this.direccionDestino);
    if(this.direccionSalida && this.direccionSalida) {
      this.calculateDistance(this.direccionSalida, this.direccionDestino);
    }
  }


   // Función reutilizable para inicializar el autocompletado
initAutocomplete(elementId: string, callback: (direccion: string) => void): void {
  const input = document.getElementById(elementId) as HTMLInputElement;

  // Configuración del autocompletado con restricciones de país
  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'VE' }, // Restricción para Venezuela
    fields: ['geometry', 'formatted_address'], // Campos necesarios
  });

  // Listener para manejar el evento cuando se selecciona un lugar
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const direccion = place.formatted_address || '';
      callback(direccion); // Llamamos al callback con la dirección seleccionada
      console.log('Dirección seleccionada: ', direccion);
    } else {
      console.log('No se seleccionó un lugar válido.');
    }
  });
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
        this.distancia = distance; // Asignamos la distancia al modelo
        this.duracion = this.formatearDuracion(duration);
        // this.duracion = duration; // Guardar duración en el modelo
        console.log(`Distancia: ${distance}, Duración (en autobús): ${duration}`);
        console.log("Duracion formateada:", this.duracion);
      } else {
        this.distancia = 'Sin datos';
        this.duracion = 'Sin datos';
        console.error('No se pudieron obtener la distancia o la duración');
      }
    } else {
      this.distancia = 'Sin datos';
      this.duracion = 'Sin datos';
      console.error('Error al obtener la información: ', status);
    }});
  }

  formatearDuracion(duracionString: string): string {
    // Dividir el string por espacios para extraer las partes
    const timeParts = duracionString.split(' ');

    // Variables para almacenar horas y minutos
    let hours = 0;
    let minutes = 0;

    // Iterar por las partes para identificar horas y minutos
    for (let i = 0; i < timeParts.length; i++) {
      if (timeParts[i].includes('hour')) {
        hours = parseInt(timeParts[i - 1], 10); // Obtener el número antes de "hour"
      }
      if (timeParts[i].includes('min')) {
        minutes = parseInt(timeParts[i - 1], 10); // Obtener el número antes de "min"
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

}
