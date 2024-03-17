 import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaCarrosComponent } from './lista-carros/lista-carros.component';
import { RegistrarCarroComponent } from './registrar-carro/registrar-carro.component';
import { ListaViajesComponent } from './lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './registrar-viaje/registrar-viaje.component';
import { BuscadorCarroComponent } from './buscador-carro/buscador-carro.component';


const routes: Routes = [

  {path: 'carros',component: ListaCarrosComponent},
  // {path: '' , redirectTo: 'carros', pathMatch: 'full'},
  {path: '' , redirectTo: 'viajes', pathMatch: 'full'},
  {path: 'viajes', component:ListaViajesComponent},
  {path: 'registrar-carro', component:RegistrarCarroComponent},
  {path: 'registrar-viaje', component:RegistrarViajeComponent},
  {path: 'buscar-carro', component:BuscadorCarroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
