import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaCarrosComponent } from './lista-carros/lista-carros.component';
import {HttpClientModule} from "@angular/common/http";
import { RegistrarCarroComponent } from './registrar-carro/registrar-carro.component';
import { FormsModule } from '@angular/forms';
import { ActualizarCarroComponent } from './actualizar-carro/actualizar-carro.component';
import { ListaViajesComponent } from './lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './registrar-viaje/registrar-viaje.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BuscadorCarroComponent } from './buscador-carro/buscador-carro.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnlyNumberDirective } from './only-number.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupSeleccionarCarroComponent } from '../app/popup-seleccionar-carro/popup-seleccionar-carro.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { PopupSeleccionarConductorComponent } from './popup-seleccionar-conductor/popup-seleccionar-conductor.component';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ListaRutasComponent } from './lista-rutas/lista-rutas.component';
import { PopupSeleccionarRutaComponent } from './popup-seleccionar-ruta/popup-seleccionar-ruta.component';
import { CardBusDetailComponent } from './card-bus-detail/card-bus-detail.component';
import {MatCardModule} from '@angular/material/card';
import { PopupImagenesZoomComponent } from './popup-imagenes-zoom/popup-imagenes-zoom.component';
import { RegistrarRutaComponent } from './registrar-ruta/registrar-ruta.component';
import { PopupGenericoComponent } from './popup-generico/popup-generico.component';
import { ListaConductoresComponent } from './lista-conductores/lista-conductores.component';
import { ListaVehiculosSelComponent } from './lista-vehiculos-sel/lista-vehiculos-sel.component';
import { DayOfWeekPipe } from './day-of-week.pipe';
import { ListaHistorialComponent } from './lista-historial/lista-historial.component';
import { PopupHistorialVehiculosComponent } from './popup-historial-vehiculos/popup-historial-vehiculos.component';
import { RegistarHistorialComponent } from './registar-historial/registar-historial.component';
import { LoginComponent } from './security/login/login.component';
import { LoginAuxComponent } from './security/login-aux/login-aux.component';




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
