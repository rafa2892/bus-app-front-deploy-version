import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Carro } from '../../../../core/models/carro';
import { ListaHistorialComponent } from '../../listas/lista-historial/lista-historial.component';
import { CarroService } from '../../../../core/services/carro.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-historial-vehiculos',
  templateUrl: './popup-historial-vehiculos.component.html',
  styleUrl: './popup-historial-vehiculos.component.css'
})
export class PopupHistorialVehiculosComponent {

    @ViewChild(ListaHistorialComponent) listaHistoriachildComponent!: ListaHistorialComponent; // Acceso al componente hijo

    constructor(
      private carroServicio:CarroService, 
      private modalService: NgbModal) {}

    tituloPopUp :string = 'Historial';
    modalLabel = 'historialModalLabel';
    idModal: string = 'verHistorialPopUp';
    mostrarListaHistorial: boolean = true; // o false según la condición
    mostrarRegistrarHistorial: boolean = false; // o false según la condición
    historialActualizado = false;
    isModalProgramatico : boolean = false;
    carro:Carro;


    //new historial id 
    newHistorialID: number = 0;

    @Input() carroSeleccionadoDetalles: Carro;
    @Input() verSoloRegistroMantenimiento = false;
    @Input() changeDetecterFlag : boolean;

    ngOnInit(): void {
      if(this.carro != undefined && this.carroSeleccionadoDetalles == undefined) {
        this.carroSeleccionadoDetalles = this.carro;
      }
    }

    addHistory() {
      // Cambiar las propiedades cuando se guarde el historial
      this.cerrarModal();
      this.mostrarListaHistorial = false;
      this.mostrarRegistrarHistorial = true;
    }

    cleanInitMethodSimple() {
      this.mostrarListaHistorial = true;
      this.mostrarRegistrarHistorial = false;
    }

    actualizarCarro(carro:Carro) {
      // this.obtenerCarroPorId(this.carroSeleccionadoDetalles.id);
    }

    cleanInitMethod(carro:Carro, mostrarSoloMantenimeinto:boolean, nuevoHistorialId:number) {
      this.mostrarListaHistorial = true;
      this.mostrarRegistrarHistorial = false;
      this.verSoloRegistroMantenimiento = mostrarSoloMantenimeinto;
      this.carroSeleccionadoDetalles = carro;
      this.newHistorialID = nuevoHistorialId;
    }

    private obtenerCarroPorId(id: number) {
      this.carroServicio.obtenerCarroPorId(id).subscribe(c => {
        this.carro = c;
      });
    }

    cerrarModal() {
      this.modalService.dismissAll()// cierra el modal que esté mostrandose
    }
}


