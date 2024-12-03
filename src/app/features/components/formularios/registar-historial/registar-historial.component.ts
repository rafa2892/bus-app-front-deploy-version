import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { CarroService } from '../../../../core/services/carro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Historial } from '../../../../core/models/historial';
import { Carro } from '../../../../core/models/carro';
import { HistorialService } from '../../../../core/services/historial.service';

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
  id:any;
  tipo:any;
 

  @Input() verSoloRegistroMantenimiento : boolean;
  @Input() carroSeleccionadoDetalles: Carro = new Carro(); 
  @Output() onVolver = new EventEmitter<void>();
  @Output() historialGuardado = new EventEmitter<any>();

  constructor(
    private carroServicio:CarroService, 
    private historialServicio:HistorialService,  
    private router:Router, 
    private activatedRoute: ActivatedRoute) { }  

  ngOnInit(): void {
  this.id = + this.activatedRoute.snapshot.paramMap.get('id')!;
  this.tipo = this.activatedRoute.snapshot.paramMap.get('tipo');  // 'carro' o 'historial'
   
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
    this.carroServicio.obtenerTiposHistorial().subscribe(dato =>  {
      this.datos = dato;
      this.claves = Object.keys(this.datos);
      this.tipoHistorialList = Object.values(this.datos);
    });

    //Preseleccionar opción por defecto en el select de tipo de historial
    if(this.verSoloRegistroMantenimiento) {
      this.historial.idTipo = 2;
    }else {
      this.historial.idTipo = 0;
    }
  }

//Emite el evento de volver cerra el popup de registro de historial
  volver() {

    // Si existe un 'id', realiza la navegación hacia '/carros' con un estado
    if (this.id && this.tipo === 'historialId') {
      this.router.navigate(['/carros', this.historial.carro.id], {
        state: { redireccion: true }  // Puedes incluir cualquier dato que quieras
      });
    }else if(this.id && this.tipo === 'carroId'){
        this.router.navigate(['/carros', this.carroSeleccionadoDetalles.id], {
          state: { redireccion: true }  // Puedes incluir cualquier dato que quieras
        });
      // this.onVolver.emit();
    }
  }
  
  onFileSelected(event:any) {
    // const files: FileList = event.target.files;
    // for (let i = 0; i < files.length; i++) {
    //   const file = files.item(i);
    //   if (file) {
    //     // Verificar si el archivo no está ya en la lista
    //     if (!this.selectedFiles.some(existingFile => existingFile.name === file.name)) {
    //       this.selectedFiles.push(file);
    //     }
    //   }
    // }
  }

  validacionDatos(): boolean{
    this.historial.descripcionTipo = this.datos[this.historial.idTipo];
    return true;
  }

  guardarHistorial() {

    if(this.historial.carro === undefined || this.historial.carro === null) {
        this.historial.carro = this.carroSeleccionadoDetalles;
    }
    this.historialServicio.registrarHistorial(this.historial).subscribe({
      next: (dato) => {
        // Acción a realizar después de que se haya guardado correctamente
        // this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id);
        // this.historialGuardado.emit(this.carroSeleccionadoDetalles);
        this.volver();
      },
      error: (error) => console.log(error)
    });
  }

  private obtenerCarroPorId(id: number) {
    this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
      this.carroSeleccionadoDetalles = c;
    });

  }
    
  obtenerHistorial(id: number) {
      this.historialServicio.getHistorialPorId(id).subscribe(h => {
        this.historial = h;
      });
  }
}

