import { Component } from '@angular/core';

@Component({
  selector: 'app-prueba-contenedores-estilos',
  templateUrl: './prueba-contenedores-estilos.component.html',
  styleUrl: './prueba-contenedores-estilos.component.css'
})
export class PruebaContenedoresEstilosComponent {

  address: string = '';
  autocomplete: any;
  public direccionSalida: string = '';
  public direccionDestino: string = '';
  public distancia: string = ''; // Distancia entre los puntos


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initAutocomplete('address-from', (direccion: string) => {
      this.direccionSalida = direccion;
    });

    this.initAutocomplete('address-to', (direccion: string) => {
      this.direccionDestino = direccion;
    });
  }

  // Función reutilizable para inicializar el autocompletado
  // initAutocomplete(elementId: string, callback: (direccion: string) => void): void {
  //   const input = document.getElementById(elementId) as HTMLInputElement;
  //   const autocomplete = new google.maps.places.Autocomplete(input);
    
  //   autocomplete.addListener('place_changed', () => {
  //     const place = autocomplete.getPlace();
  //     if (place.geometry) {
  //       const direccion = place.formatted_address || '';
  //       callback(direccion); // Llamamos al callback con la dirección seleccionada
  //       console.log('Dirección seleccionada: ', direccion);
  //     }
  //   });
  // }

  // Función reutilizable para inicializar el autocompletado
initAutocomplete(elementId: string, callback: (direccion: string) => void): void {
  const input = document.getElementById(elementId) as HTMLInputElement;

  // Configuración del autocompletado con restricciones de país
  const autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: 'VE' }, // Restricción para Venezuela
    fields: ['geometry', 'formatted_address'], // Campos necesarios
  });

  // Listener para manejar el evento cuando se selecciona un lugar
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const direccion = place.formatted_address || '';
      callback(direccion); // Llamamos al callback con la dirección seleccionada
      console.log('Dirección seleccionada: ', direccion);
    } else {
      console.log('No se seleccionó un lugar válido.');
    }
  });
}


  onSubmit() {
      console.log('Formulario enviado con la dirección:', this.direccionSalida);
      console.log('Formulario enviado con la dirección:', this.direccionDestino)
      this.calculateDistance(this.direccionSalida, this.direccionDestino);
  }

  calculateDistance(startAddress: string, endAddress: string): void {
    const directionsService = new google.maps.DirectionsService();
  
    const request = {
      origin: startAddress,
      destination: endAddress,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        // Usamos encadenamiento opcional para evitar el error de 'undefined'
        const distance = result?.routes?.[0]?.legs?.[0]?.distance?.text;
  
        if (distance) {
          this.distancia = distance; // Asignamos la distancia al modelo
          console.log('Distancia entre las direcciones: ', distance);
        } else {
          this.distancia = 'Sin datos'
          console.error('No se pudo obtener la distancia');
        }
      } else {
        this.distancia = 'Sin datos Error'
        console.error('Error al obtener la distancia: ', status);
      }
    });
  }
  
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Esto previene el comportamiento de enviar el formulario con "Enter"
    }
  }

  calculaDistancia() {
    if(this.direccionSalida && this.direccionSalida) {
      this.calculateDistance(this.direccionSalida, this.direccionDestino);
    }
    else{
      this.distancia='Introduzca distancia manualmente'
    }
  }


}
