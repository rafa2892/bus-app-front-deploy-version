import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faCirclePlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { fontAwesomeIcons } from '../../../../../assets/fontawesome-icons';
import { TITLES } from '../../../../constant/titles.constants';
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

    // Determines whether the component is in modal mode 
    @Input() isModalMode: boolean;

    // ID del conductor recién agregado
    newConductorId: number;
    conductoresLista : Conductor [];
    conductoresListafiltrado : Conductor [];
    nombre : string = '';
    apellido : string= '';
    dni : string= '';

    // Paginación por defecto
    p: number = 1;
    itemsPerPage = 10;  // Example value, you can adjust as needed
    totalItems = 10;  // Total items for pagination

    //Variable para el orden seleccionado
    ordenSeleccionado: string = 'nombreAsc'; 

    // Iconos
    detailsIcon = fontAwesomeIcons.detailsIcon;
    selectIcon = fontAwesomeIcons.selectIcon;
    faPlus = faCirclePlus;
    faApply = faCheck;
    faEdit = faPen;
    faErase = faTrash;

    //indicador de carga
    isLoading: boolean = false;

    //Flag user is tipying
    private typingTimeout: any = null;

    //TITLES LITERALS
    RESET_FILTER = TITLES.RESET_FILTER_TITLE_BUTTON;
    VIEW_CONDUCTOR = TITLES.VIEW_CONDUCTOR;
    EDIT_DRIVER = TITLES.EDIT_DRIVER;
    DELETE_DRIVER = TITLES.DELETE_DRIVER;


    //OrderBy variable
    orderBy = TITLES.DEFAULT_ORDER_BY// default order

    // Observable que emitirá los cambios en los filtros
    private searchSubject = new BehaviorSubject<{ nombre: string, apellido: string, dni: string }>({ nombre: '', apellido: '', dni: '' });

    constructor(
      private conductorService: ConductorService, 
      private router: Router, 
      private route: ActivatedRoute,
      private excelService: ExcelService,
      private globalService :GlobalUtilsService ) {
    }

    ngOnInit(): void {
      this.obtenerConductores(() => {
        this.route.queryParams.subscribe((params) => {
          this.newConductorId = Number(params['newConductorId']);
          if (this.newConductorId) {
            this.procesarNuevoConductor(this.newConductorId);
          }
        });
      });
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        this.globalService.buildCustomsToolTipBS();
      },50);
    }

    obtenerConductores(callback?: () => void) {
      this.isLoading = true;
      this.conductorService.obtenerListaConductoresPageable(this.p - 1, this.itemsPerPage, this.orderBy).subscribe({
        next: (response) => {
          this.conductoresLista = response.content;
          this.totalItems = response.totalElements;
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
      this.globalService.disposeCustomTooltips();
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
      
    }else {
      console.error(`Conductor con ID ${id} no encontrado en la lista.`);
      // En caso de no encontrar el conductor, usa la lista sin modificaciones
      this.conductoresListafiltrado = [...sortedConductores];
      }
    }

  resetearEstilos() {
    setTimeout(() => {
      this.globalService.cleanUrlNewEntityStyle('newConductorId');
    }, 1500); // 3 segundos de duración
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
    this.globalService.disposeCustomTooltips();
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

  onPageChange(page: number) {
    this.p = page;  // Actualiza el valor de la página actual
    this.obtenerConductores();
  }

  getFormattedDate(fecha:Date) : string {
    return this.globalService.getStringDate(fecha);
  }

  onInputChange(): void {
    // Si ya hay un timeout en curso, lo cancelamos para reiniciar el contador de tiempo
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Establecemos un nuevo timeout para ejecutar el código después de 500ms de inactividad
    this.typingTimeout = setTimeout(() => {
      this.filtrarListaConductoresPageable()
    }, 500); // Espera 500 ms de inactividad antes de ejecutar la llamada
  }

  filtrarListaConductoresPageable() {
    this.searchSubject.next({ nombre: this.nombre, apellido: this.apellido, dni: this.dni });
    this.isLoading = true;  // Mostrar el loading solo después de la espera
    this.conductorService.filtrarListaConductoresPageable(
      this.p - 1, // Paginación funciona desde 0
      this.itemsPerPage,
      this.nombre,
      this.apellido,
      this.dni,
      this.orderBy
    ).subscribe({
      next: response => {
        this.isLoading = false;  // Detener el loading después de recibir la respuesta
        this.conductoresListafiltrado = response.content;
        this.totalItems = response.totalElements;
      },
      error: (err) => {
        this.isLoading = false; // Detener el loading en caso de error
        console.error('Error en la suscripción:', err);
      },
      complete: () => {
        this.isLoading = false; // Detener el loading al completar la suscripción
        console.log('La búsqueda ha finalizado');
      }
    });
  }

  getTitleOrderBy() : string | undefined {
    return TITLES.SORTER_BY.get(this.orderBy);
  }

  sortBy(sortType:string) {

    this.orderBy = sortType;
    if(this.nombre || this.apellido || this.dni) {
      this.filtrarListaConductoresPageable();
    }else {
      this.obtenerConductores();
    }

    
  }

  resetFilterByDate() {

    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.obtenerConductores();

  }
}
