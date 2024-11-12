import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCarrosComponent } from './features/components/lista-carros/lista-carros.component';
import { RegistrarCarroComponent } from './features/components/registrar-carro/registrar-carro.component';
import { ListaViajesComponent } from './features/components/lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './features/components/registrar-viaje/registrar-viaje.component';
import { BuscadorCarroComponent } from './features/components/buscador-carro/buscador-carro.component';
import { CardBusDetailComponent } from './features/components/card-bus-detail/card-bus-detail.component';
import { ListaRutasComponent } from './features/components/lista-rutas/lista-rutas.component';
import { RegistrarRutaComponent } from './features/components/registrar-ruta/registrar-ruta.component';
import { ListaConductoresComponent } from './features/components/lista-conductores/lista-conductores.component';
import { RegistarHistorialComponent } from './features/components/registar-historial/registar-historial.component';
import { LoginComponent } from './features/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard'
import { RegistrosComponent } from './features/components/registros/registros.component';
import { NuevoRegistroComponent } from './features/components/nuevo-registro/nuevo-registro.component';
import { RegistrarMantenimientoComponent } from './features/components/registrar-mantenimiento/registrar-mantenimiento.component';
import { HistorialDetallesComponent } from './features/components/historial-detalles/historial-detalles.component';


const routes: Routes = [


  { path: 'carros',component: ListaCarrosComponent, canActivate: [AuthGuard]},
  { path: 'viajes', component: ListaViajesComponent, canActivate: [AuthGuard] },
  { path: 'registrar-carro', component: RegistrarCarroComponent, canActivate: [AuthGuard] },
  { path: 'registrar-viaje', component: RegistrarViajeComponent, canActivate: [AuthGuard] },
  { path: 'registrar-viaje/:id', component:RegistrarViajeComponent, canActivate: [AuthGuard]},
  { path: 'buscar-carro', component: BuscadorCarroComponent, canActivate: [AuthGuard] },
  { path: 'card-bus-details', component: CardBusDetailComponent, canActivate: [AuthGuard] },
  { path: 'actualizar-vehiculo/:id', component: RegistrarCarroComponent, canActivate: [AuthGuard] },
  { path: 'rutas', component: ListaRutasComponent, canActivate: [AuthGuard] },
  { path: 'crear-ruta', component: RegistrarRutaComponent, canActivate: [AuthGuard] },
  { path: 'conductores', component: ListaConductoresComponent, canActivate: [AuthGuard] },
  { path: 'registrar-historial', component: RegistarHistorialComponent, canActivate: [AuthGuard] },
  { path: 'volver-historiales/:id', component: ListaCarrosComponent, canActivate: [AuthGuard] },
  { path: 'login', component:LoginComponent},
  { path: 'lista-mantenimiento', component:RegistrosComponent},
  { path: 'nuevo-registro/:id', component:NuevoRegistroComponent},
  { path: 'nuevo-mantenimiento/:id', component:RegistrarMantenimientoComponent},
  { path: 'detalles-historial/:id', component:HistorialDetallesComponent}
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
