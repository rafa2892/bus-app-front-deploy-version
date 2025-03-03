import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  authServiceAux : AuthService;

  imagenCabecera: string = 'assets/default-icon.png'; // Imagen por defecto


  private imagenesPorRuta: { [key: string]: string } = {
    // 🚍 cars
    'lista-carros': 'assets/bus-icon-main.png',
    'carros': 'assets/bus-icon-main.png',
    'registrar-carro': 'assets/bus-icon-main.png',
    'actualizar-vehiculo': 'assets/bus-icon-main.png',
  
    // 🛣️ services(trips)
    'lista-viajes': 'assets/road-trip-icon.png',
    'registrar-viaje': 'assets/road-trip-icon.png',
    
    // Si la ruta tiene un parámetro (ej: lista-viajes/:idConductor)
    'lista-viajes/byCarro': 'assets/road-trip-icon.png',
    'lista-viajes/:idConductor': 'assets/road-trip-icon.png',
    'registrar-viaje/:id': 'assets/road-trip-icon.png',
  
    // 👨‍✈️ Conductores
    'lista-conductores':  'assets/driver-icon.png',
    'registrar-conductor': 'assets/driver-icon.png',
  
    // 🏥 maintenance
    'lista-registros': 'assets/audit-icon.png',
    'nuevo-mantenimiento': 'assets/audit-icon.png',
  
    // 📜 hsitories
    'lista-historial': 'assets/history-icon.png',
    'registrar-historial': 'assets/history-icon.png',
    'volver-historiales': 'assets/history-icon.png',
  
    // 📋 General registers
    'nuevo-registro': 'assets/registry-icon.png',
  
    // 🔑 Login
    'login': 'assets/default-icon.png',
  
    // 🌎 Ruta por defecto (si no encuentra coincidencias)
    '**': 'assets/default-icon.png'
  };

  title = 'Sistema de registro Transportes "Nombre Empresa"';


  constructor(private authService:AuthService, private router: Router){
    this.authServiceAux = this.authService;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarImagen(event.urlAfterRedirects);
      }
    });
  }

  private actualizarImagen(ruta: string) {
    const rutaLimpia = ruta.split('/')[1]; // Extraer solo la primera parte de la URL
    this.imagenCabecera = this.imagenesPorRuta[rutaLimpia] || 'assets/default-icon.png';
  }
  

  logout():void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAuthenthicated() : boolean {
    const token = this.authService.getToken();
    if (!token) {
      // Maneja el caso donde no hay token
      return false;
    }
    return this.authService.isTokenValid(token);
  }

  setBackGroundColorByImage(imgUrl:string) : string {
    if(imgUrl === 'assets/history-icon.png') {
        return 'trasp'
    }else return '';
  }
}