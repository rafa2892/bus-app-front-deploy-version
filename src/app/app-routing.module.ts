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


const routes: Routes = [

  {path: 'carros',component: ListaCarrosComponent},
  // {path: '' , redirectTo: 'carros', pathMatch: 'full'},
  {path: '' , redirectTo: 'viajes', pathMatch: 'full'},
  
  {path: 'viajes', component:ListaViajesComponent},
  {path: 'registrar-carro', component:RegistrarCarroComponent},
  {path: 'registrar-viaje', component:RegistrarViajeComponent},
  {path: 'buscar-carro', component:BuscadorCarroComponent},
  {path: 'card-bus-details', component:CardBusDetailComponent},
  {path: 'actualizar-vehiculo/:id', component:RegistrarCarroComponent},
  {path: 'rutas', component:ListaRutasComponent},
  {path: 'crear-ruta', component:RegistrarRutaComponent},
  {path: 'conductores', component:ListaConductoresComponent},
  {path: 'registrar-historial', component:RegistarHistorialComponent},
  {path: 'volver-historiales/:id', component:ListaCarrosComponent},
  {path: 'login', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
