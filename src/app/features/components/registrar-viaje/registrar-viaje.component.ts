import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Viaje } from '../../../core/models/viaje';
import { ViajeServicioService } from '../../../core/services/viaje-servicio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarroService } from '../../../core/services/carro.service';
import { Carro } from '../../../core/models/carro';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ConductorServiceService } from '../../../core/services/conductor-service.service';
import { Conductor } from '../../../core/models/conductor';
import { Ruta } from '../../../core/models/ruta';
import { RutasService } from '../../../core/services/rutas.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PopupSeleccionarRutaComponent } from '../popup-seleccionar-ruta/popup-seleccionar-ruta.component';
import { TipoVehiculo } from '../../../core/models/tipo-vehiculo';




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

  //Variables de validaciones
  errorVali = false;
  conductorError = false;
  vehiculoError = false;
  origenSelected = false;
  rutaErrorOrigen = false;
  rutaErrorDestino= false;

  idModalBuscarRuta : string = '';


  displayConductor(conductor: any): string {
    return conductor ? `${conductor.nombre} ${conductor.apellido}` : '';
  }

  displayVehiculo(carro: any): string {
    return carro ? `${carro.marca} ${carro.modelo}` : '';
  }

  displayRutaDesde(rutaDesde: any): string {
    return rutaDesde ? `${rutaDesde.origen}` : '';
  }

  displayRutaHasta(rutaDestino: any): string {
    return rutaDestino ? `${rutaDestino.destino}` : '';
  }



  constructor(
    private viajeServicio:ViajeServicioService,private router:Router, private carroServicio:CarroService,
    private _snackBar: MatSnackBar,public dialog: MatDialog, private conductorService:ConductorServiceService,
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

    if(!this.isRuta(this.origen) || (this.origen === '')){
      this.origen = ''  ;
      this.destino = '';
      this.rutaErrorOrigen = true;
      this.errorVali = true;

      const autoCompleteRutaOrigen = document.getElementById('autoCompleteRutaOrigen');
      if(autoCompleteRutaOrigen) {
        autoCompleteRutaOrigen.classList.remove('errorValInput');
        setTimeout(() => {
          autoCompleteRutaOrigen.classList.add('errorValInput');
        });
      }
    }

    if(!this.isRuta(this.destino) || (this.destino === '')){
      this.origen = ''  ;
      this.destino = '';
      this.rutaErrorDestino = true;
      this.errorVali = true;
      const autoCompleteRutaDestino = document.getElementById('autoCompleteRutaDestino');
      if(autoCompleteRutaDestino) {
        autoCompleteRutaDestino.classList.remove('errorValInput');
        setTimeout(() => {
          autoCompleteRutaDestino.classList.add('errorValInput');
        });
      }
    }

    else if(!this.errorVali) {
    this.getRuta();
    return true;
    }

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
    
    //Validamos datos antes de hacer el guardado
    if (this.validandoDatos()) {
      this.viaje.carroId = this.selectedConductor.carroId;
      this.viaje.conductor = this.selectedConductor;
      this.viaje.fecha = new Date();
      this.viaje.carro = this.selectedVehiculo;
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
  }

    else {
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
    this.router.navigate(['/viajes']);
    }

  onSubmit(){
    this.guardarViaje();
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

}


