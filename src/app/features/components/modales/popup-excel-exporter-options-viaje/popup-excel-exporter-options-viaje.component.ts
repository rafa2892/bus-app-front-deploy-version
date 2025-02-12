import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExcelService } from '../../../../core/services/excel-service.service';
import { TITLES } from '../../../../constant/titles.constants';
import { GlobalUtilsService } from '../../../../core/services/global-utils.service';

@Component({
  selector: 'app-popup-excel-exporter-options-viaje',
  templateUrl: './popup-excel-exporter-options-viaje.component.html',
  styleUrl: './popup-excel-exporter-options-viaje.component.css'
})
export class PopupExcelExporterOptionsViajeComponent {

  tituloPopUp :string = 'Tipo de exportación de servicios';
  modalLabel = 'excelExporterOptions';
  idModal: string = 'excelExporterOptions';
  isModalProgramatico : boolean = false;
  modalSizeClass : string = 'modal-lg';

  fechaDesde : Date | null;
  fechaHasta : Date | null;
  fechaDesdeStr : string;
  fechaHastaStr : string;

  @Input() tipoExport : string | null = null;

  constructor(
    private datePipe: DatePipe,
    private excelService:ExcelService,
    private globalService:GlobalUtilsService) {}

  filterDatesHasta = (date: Date | null): boolean => {
    if(this.fechaDesde) {
      if (!date) return false;
      if (this.fechaDesde > date) return false;
    }
    return this.validarDiasFuturos(date);
  };
  
  filterDatesDesde = (date: Date | null): boolean => {
    return this.validarDiasFuturos(date);
  };

  validarDiasFuturos(date: Date | null) : boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Bloquear fechas futuras
    return date ? date <= today : false;
  }

  public selectedDateFormat(fecha: Date | null, fechaTipo: string) {
    if (fecha) {
      // Si la fecha está definida, la formateamos
      let fechaStr = this.datePipe.transform(fecha, 'dd/MM/yyyy');
      fechaStr = fechaStr || '';
      // Según el tipo de fecha (Desde o Hasta), asignamos el valor
      if (fechaTipo === 'desde') {
          this.fechaDesdeStr = fechaStr;
          this.fechaHastaMayorDesde(fecha);
      } else if (fechaTipo === 'hasta') {
          this.fechaHastaStr = fechaStr;
      }
    }
  }

  fechaHastaMayorDesde(fecha:Date) {
    if((this.fechaHasta && fecha > this.fechaHasta))
        this.fechaHasta = this.fechaDesde;
  }

  descargarExcel() {
    if(this.tipoExport) {

      let mensajeError = '';

      if(this.tipoExport=== TITLES.EXCEL_EXPORT_VIAJES_TYPE_BETWEEN_DATES) {
        if(this.fechaDesde && this.fechaHasta) {
          this.excelService.downloadExcel('viajesPorFechas', this.fechaDesde, this.fechaHasta);
        }else {
          mensajeError = 'Debes ingresar fechas para exportar el excel'
          this.globalService.showErrorMessageSnackBar(mensajeError);
        }
      }
      
      if(this.tipoExport === TITLES.EXCEL_EXPORT_VIAJES_TYPE_SPECIFIC_DAY) {
        if(this.fechaDesde) {
          this.excelService.downloadExcel('viajesDiaEspecifico', this.fechaDesde);
        }
        else {
          mensajeError = 'Selecciona una fecha'
          this.globalService.showErrorMessageSnackBar(mensajeError);
        }
      }
    }
  }

  isEnabled() : boolean {
    if(this.tipoExport) {
      if(this.tipoExport === TITLES.EXCEL_EXPORT_VIAJES_TYPE_BETWEEN_DATES) {return true;}
      if(this.tipoExport === TITLES.EXCEL_EXPORT_VIAJES_TYPE_SPECIFIC_DAY) {return false;}
    }
    return true;
  }

  getPlaceHolderDesde() : string {
    if(this.tipoExport) {
      if(this.tipoExport === TITLES.EXCEL_EXPORT_VIAJES_TYPE_BETWEEN_DATES) {return 'Desde'};
      if(this.tipoExport === TITLES.EXCEL_EXPORT_VIAJES_TYPE_SPECIFIC_DAY) {return 'Selecciona dia'};
    }
    return 'Indique fecha';
}

}
