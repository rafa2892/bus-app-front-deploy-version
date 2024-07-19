import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayOfWeek'
})
export class DayOfWeekPipe implements PipeTransform {
  
  
  transform(value: any): string {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const date = new Date(value); // Asegúrate de convertir el valor a Date
    if (isNaN(date.getTime())) {
      return ''; // Devuelve una cadena vacía o un valor por defecto si la fecha no es válida
    }
    return days[date.getDay()].toUpperCase();
  }

}
