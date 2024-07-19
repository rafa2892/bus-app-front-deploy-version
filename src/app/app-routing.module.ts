 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCarrosComponent } from './lista-carros/lista-carros.component';
import { RegistrarCarroComponent } from './registrar-carro/registrar-carro.component';
import { ListaViajesComponent } from './lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './registrar-viaje/registrar-viaje.component';
import { BuscadorCarroComponent } from './buscador-carro/buscador-carro.component';
import { CardBusDetailComponent } from './card-bus-detail/card-bus-detail.component';
import { ListaRutasComponent } from './lista-rutas/lista-rutas.component';
import { RegistrarRutaComponent } from './registrar-ruta/registrar-ruta.component';
import { ListaConductoresComponent } from './lista-conductores/lista-conductores.component';
import { RegistarHistorialComponent } from './registar-historial/registar-historial.component';


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
  {path: 'volver-historiales/:id', component:ListaCarrosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
