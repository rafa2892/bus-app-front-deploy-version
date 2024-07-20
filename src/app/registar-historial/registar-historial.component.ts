import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarroService } from '../carro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Historial } from '../historial';
import { Carro } from '../carro';

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


  @Input() carroSeleccionadoDetalles: Carro = new Carro; 
  @Output() onVolver = new EventEmitter<void>();
  @Output() historialGuardado = new EventEmitter<void>();



  constructor(private carroServicio:CarroService, private router:Router,   private activatedRoute: ActivatedRoute) { }  
 
  


  ngOnInit(): void {
    if(this.carroSeleccionadoDetalles != undefined) {
    this.historial.carro = this.carroSeleccionadoDetalles;
    }  
    this.obtenerTipos();
    
 }

  private obtenerTipos () {
    this.carroServicio.obtenerTiposHistorial().subscribe(dato =>  {
      this.datos = dato;
      this.claves = Object.keys(this.datos);
      this.tipoHistorialList = Object.values(this.datos);
    });
  }

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

  

  onSubmit(){
      if(this.validacionDatos()) {
        this.guardarHistorial();
      }
  }

  validacionDatos(): boolean{
    this.historial.descripcionTipo = this.datos[this.historial.idTipo];
    return true;
  }

  pruebaMetodo() {

    
  }


  guardarHistorial(){
      this.carroServicio.registrarHistorial(this.historial).subscribe(dato => {
      }, error => console.log(error));
      this.historialGuardado.emit();

      this.volver();
    }

    

   
}
