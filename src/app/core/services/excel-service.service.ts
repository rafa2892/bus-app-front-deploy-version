import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TITLES } from '../../constant/titles.constants';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private apiUrl = 'http://localhost:8080/api/v1/excel/download';

  constructor(private http: HttpClient) {}

  // downloadExcel(tipo:string, fechaInicio?: Date, fechaFin?: Date ) {

  // const params: any = {};

  //   if (fechaInicio && fechaFin) {
  //       params.fechaInicio = fechaInicio;
  //       params.fechaFin = fechaFin;
  //   }

  //   this.http.get(`${this.apiUrl}/${tipo}`, { 
  //     params: params,
  //     responseType: 'blob', 
  //     observe: 'response' 
  //   }).subscribe({
  //         next: (response) => {
  //             // Si el código de estado no es 200, no se hace nada
  //             if (response.status !== 200 || !response.body || response.body.size === 0) {
  //                 console.error('Error en la respuesta del servidor:', response);
  //                 alert('Error al generar el archivo. Intente nuevamente.');
  //                 return; // Aquí termina la ejecución sin intentar descargar el archivo
  //             }
  //         },
  //         error: (error) => {
  //             console.error('Error en la descarga del archivo:', error);
  //             alert('No se pudo generar el archivo. Verifique su conexión o intente más tarde.');
  //         }
  //     });
  // }


  
  downloadExcel(tipo:string, fechaInicio?: Date, fechaFin?: Date ) {

    // fechaInicio = new Date();
    // fechaFin = new Date();

  const params: any = {};

    if (fechaInicio && fechaFin) {
      params.fechaInicio = fechaInicio;
      params.fechaFin = fechaFin;
    }

    if(tipo === 'viajesDiaEspecifico' && fechaInicio && !fechaFin) {
        params.fechaInicio = fechaInicio; 
    }

    this.http.get(`${this.apiUrl}/${tipo}`, { 
      params: params,
      responseType: 'blob', 
      observe: 'response' 
    }).subscribe({


    next: (response) => {
      if (response.status !== 200) {
        console.error('Error en la respuesta del servidor:', response);
        alert('Error al generar el archivo. Intente nuevamente.');
        return;
      }

      // Verificamos si la respuesta es realmente un Excel válido
      if (!response.body || response.body.size === 0) {
        console.error('El archivo generado está vacío.');
        alert('El archivo está vacío. Verifique los parámetros.');
        return;
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'datos.xlsx'; // Nombre por defecto

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match.length > 1) {
          filename = match[1]; // Extraemos el nombre del archivo
        }
      }

      const objectUrl = URL.createObjectURL(response.body);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(objectUrl);
    },
    error: (error) => {
      console.error('Error en la descarga del archivo:', error);
      alert('No se pudo generar el archivo. Verifique su conexión o intente más tarde.');
    }
});
  }


  // downloadExcel(tipo:String, fechaInicio?: Date, fechaFin?: Date ) {

  //   // fechaInicio = new Date();
  //   // fechaFin = new Date();
  //   tipo= "viajes2";
  //   console.log(tipo);

  //   // Creamos un objeto vacío para los parámetros
  //   const params: any = {};

  //   // Solo asignamos las fechas si no son nulas ni indefinidas
  //   if (fechaInicio && fechaFin) {
  //     params.fechaInicio = fechaInicio;
  //     params.fechaFin = fechaFin;
  //   }

  //   this.http.get(`${this.apiUrl}/${tipo}`, { 

  //     params: params,
  //     responseType: 'blob', observe: 'response' })


  //     .subscribe(response => {
  //       const contentDisposition = response.headers.get('Content-Disposition');
  //       let filename = 'datos.xlsx'; // Nombre por defecto
  
  //       if (contentDisposition) {
  //         const match = contentDisposition.match(/filename="(.+)"/);
  //         if (match && match.length > 1) {
  //           filename = match[1]; // Extraemos el nombre del archivo
  //         }
  //       }
  
  //       const objectUrl = URL.createObjectURL(response.body as Blob);
  //       const a = document.createElement('a');
  //       a.href = objectUrl;
  //       a.download = filename;
  //       a.click();
  //       URL.revokeObjectURL(objectUrl);
  //     });
  // }
}  
