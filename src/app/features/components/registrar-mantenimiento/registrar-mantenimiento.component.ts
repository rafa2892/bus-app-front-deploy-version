import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CarroService } from '../../../core/services/carro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Historial } from '../../../core/models/historial';
import { Carro } from '../../../core/models/carro';
import { HistorialService } from '../../../core/services/historial.service';

@Component({
  selector: 'app-registrar-mantenimiento',
  templateUrl: './registrar-mantenimiento.component.html',
  styleUrl: './registrar-mantenimiento.component.css'
})
export class RegistrarMantenimientoComponent {
  datos: { [key: string]: string } = {};
  claves: string[] = [];
  tipoHistorialList: string[] = [];
  selectedFiles: File[] = [];
  selectedTipo: string | null = null; // Variable para enlazar la opción seleccionada
  historial : Historial = new Historial;


  @Input() carroSeleccionadoDetalles: Carro = new Carro; 
  @Output() onVolver = new EventEmitter<void>();
  @Output() historialGuardado = new EventEmitter<any>();

  constructor(
    private carroServicio:CarroService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private historialServicio : HistorialService) { }  
 
  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.paramMap.get('id')!;
    if(id) {
      this.obtenerCarroPorId(id);
      console.log("Carro seleccionado:", this.carroSeleccionadoDetalles);
    }

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
  
  onSubmit(){
      if(this.validacionDatos()) {
        this.guardarHistorial();
      }
  }

  validacionDatos(): boolean{
    this.historial.descripcionTipo = this.datos[this.historial.idTipo];
    return true;
  }

  guardarHistorial() {
    this.historialServicio.registrarHistorial(this.historial).subscribe({
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
