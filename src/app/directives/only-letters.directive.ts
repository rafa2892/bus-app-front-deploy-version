import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {

  constructor(private el: ElementRef) { }

  @Output() nonNumericCount = new EventEmitter<number>();
  private countNonNumeric = 0;

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    
    // Verificar si el valor inicial contiene números
    if (/\d/.test(initialValue)) {
      this.countNonNumeric++;
      // Elimina los números y deja solo los caracteres no numéricos
      this.el.nativeElement.value = initialValue.replace(/[0-9]*/g, '').slice(0, 50);
      
      // Emitir el contador si se ingresaron 3 números no permitidos
      if (this.countNonNumeric >= 3) {
        this.nonNumericCount.emit(this.countNonNumeric);
      }

      if (initialValue !== this.el.nativeElement.value) {
        // Puedes emitir un sonido o realizar alguna acción si es necesario
        const audio = new Audio(); // Crea un nuevo elemento de audio
        audio.src = 'data:audio/wav;base64,UklGRrQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdXMAQAAAC8AAAAAY29weXJpZ2h0IDIwMTYgQW5pbWF0ZVBhcnQBAwAIAAAACABtYXNrAAEAAAAAAAAAAAAAAAAAAA==';
        audio.play();
        event.stopPropagation();
      }

      const inputElement = this.el.nativeElement;
      const inputValue = inputElement.value;

      // Si el valor contiene números, se agrega una clase de error
      if (/\d/.test(inputValue)) {
        inputElement.classList.add('input-error');
      } else {
        inputElement.classList.remove('input-error');
      }
    } else {
      // Si no hay números, reiniciamos el contador y emitimos el evento
      this.countNonNumeric = 0;
      this.nonNumericCount.emit(this.countNonNumeric);
    }
  }

}
