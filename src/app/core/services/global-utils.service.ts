import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalUtilsService {

  constructor() { }

  getNumeroUnidadFormateado(numeroUnidad: number): string {
    if(numeroUnidad)
      return `UN-${numeroUnidad.toString().padStart(3, '0')}`;
    else
      return '';
  }


}
