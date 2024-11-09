import { Component, EventEmitter, Input, Output, SimpleChange } from '@angular/core';
import { CarroService } from '../../../core/services/carro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Historial } from '../../../core/models/historial';
import { Carro } from '../../../core/models/carro';

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


  @Input() verSoloRegistroMantenimiento : boolean;
  @Input() carroSeleccionadoDetalles: Carro = new Carro; 
  @Output() onVolver = new EventEmitter<void>();
  @Output() historialGuardado = new EventEmitter<any>();



  constructor(private carroServicio:CarroService, private router:Router,   private activatedRoute: ActivatedRoute) { }  

  ngOnInit(): void {
    if(this.carroSeleccionadoDetalles != undefined) {
    this.historial.carro = this.carroSeleccionadoDetalles;
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
    }
    else {
      this.historial.idTipo = 0;
    }
  }

//Emite el evento de volver cerra el popup de registro de historial
  volver() {
    this.onVolver.emit();
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
    this.carroServicio.registrarHistorial(this.historial).subscribe({
      next: (dato) => {
        // Acción a realizar después de que se haya guardado correctamente
        this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id);
        this.historialGuardado.emit(this.carroSeleccionadoDetalles);
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
    

   
}
