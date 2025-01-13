import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCarrosComponent } from './features/components/listas/lista-carros/lista-carros.component';
import { RegistrarCarroComponent } from './features/components/formularios/registrar-carro/registrar-carro.component';
import { ListaViajesComponent } from './features/components/listas/lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './features/components/formularios/registrar-viaje/registrar-viaje.component';
import { ListaRutasComponent } from './features/components/listas/lista-rutas/lista-rutas.component';
import { RegistrarRutaComponent } from './features/components/formularios/registrar-ruta/registrar-ruta.component';
import { ListaConductoresComponent } from './features/components/listas/lista-conductores/lista-conductores.component';
import { RegistarHistorialComponent } from './features/components/formularios/registar-historial/registar-historial.component';
import { LoginComponent } from './features/components/login/login.component';
import { AuthGuard } from './core/guards/auth.guard'
import { RegistrosComponent } from './features/components/formularios/registros/registros.component';
import { NuevoRegistroComponent } from './features/components/formularios/nuevo-registro/nuevo-registro.component';
import { RegistrarMantenimientoComponent } from './features/components/formularios/registrar-mantenimiento/registrar-mantenimiento.component';
import { RegistrarConductorComponent } from './features/components/formularios/registrar-conductor/registrar-conductor.component';
import { PruebaContenedoresEstilosComponent } from './features/components/componentes-pruebas/prueba-contenedores-estilos/prueba-contenedores-estilos.component';


const routes: Routes = [

  { path: '', redirectTo: '/lista-carros', pathMatch: 'full' },
  { path: 'carros/:id',component: ListaCarrosComponent},
  { path: 'lista-carros',component: ListaCarrosComponent},
  { path: 'lista-viajes', component: ListaViajesComponent},
  { path: 'registrar-carro', component: RegistrarCarroComponent},
  { path: 'registrar-viaje', component: RegistrarViajeComponent},
  { path: 'actualizar-vehiculo/:id', component: RegistrarCarroComponent},
  { path: 'rutas', component: ListaRutasComponent},
  { path: 'registrar-ruta', component: RegistrarRutaComponent},
  { path: 'lista-conductores', component: ListaConductoresComponent},
  { path: 'registrar-historial', component: RegistarHistorialComponent},
  { path: 'volver-historiales/:id', component: ListaCarrosComponent},
  { path: 'login', component:LoginComponent},
  { path: 'lista-mantenimiento', component:RegistrosComponent},
  { path: 'nuevo-registro/:id', component:NuevoRegistroComponent},
  { path: 'nuevo-mantenimiento/:id', component:RegistrarMantenimientoComponent},
  { path: 'registrar-historial/:tipo/:id', component: RegistarHistorialComponent},
  { path: 'registrar-conductor', component: RegistrarConductorComponent},
  { path: 'registrar-conductor/:isDesdedetalles/:id', component: RegistrarConductorComponent},
  { path: 'registrar-conductor/:id', component: RegistrarConductorComponent},
  { path: 'lista-viajes/:idConductor', component: ListaViajesComponent},
  { path: 'prueba', component: PruebaContenedoresEstilosComponent},
  

   // Ruta comodín con redirección y corrección de URL
  { path: '**', redirectTo: '/lista-carros', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
