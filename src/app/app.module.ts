import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { registerLocaleData } from '@angular/common';
import { HashLocationStrategy, LocationStrategy, CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
import { InterceptorService } from './interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'hammerjs';
import 'rxjs';
import { DialogoComponent } from './dialogo/dialogo.component';
import { VisorComponent } from './visor/visor.component';
import { SesionComponent } from './sesion/sesion.component';
import { BlankComponent } from './blank/blank.component';
import { SnackComponent } from './snack/snack.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { CatalogosComponent } from './catalogos/catalogos.component';
import { GraficasComponent } from './graficas/graficas.component';
import { ScrollingModule } from '@angular/cdk/scrolling'

import { DragDropModule } from '@angular/cdk/drag-drop';
import { DxColorBoxModule } from 'devextreme-angular';
import { DxChartModule, DxPieChartModule } from 'devextreme-angular';
import { DxCircularGaugeModule } from 'devextreme-angular'
import { DxLinearGaugeModule } from 'devextreme-angular'
import { DxBarGaugeModule } from 'devextreme-angular';
import { ExportarComponent } from './exportar/exportar.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { PanelComponent } from './panel/panel.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OpcionesComponent } from './opciones/opciones.component';
import { ProgramadorComponent } from './programador/programador.component';
import { TemasComponent } from './temas/temas.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/vacio', pathMatch: 'full', data:  { state: 'vacio' } },
  { path: 'vacio', component: BlankComponent, data:  { state: 'vacio', valor: '100' } },
  { path: 'visor', component: VisorComponent, data:  { state: 'visor', valor: '100' } },
  { path: 'catalogos', component: CatalogosComponent, data:  { state: 'catalogos', valor: '100' } },
  { path: 'graficas', component: GraficasComponent, data:  { state: 'graficas', valor: '100' } },
  { path: 'exportar', component: ExportarComponent, data:  { state: 'exportar', valor: '100' } },
  { path: 'parametros', component: ParametrosComponent, data:  { state: 'parametros', valor: '100' } },
  
];

@NgModule({
  declarations: [
    AppComponent,
    DialogoComponent,
    VisorComponent,
    SesionComponent,
    BlankComponent,
    SnackComponent,
    CatalogosComponent,
    GraficasComponent,
    ExportarComponent,
    ParametrosComponent,
    LicenciaComponent,
    PanelComponent,
    OpcionesComponent,
    ProgramadorComponent,
    TemasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    DxChartModule,
    DxColorBoxModule,
    DxCircularGaugeModule,
    DxLinearGaugeModule,
    DxBarGaugeModule,
    ScrollingModule,
    
  ],
  entryComponents: [ DialogoComponent, LicenciaComponent, SesionComponent, SnackComponent, ],
  providers: [ {provide: LOCALE_ID, useValue: "es-MX" }, 
  DatePipe, MatDatepickerModule, 
  {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  DatePipe, MatDatepickerModule, 
  {provide: LocationStrategy, useClass: HashLocationStrategy},
  {provide: MAT_SNACK_BAR_DATA, useValue: {} },
  {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
