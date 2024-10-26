import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaCarrosComponent } from './features/components/lista-carros/lista-carros.component';
import {HttpClientModule} from "@angular/common/http";
import { RegistrarCarroComponent } from './features/components/registrar-carro/registrar-carro.component';
import { FormsModule } from '@angular/forms';
import { ActualizarCarroComponent } from './features/components/actualizar-carro/actualizar-carro.component';
import { ListaViajesComponent } from './features/components/lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './features/components/registrar-viaje/registrar-viaje.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BuscadorCarroComponent } from './features/components/buscador-carro/buscador-carro.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnlyNumberDirective } from './features/directives/only-number.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupSeleccionarCarroComponent } from './features/components/popup-seleccionar-carro/popup-seleccionar-carro.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { PopupSeleccionarConductorComponent } from './features/components/popup-seleccionar-conductor/popup-seleccionar-conductor.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ListaRutasComponent } from './features/components/lista-rutas/lista-rutas.component';
import { PopupSeleccionarRutaComponent } from './features/components/popup-seleccionar-ruta/popup-seleccionar-ruta.component';
import { CardBusDetailComponent } from './features/components/card-bus-detail/card-bus-detail.component';
import {MatCardModule} from '@angular/material/card';
import { PopupImagenesZoomComponent } from './features/components/popup-imagenes-zoom/popup-imagenes-zoom.component';
import { RegistrarRutaComponent } from './features/components/registrar-ruta/registrar-ruta.component';
import { PopupGenericoComponent } from './features/components/popup-generico/popup-generico.component';
import { ListaConductoresComponent } from './features/components/lista-conductores/lista-conductores.component';
import { ListaVehiculosSelComponent } from './features/components/lista-vehiculos-sel/lista-vehiculos-sel.component';
import { DayOfWeekPipe } from './features/pipes/day-of-week.pipe';
import { ListaHistorialComponent } from './features/components/lista-historial/lista-historial.component';
import { PopupHistorialVehiculosComponent } from './features/components/popup-historial-vehiculos/popup-historial-vehiculos.component';
import { RegistarHistorialComponent } from './features/components/registar-historial/registar-historial.component';
import { LoginComponent } from './features/components/login/login.component';
import { LoginAuxComponent } from './features/components/login-aux/login-aux.component';




@NgModule({
  declarations: [
    AppComponent,
    ListaCarrosComponent,
    RegistrarCarroComponent,
    ActualizarCarroComponent,
    ListaViajesComponent,
    RegistrarViajeComponent,
    BuscadorCarroComponent,
    OnlyNumberDirective,
    PopupSeleccionarCarroComponent,
    PopupSeleccionarConductorComponent,
    ListaRutasComponent,
    PopupSeleccionarRutaComponent,
    CardBusDetailComponent,
    PopupImagenesZoomComponent,
    RegistrarRutaComponent,
    PopupGenericoComponent,
    ListaConductoresComponent,
    ListaVehiculosSelComponent,
    DayOfWeekPipe,
    ListaHistorialComponent,
    PopupHistorialVehiculosComponent,
    RegistarHistorialComponent,
    LoginComponent,
    LoginAuxComponent,
    
    
    
 
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    FontAwesomeModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule, 
    MatIconModule,
    MatCardModule,
    MatButtonModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
