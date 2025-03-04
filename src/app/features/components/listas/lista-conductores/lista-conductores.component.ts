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
    newConductorId: number = 0;


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
    orderBy = TITLES.DRIVER_DEFAULT_ORDER_BY// default order

    // Observable que emitirá los cambios en los filtros
    private searchSubject = new BehaviorSubject<{ nombre: string, apellido: string, dni: string }>({ nombre: '', apellido: '', dni: '' });

    constructor(
      private conductorService: ConductorService, 
      private router: Router, 
      private route: ActivatedRoute,
      private excelService: ExcelService,
      private globalService :GlobalUtilsService ) {
    }


    ngOnInit() {
      const newCarId = this.route.snapshot.queryParams['newConductorId'];
      if(newCarId) {
        this.newConductorId = Number(newCarId);
        this.globalService.getSuccessfullMsj(TITLES.NEW_DRIVER_SUCCESSFUL_SAVED_MSJ);
      }
      this.obtenerConductores();
    }

    ngAfterViewInit(): void {
      this.initToolTip();
    }


    initToolTip() {
      setTimeout(() => this.globalService.buildCustomsToolTipBS(), 50);
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
        },
        error: (error) => console.error('Error al obtener conductores:', error),
      }).add(() => {
        if(this.newConductorId && this.newConductorId > 0) {this.limpiarURL();}
        this.isLoading = false
        this.initToolTip();
      });
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
      }).add(() => {
        this.isLoading = false
        this.initToolTip();
      });;
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
      this.disposeToolTip();
      this.router.navigate(['/registrar-conductor']);
    }

  limpiarURL() {
    setTimeout(() => {
      this.globalService.cleanUrlNewEntityStyle('newConductorId');
      this.newConductorId = 0; //Resete highlight variable, when new driver is registered
    }, 2500); // 3 segundos de duración
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
    this.disposeToolTip();
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


  getTitleOrderBy() : string | undefined {
    return TITLES.SORTER_BY_DRIVERS.get(this.orderBy);
  }

  sortBy(sortType:string) {
    this.orderBy = sortType;
    if(this.nombre || this.apellido || this.dni) {
      this.filtrarListaConductoresPageable();
    }else {
      this.obtenerConductores();
    }
  }

  resetFilters() {
    if(this.nombre || this.apellido || this.dni) {
        this.nombre = '';
        this.apellido = '';
        this.dni = '';
        this.obtenerConductores();
    }
  }

  disposeToolTip() {
    this.globalService.disposeCustomTooltips();
  }
}
