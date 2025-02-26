import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { CarroService } from '../../../../core/services/carro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Historial } from '../../../../core/models/historial';
import { Carro } from '../../../../core/models/carro';
import { HistorialService } from '../../../../core/services/historial.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';
import { faComment, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registar-historial',
  templateUrl: './registar-historial.component.html',
  styleUrl: './registar-historial.component.css'
})
export class RegistarHistorialComponent {
  
  datos: { [key: string]: string } = {};
  claves: string[] = [];
  tipoHistorialList: string[] = [];
  selectedFiles: File[] = [];
  selectedTipo: string | null = null; // Variable para enlazar la opción seleccionada
  historial : Historial = new Historial;
  soloConsulta: boolean = true; // Define la propiedad para almacenar el valor del parámetro
  carroId:string;
  isMantenimiento:boolean;
  id:any;
  tipo:any;

  //Iconos
  repairIcon = faScrewdriverWrench;
  commentIcon = faComment;

  //validations array
  camposFaltantes: string[] = [];

  //new registered historial
  nuevoHistorial:Historial;


  @Input() verSoloRegistroMantenimiento : boolean;
  @Input() carroSeleccionadoDetalles: Carro = new Carro(); 
  @Output() onVolver = new EventEmitter<void>();
  @Output() historialGuardado = new EventEmitter<any>();

  constructor(
    private carroServicio:CarroService, 
    private historialServicio:HistorialService,  
    private router:Router, 
    private activatedRoute: ActivatedRoute,
    private globalService:GlobalUtilsService ) { }  

  ngOnInit(): void {

    this.id = + this.activatedRoute.snapshot.paramMap.get('id')!;
    this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo');  // 'carro' o 'historial'
    const isMantenimiento  = this.activatedRoute.snapshot.paramMap.get('isMantenimiento');  // 'carro' o 'historial'

    if(isMantenimiento) {this.isMantenimiento = isMantenimiento === 'true';}

    if(this.id && this.tipo === 'historialId') {
      this.obtenerHistorial(this.id);
      this.activatedRoute.queryParams.subscribe(params => {
        if ('soloConsulta' in params) {
          // Si `soloConsulta` existe, conviértelo en booleano y asígnalo a `this.soloConsulta`
          this.soloConsulta = params['soloConsulta'] === 'true';
        } else {
          // Opcional: Define el valor por defecto si `soloConsulta` no está presente
          this.soloConsulta = false; // o true, según lo que necesites
        }
      });
    } else if(this.id && this.tipo === 'carroId') {
      this.obtenerCarroPorId(this.id);
      this.soloConsulta = false; 
    }  
    this.obtenerTipos();
}

  onSubmit(){
    if(this.validacionDatos()) {
      this.guardarHistorial();
    }
  }

  private obtenerTipos () {
    this.historialServicio.obtenerTiposHistorial().subscribe(dato =>  {
      this.datos = dato;
      this.claves = Object.keys(this.datos);
      this.tipoHistorialList = Object.values(this.datos);
    });

    //Preseleccionar opción por defecto en el select de tipo de historial
    //DATA come from BBDD 
    // int 0 = default value = 0
    // int 1 = new Service
    // int 2 = mantinence 
    // int 3 = comment 

    if(this.isMantenimiento) {
      this.historial.idTipo = 2;
    }else {
      this.historial.idTipo = 3;
    }
  }

//Emite el evento de volver cerra el popup de registro de historial
  volver(nuevoHistorialId?: number) {
    // Si existe un 'id', realiza la navegación hacia '/carros' con un estado
    if (this.id && this.tipo === 'historialId') {
      this.router.navigate(['/carros', this.historial.carro.id], {
        state: { redireccion: true }  // Puedes incluir cualquier dato que quieras
      }); this
    }else if(this.id && this.tipo === 'carroId'){
        this.router.navigate(['/carros', this.carroSeleccionadoDetalles.id], {
          state: { 
            redireccion: true,
            verSoloRegistroMantenimiento: this.isMantenimiento,
            nuevoHistorialId : nuevoHistorialId
           }  // Puedes incluir cualquier dato que quieras
        });
    }
  }
  
  onFileSelected(event:any) {
  }

  validacionDatos(): boolean{
    const histDescr = this.historial.dsHistorial; 
    let camposFaltantes = this.camposFaltantes;

    if(!histDescr) camposFaltantes.push('descr-input');

    if(camposFaltantes.length > 0) {
      this.globalService.activarParpadeo(camposFaltantes);
      this.globalService.showErrorMessageSnackBar('El campo descripción es obligatorio');
      return false;
    }
      return true;
  }

  quitarErrorStyle(idElemento:string) {
    this.camposFaltantes.length = 0;
    this.globalService.quitarError(idElemento);
  }

  guardarHistorial() {
    if(this.historial.carro === undefined || this.historial.carro === null) {
        this.historial.carro = this.carroSeleccionadoDetalles;
    }

    if(!this.historial.id) {
      this.historialServicio.registrarHistorial(this.historial).subscribe({
        next: (dato) => {
          this.nuevoHistorial = dato;
        },
        error: (error) => console.log(error),
        complete: () => this.volver(this.nuevoHistorial.id),
      });
    }else {
      this.historialServicio.actualizarHistorial(this.historial).subscribe({
        next: (dato) => {
          this.volver();
        },
        error: (error) => console.log(error)
      });
    }
  }

  private obtenerCarroPorId(id: number) {
    this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
      this.carroSeleccionadoDetalles = c;
      this.historial.carro = c;
    });
  }
    
  obtenerHistorial(id: number) {
      this.historialServicio.getHistorialPorId(id).subscribe(h => {
        this.historial = h;
        console.log(h);
      });
  }

  darFormatoFecha(fechaAlta: Date) : string {
    return this.globalService.getStringDate(fechaAlta);
  }

  getCompleteCarDetailName(carro:Carro){
    if(carro) {
      return `${carro.marca} ${carro.modelo} `
    }
    return '';
  }

  getNumeroUnidadFormateado(): string {
    if(this.historial.carro) {
      const numUniHist = this.historial.carro.numeroUnidad;
      return this.globalService.getNumeroUnidadFormateado(numUniHist);
    }
    return '';  
  }

}
