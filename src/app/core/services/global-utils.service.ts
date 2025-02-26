  import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
  import Swal from 'sweetalert2';
import { TITLES } from '../../constant/titles.constants';
  declare var bootstrap: any;

  @Injectable({
    providedIn: 'root'
  })
  export class GlobalUtilsService {

    constructor(private _snackBar: MatSnackBar) { }

    getNumeroUnidadFormateado(numeroUnidad: number): string {
      if(numeroUnidad)
        return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
      else
        return '';
    }

    // Método para activar el parpadeo de los campos faltantes
    activarParpadeo(campos: string[]) {
      campos.forEach((campoId) => {
        
        const elemento = document.getElementById(campoId);
        
        if(campoId === 'fecha-nacimiento') {
          const elementoPicker =  document.getElementById('mat-picker-date-component');
          elementoPicker?.classList.add('input-error-date-picker');
          setTimeout(() => {
            elementoPicker?.classList.remove('input-error-date-picker');
          }, 1500)
        } 
        
        if (elemento) {
          elemento.classList.add('input-error-blink');
          // Remueve la clase después de 2 segundos
          setTimeout(() => {
            elemento.classList.remove('input-error-blink');
          }, 1500);
        }
      });
    }

    // Método para quitar el efecto visual de error de un campo
    quitarError(campoId: string): void {
      const elemento = document.getElementById(campoId);
      if (elemento) {
        elemento.classList.remove('input-error');
      }
    }

    async getMensajeConfirmaModal(title:string, text:string) {
      const result = await Swal.fire({
        title: title,
        html: text,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar',
        reverseButtons: true,
      });
      return result;
    }

  // Método para inicializar tooltips
  initTooltips(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl: any) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { "show": 500, "hide": 500 } // Retraso en milisegundos
      });
    });
  }

  showErrorMessageSnackBar(msj:string) {
    this._snackBar.open(msj, 'Cerrar', {
          duration: 4000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'end',
          verticalPosition: 'top',
      });
    }

    getStringDate(fechaAlta:Date) : string {
      if (fechaAlta) {
        const fecha = new Date(fechaAlta);
        // Extraer el día, mes y año
        const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que el día tenga 2 dígitos
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // getMonth() empieza desde 0, así que sumamos 1
        const año = fecha.getFullYear();
        // Formatear la fecha como dd/mm/yyyy
        return `${dia}/${mes}/${año}`;
      }
      return '';  
  }

  buildCustomsToolTipBS() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl: any) {
      const tooltip = new bootstrap.Tooltip(tooltipTriggerEl, {
        delay: { "show": 400, "hide": 150 } // Retraso en milisegundos
      });
      // Guardar el tooltip en una propiedad para poder eliminarlo más tarde
      tooltipTriggerEl.tooltipInstance = tooltip;
    });
  }

  disposeCustomTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl: any) {
      const tooltip = tooltipTriggerEl.tooltipInstance;
      if (tooltip) {
        tooltip.dispose();  // Elimina el tooltip
      }
    });
  }

  abrirModalProgramatico(idModal: string) {
    let modal = new bootstrap.Modal(document.getElementById(idModal!));
    modal.show();
  }

  removeClassFromAllElements(className: string): void {
  }
  
  getSuccessfulMsj(msj:string) {
    this._snackBar.open(msj, '', {
      duration: 2500,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  

}
