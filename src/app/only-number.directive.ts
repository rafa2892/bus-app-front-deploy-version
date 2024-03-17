import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  
  constructor(private el: ElementRef) { }

  @Output() nonNumericCount = new EventEmitter<number>();
  private countNonNumeric = 0;


  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    // Verificar si el valor inicial contiene caracteres que no son números
     
    if (/\D/.test(initialValue)) {
        this.countNonNumeric++;
        console.log(this.countNonNumeric)
        this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '').slice(0, 4);
        if (this.countNonNumeric >= 3) {
          this.nonNumericCount.emit(this.countNonNumeric);
        }

        if (initialValue !== this.el.nativeElement.value) {
          const audio = new Audio(); // Crea un nuevo elemento de audio
          audio.src = 'data:audio/wav;base64,UklGRrQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YdXMAQAAAC8AAAAAY29weXJpZ2h0IDIwMTYgQW5pbWF0ZVBhcnQBAwAIAAAACABtYXNrAAEAAAAAAAAAAAAAAAAAAA=='; // Sonido predeterminado del navegador
          audio.play();
          event.stopPropagation();
        }
    
        const inputElement = this.el.nativeElement;
        const inputValue = inputElement.value;
        if (!/^\d+$/.test(inputValue)) {
          inputElement.classList.add('input-error');
        } else {
          inputElement.classList.remove('input-error');
        }
      }
      
    else {
      this.countNonNumeric=0;
      this.nonNumericCount.emit(this.countNonNumeric);
    }    
  }

}
