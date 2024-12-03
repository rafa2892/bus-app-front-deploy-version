import { NgModule } from '@angular/core';
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


const routes: Routes = [


  { path: 'carros/:id',component: ListaCarrosComponent},
  { path: 'carros',component: ListaCarrosComponent},
  { path: 'viajes', component: ListaViajesComponent},
  { path: 'registrar-carro', component: RegistrarCarroComponent},
  { path: 'registrar-viaje', component: RegistrarViajeComponent},
  { path: 'actualizar-vehiculo/:id', component: RegistrarCarroComponent},
  { path: 'rutas', component: ListaRutasComponent},
  { path: 'crear-ruta', component: RegistrarRutaComponent},
  { path: 'conductores', component: ListaConductoresComponent},
  { path: 'registrar-historial', component: RegistarHistorialComponent},
  { path: 'volver-historiales/:id', component: ListaCarrosComponent},
  { path: 'login', component:LoginComponent},
  { path: 'lista-mantenimiento', component:RegistrosComponent},
  { path: 'nuevo-registro/:id', component:NuevoRegistroComponent},
  { path: 'nuevo-mantenimiento/:id', component:RegistrarMantenimientoComponent},
  { path: 'registrar-historial/:tipo/:id', component: RegistarHistorialComponent},
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
