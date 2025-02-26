import { Component, EventEmitter, Output,Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import { Conductor } from '../../../../core/models/conductor';
import { ConductorService } from '../../../../core/services/conductor.service';
import { ExcelService } from '../../../../core/services/excel-service.service';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';

@Component({
  selector: 'app-lista-conductores',
  templateUrl: './lista-conductores.component.html',
  styleUrl: './lista-conductores.component.css'
})
export class ListaConductoresComponent {

    @Output() seleccionarConductor  = new EventEmitter<any>();
    @Input() modalModoSeleccionarConductor : boolean;

    // ID del conductor recién agregado
    newConductorId: number;
    conductoresLista : Conductor [];
    conductoresListafiltrado : Conductor [];
    nombre : string = '';
    apellido : string= '';
    dni : string= '';

    // Paginación por defecto
    p: number = 1;

    //Variable para el orden seleccionado
    ordenSeleccionado: string = 'nombreAsc'; 

    // Iconos
    detailsIcon = fontAwesomeIcons.detailsIcon;
    selectIcon = fontAwesomeIcons.selectIcon;
    faPlus = faPlus;
    faApply = faCheck;
    faEdit = faPen;
    faErase = faTrash;

    //indicador de carga
    isLoading: boolean = false;

    constructor(
      private conductorService: ConductorService, 
      private router: Router, 
      private route: ActivatedRoute,
      private excelService: ExcelService,
      private globalService :GlobalUtilsService ) {
    }

    ngOnInit(): void {
      this.isLoading = true;
      this.obtenerConductores(() => {
        this.route.queryParams.subscribe((params) => {
          this.newConductorId = Number(params['newConductorId']);
          if (this.newConductorId) {
            this.procesarNuevoConductor(this.newConductorId);
          }
        });
      });
    }

    obtenerConductores(callback?: () => void) {
      this.conductorService.obtenerListaConductores().subscribe({
        next: (dato) => {
          this.conductoresLista = dato;
          this.conductoresListafiltrado = [...this.conductoresLista]; // Inicializamos correctamente
        },
        complete: () => {
          if (callback) callback();
          this.isLoading = false; // Llamamos al callback si existe
        },
        error: (error) => console.error('Error al obtener conductores:', error),
      });
    }
    
    verDetalles(id:number) {
      this.router.navigate(['/registrar-conductor/true', id]);
    }

    seleccionar(conductor:Conductor) {
      this.seleccionarConductor.emit(conductor);
    }

    onInputChangeNombre() {
      const nombre = this.nombre.trim().toLowerCase();
      const apellido = this.apellido.trim().toLowerCase();
      const dni = this.dni.trim().toLowerCase();

      this.conductoresListafiltrado = this.conductoresLista.filter(c => {
        const marcaCoincide = nombre === '' || c.nombre.toString().toLowerCase().includes(nombre);
        const añoCoincide = apellido === '' || c.apellido.toString().toLowerCase().includes(apellido);
        const cedula = dni === '' || c.dni.toString().toLowerCase().includes(dni);
        return marcaCoincide && añoCoincide && cedula;
      });
    }  

    irRegistrarConductor() {
      this.router.navigate(['/registrar-conductor']);
    }

    procesarNuevoConductor(id: number): void {
      if (!this.conductoresListafiltrado || this.conductoresListafiltrado.length === 0) {
        console.error('La lista de conductores no está inicializada.');
        return;
      }

        // Ordena y asegura que el nuevo conductor esté al principio de la lista
      const sortedConductores = this.conductoresListafiltrado.sort((a, b) => {
      if (a.fechaAlta && b.fechaAlta) {
        return new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime();
      }
      return b.id - a.id;});

      const conductorEncontrado = sortedConductores.find((c) => {
      return c.id === id;
    });

    if (conductorEncontrado) {
      // Mueve el nuevo conductor al inicio de la lista
      this.conductoresListafiltrado = [
        conductorEncontrado,
        ...sortedConductores.filter((c) => c.id !== id),
      ];

      this.newConductorId = id;
      this.resetearEstilos();
      
    } else {
      console.error(`Conductor con ID ${id} no encontrado en la lista.`);
      // En caso de no encontrar el conductor, usa la lista sin modificaciones
      this.conductoresListafiltrado = [...sortedConductores];
    }
    }

  resetearEstilos() {
    // Aplica la clase 'nuevo-conductor' para el conductor recién creado
    setTimeout(() => {
      this.newConductorId = 0; // Esto elimina la clase 'nuevo-conductor' después de la animación
    }, 4000); // 3 segundos de duración
  }

  ordenarLista() {
    switch (this.ordenSeleccionado) {
      case 'nombreAsc':
        this.conductoresListafiltrado.sort((a, b) => {
          if (!a.nombre) return 1; // Coloca `a` después si su nombre es `null` o `undefined`
          if (!b.nombre) return -1; // Coloca `b` después si su nombre es `null` o `undefined`
          return a.nombre.localeCompare(b.nombre);
        });
        break;
  
      case 'nombreDesc':
        this.conductoresListafiltrado.sort((a, b) => {
          if (!a.nombre) return 1; // Coloca `a` después si su nombre es `null` o `undefined`
          if (!b.nombre) return -1; // Coloca `b` después si su nombre es `null` o `undefined`
          return b.nombre.localeCompare(a.nombre);
        });
        break;
  
      case 'fechaAltaAsc':
        this.conductoresListafiltrado.sort((a, b) => {
          const fechaA = a.fechaAlta ? new Date(a.fechaAlta).getTime() : Infinity; // Asigna un valor muy grande si `fechaAlta` es `null`
          const fechaB = b.fechaAlta ? new Date(b.fechaAlta).getTime() : Infinity;
          return fechaA - fechaB;
        });
        break;
  
      case 'fechaAltaDesc':
        this.conductoresListafiltrado.sort((a, b) => {
          const fechaA = a.fechaAlta ? new Date(a.fechaAlta).getTime() : -Infinity; // Asigna un valor muy pequeño si `fechaAlta` es `null`
          const fechaB = b.fechaAlta ? new Date(b.fechaAlta).getTime() : -Infinity;
          return fechaB - fechaA;
        });
        break;
    }
    this.p = 1;
  }
  
  //CRUD
  async eliminar(id:number) {
    const eliminar = await  this.mensajeConfirmarEliminar()
    if (eliminar) {
      this.conductorService.eliminar(id).subscribe({
        next: () => {
          this.obtenerConductores();
        },
        error: (error) => console.error('Error al eliminar conductor:', error),
      });
    }
  }

  async mensajeConfirmarEliminar() :Promise<boolean> {
    const title = 'Confirma eliminar conductor'
    const text = '¿Estás seguro de eliminar este conductor?. Todos sus datos serán borrados permanentemente.'
    const isConfirmed = await this.globalService.getMensajeConfirmaModal(title,text);

    if (!isConfirmed.isConfirmed) {
      return false;
    }else {
      return true;
    }
  } 

  editar(conductor:Conductor) {
    this.router.navigate(['/registrar-conductor', conductor.id]);
  }

  //NO IMPLEMENTADO

  onInputChangeApellidoFilter() {
  }

  onInputChangeDniFilter() {
  }

  clearFilters(){
  }

  onBlurNombre() {
  }

  descargarExcel() {
    this.excelService.downloadExcel("conductores");
  }

  // ordenarLista() {
  //   switch (this.ordenSeleccionado) {
  //     case 'nombreAsc':
  //       this.conductoresListafiltrado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  //       break;
  //     case 'nombreDesc':
  //       this.conductoresListafiltrado.sort((a, b) => b.nombre.localeCompare(a.nombre));
  //       break;
  //     case 'fechaAltaAsc':
  //       this.conductoresListafiltrado.sort((a, b) => new Date(a.fechaAlta).getTime() - new Date(b.fechaAlta).getTime());
  //       break;
  //     case 'fechaAltaDesc':
  //       this.conductoresListafiltrado.sort((a, b) => new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime());
  //       break;
  //   }

  // // Reinicia la paginación a la primera página
  //   this.p = 1;
  //   }

}
