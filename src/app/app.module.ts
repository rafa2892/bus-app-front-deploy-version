import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaCarrosComponent } from './features/components/listas/lista-carros/lista-carros.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { RegistrarCarroComponent } from './features/components/formularios/registrar-carro/registrar-carro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListaViajesComponent } from './features/components/listas/lista-viajes/lista-viajes.component';
import { RegistrarViajeComponent } from './features/components/formularios/registrar-viaje/registrar-viaje.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { MatButtonModule } from '@angular/material/button';
import { PopupSeleccionarCarroComponent } from './features/components/modales/popup-seleccionar-carro/popup-seleccionar-carro.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { PopupSeleccionarConductorComponent } from './features/components/modales/popup-seleccionar-conductor/popup-seleccionar-conductor.component';
import { MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule} from '@angular/material/form-field';
import { ListaRutasComponent } from './features/components/listas/lista-rutas/lista-rutas.component';
import { PopupSeleccionarRutaComponent } from './features/components/modales/popup-seleccionar-ruta/popup-seleccionar-ruta.component';
import { MatCardModule} from '@angular/material/card';
import { CardBusDetailComponent } from './features/components/modales/card-bus-detail/card-bus-detail.component';
import { PopupImagenesZoomComponent } from './features/components/modales/popup-imagenes-zoom/popup-imagenes-zoom.component';
import { RegistrarRutaComponent } from './features/components/formularios/registrar-ruta/registrar-ruta.component';
import { PopupGenericoComponent } from './features/components/modales/popup-generico/popup-generico.component';
import { ListaConductoresComponent } from './features/components/listas/lista-conductores/lista-conductores.component';
import { ListaVehiculosSelComponent } from './features/components/listas/lista-vehiculos-sel/lista-vehiculos-sel.component';
import { ListaHistorialComponent } from './features/components/listas/lista-historial/lista-historial.component';
import { PopupHistorialVehiculosComponent } from './features/components/modales/popup-historial-vehiculos/popup-historial-vehiculos.component';
import { RegistarHistorialComponent } from './features/components/formularios/registar-historial/registar-historial.component';
import { LoginComponent } from './features/components/login/login.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { RegistrosComponent } from './features/components/listas/registros/registros.component';
import { NuevoRegistroComponent } from './features/components/formularios/nuevo-registro/nuevo-registro.component';
import { RegistrarMantenimientoComponent } from './features/components/formularios/registrar-mantenimiento/registrar-mantenimiento.component';
import { ModalPruebaComponent } from './features/components/modales/modal-prueba/modal-prueba.component';
import { RegistrarConductorComponent } from './features/components/formularios/registrar-conductor/registrar-conductor.component';
import { OnlyLettersDirective } from './directives/only-letters.directive';
import { DatePipe } from '@angular/common';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { PruebaContenedoresEstilosComponent } from './features/components/componentes-pruebas/prueba-contenedores-estilos/prueba-contenedores-estilos.component';
import { PopupMensajeConfirmarViajeComponent } from './features/components/modales/popup-mensaje-confirmar-viaje/popup-mensaje-confirmar-viaje.component';
import { FiltrosAvanzadoViajesComponent } from './features/components/modales/filtros-avanzado-viajes/filtros-avanzado-viajes.component';
import { PopupExcelExporterOptionsViajeComponent } from './features/components/modales/popup-excel-exporter-options-viaje/popup-excel-exporter-options-viaje.component';
import { NgxPaginationModule } from 'ngx-pagination';






@NgModule({
  declarations: [
    AppComponent,
    ListaCarrosComponent,
    RegistrarCarroComponent,
    ListaViajesComponent,
    RegistrarViajeComponent,
    OnlyNumberDirective,
    PopupSeleccionarCarroComponent,
    PopupSeleccionarConductorComponent,
    ListaRutasComponent,
    PopupSeleccionarRutaComponent,
    PopupImagenesZoomComponent,
    RegistrarRutaComponent,
    PopupGenericoComponent,
    ListaConductoresComponent,
    ListaVehiculosSelComponent,
    ListaHistorialComponent,
    PopupHistorialVehiculosComponent,
    RegistarHistorialComponent,
    LoginComponent,
    RegistrosComponent,
    NuevoRegistroComponent,
    RegistrarMantenimientoComponent,
    ModalPruebaComponent,
    CardBusDetailComponent,
    RegistrarConductorComponent,
    OnlyLettersDirective,
    PruebaContenedoresEstilosComponent,
    PopupMensajeConfirmarViajeComponent,
    FiltrosAvanzadoViajesComponent,
    PopupExcelExporterOptionsViajeComponent,
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule, 
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    NgxPaginationModule

  ],
  providers: [
    DatePipe,
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE,
      useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
