import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { Router } from '@angular/router';
import { DxChartComponent } from "devextreme-angular";
import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css'],
  animations: [
    trigger('esquema', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.15s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.15s', style({ opacity: 0, transform: 'translateY(5px)' }))
      ])
    ]),
    trigger('esquema_grafica', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.15s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.15s', style({ opacity: 0, transform: 'translateY(5px)' }))
      ])
    ]),
    trigger('esquema_del', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(5px)' }),
        animate('0.25s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.25s', style({ opacity: 0, transform: 'translateY(5px)' }))
      ])
    ]),
    trigger('esquema_top', [
      transition(':enter', [
        style({ opacity: 0.3, transform: 'translateY(-15px)' }),
        animate('0.2s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0, transform: 'translateY(-15px)' }))
      ])
    ]),
    trigger('esquema_left', [
      transition(':enter', [
        style({ opacity: 0.3 }),
        animate('0.1s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.1s', style({ opacity: 0.3 }))
      ])
    ]),
    trigger('arriba', [
    transition(':enter', [
      style({ opacity: 0.3, transform: 'scale(0.3)' }),
      animate('0.1s', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
      animate('0.1s', style({ opacity: 0.3, transform: 'scale(0.3)' }))
    ])
  ]),]
})

export class GraficasComponent implements OnInit {

  @ViewChild("txtBuscar", { static: false }) txtBuscar: ElementRef;
  @ViewChild("txtNombre", { static: false }) txtNombre: ElementRef;
  @ViewChild("txtDesde", { static: false }) txtDesde: ElementRef;
  @ViewChild("txtHasta", { static: false }) txtHasta: ElementRef;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;
  @ViewChild("listaLineas", { static: false }) listaLineas: MatSelectionList;
  @ViewChild("listaMaquinas", { static: false }) listaMaquinas: MatSelectionList;
  @ViewChild("listaAreas", { static: false }) listaAreas: MatSelectionList;
  @ViewChild("listaFallas", { static: false }) listaFallas: MatSelectionList;
  @ViewChild("listaTecnicos", { static: false }) listaTecnicos: MatSelectionList;
  @ViewChild("listaPartes", { static: false }) listaPartes: MatSelectionList;
  @ViewChild("listaTurnos", { static: false }) listaTurnos: MatSelectionList;
  @ViewChild("listaLotes", { static: false }) listaLotes: MatSelectionList;
  @ViewChild("listaParos", { static: false }) listaParos: MatSelectionList;
  @ViewChild("listaClases", { static: false }) listaClases: MatSelectionList;
  @ViewChild("listaListad", { static: false }) listaListad: MatSelectionList;
  
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";  
  URL_FOLDER = "/sigma/assets/datos/";  

  constructor
  (
    private servicio: ServicioService,
    private route: ActivatedRoute,
    public scroll: ScrollDispatcher,
    private http: HttpClient,
    public dialogo: MatDialog, 
    private router: Router, 
    public datepipe: DatePipe,
    private viewportRuler: ViewportRuler,
    
  ) {
    this.calcularColor = this.calcularColor.bind(this); 
    this.calcularHora = this.calcularHora.bind(this); 
    this.calcularEscala = this.calcularEscala.bind(this); 
    
    this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      if (pantalla)
      {
        setTimeout(() => {
          this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
          this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;  
        }, 100);
      }
      else
      {
        this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
        this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;  
      }
    });

    this.servicio.cambioColor.subscribe((estatus: any)=>
    {
      if (this.router.url.substr(0, 9) == "/graficas")
      {
        
        this.colorear();

      }
      
    });
   
    this.servicio.mensajeError.subscribe((mensaje: any)=>
    {
      let mensajes = mensaje.split(";");
      if (mensajes[0] == 1)
      {
        this.pantalla = 1;
        this.servicio.mensajeInferior.emit("Por favor comuníque este error a su soporte de TI local");
        this.errorMensaje = mensajes[1];
      }
    });

     this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      
      //this.reajustarPantalla();
    });
    this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });
    this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion >= 1000 && accion <= 2000)
      {
        this.modelo = 11;
        this.graficando = true;
        this.servicio.mensajeInferior.emit("Graficas de la aplicación");
        this.filtrando = false;
        this.formateando = false;
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
        this.altoGrafica = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
        this.anchoGrafica = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;
        this.grActual = +this.servicio.rUsuario().preferencias_andon.substr(41, 1);
        if (accion==1010)
        {
          this.grActual = 1;
        }
        else if (accion==1020)
        {
          this.grActual = 2;
        }
        
        this.selTipoGrafico()
        this.iniLeerBD()
      }
    });
    this.servicio.mostrarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 9) == "/graficas")
      {
        this.verTop = accion;
        if (!this.verTop)
        {
          setTimeout(() => {
            this.altoGrafica = this.servicio.rPantalla().alto - 156 ;  
          }, 200);
          
        }
        else
        {
          this.altoGrafica = this.servicio.rPantalla().alto - 250;
        }
        
        this.servicio.guardarVista(41, this.verTop ? 1: 0 );
      }
    });
    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    let accion = this.servicio.rVista();
    if (accion==1010)
    {
      this.grActual = 1;
    }
    else if (accion==1020)
    {
      this.grActual = 2;
    }
    this.rConfiguracion();
    this.selTipoGrafico();
  }

  ngOnInit() {
    this.servicio.validarLicencia(1)
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
    this.servicio.mensajeInferior.emit("Graficas de la aplicación");
  }

  variable: string = "mttr";
  variable_literal: string = "MTTR en Horas";
  variable_2: string = "mttrc";
  
  variable_o: string = "impacto";
  variable_literal_o: string = "Tiempo total en horas";
  variable_2_o: string = "impactoc";
  idGrafico: number = 0;

  variableftq: string = "";
  variableftq_literal: string = "";
  variableftq_2: string = "";
  
  variabledis: string = "";
  variabledis_literal: string = "";
  variabledis_2: string = "";
  
  variableoee: string = "";
  variableoee_literal: string = "";
  variableoee_2: string = "";
  
  variableefi: string = "";
  variableefi_literal: string = "";
  variableefi_2: string = "";
  
  consultaTemp: string = "0";
  consultaBuscada: boolean = false;
  
  cadSQLActual: string = "";
  nombrePareto: string = "PCT Acumulado";
  modelo: number  = 0;
  offSet: number;
  verIrArriba: boolean = false;
  yaAgrupado: boolean = false;
  filtrarC: boolean = false;
  hayFiltro: boolean = false
  eliminar: boolean = false;
  editando: boolean = false;
  graficando: boolean = true;
  texto_boton: string = "#" + this.servicio.rColores().texto_boton;
  verBuscar: boolean = true;
  verTabla: boolean = false;
  cambioVista: boolean = true;
  movil: boolean = false;
  verGrafico: boolean = false;
  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  formatoGrafico: any = {tipo: "fixedPoint", precision: 3};
  formatoGraficoTiempo: any = {tipo: "fixedPoint", precision: 3};
  nCatalogo: string = "LÍNEAS DE PRODUCCIÓN"
  verBarra: string = "";
  nGrafica: string = "";
  ultimoReporte: string = "";
  nombreFile: string = "";
  ultimoID: number = 0;
  copiandoDesde: number = 0;
  textoBuscar: string = "";
  miGrafica: any = [];
  miGraficaTotal: any = [];
  miGraficaSF: any = [];
  tecnicos: any = [];
  partes: any = [];
  turnos: any = [];
  lotes: any = [];
  paros: any = [];
  clases: any = [];
  consultas: any = [];
  maquinas: any = [];
  parGrafica: any = [];
  graficaActual: number = 1;
  agrupacion: any;
  titulosGrupos: any;
  agrupandoGrafica: number = 0;
  resumenes: any = [];
  sub_titulo: string = "";
  anguloEtiqueta: string = "0";

  coloresArreglo = [ "#F2D7D5", "#D7BDE2", "#AED6F1", "#D5F5E3 ", "#F0B27A", "#F1948A", "#FAD7A0", "#D5DBDB", "#AEB6BF", "#45B39D", "#884EA0", "#D4AC0D", "#3498DB", "#ABB2B9", "#E74C3C", "#D4E6F1", "#FEF5E7", "#A9DFBF", "#C39BD3", "#FFAB91", "#99A3A4", "#ABEBC6", "#A569BD"]

  ///


  verTop: boolean = this.servicio.rUsuario().preferencias_andon.substr(40, 1) == "1";
  
  ultimaActualizacion = new Date();
  altoGrafica: number = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
  anchoGrafica: number = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;
  errorTitulo: string = "Ocurrió un error durante la conexión al servidor";
  errorMensaje: string = "";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  iconoGeneral: string = "";
  icono_grafica: string = "";
  iconoVista: string = "";
  literalVista: string = "Ver detalle";
  tituloBuscar: string = "";
  alarmados: number = 0;
  elTiempo: number = 0;
  despuesBusqueda: number = 0;
  enCadaSegundo: boolean = false;
  botElim: boolean = false;
  botGuar: boolean = false;
  botCan: boolean = false;
  contarTiempo: boolean = false;
  visualizarImagen: boolean = false;
  sondeo: number = 0;
  registros: any = [];
  opciones: any = [];
  arrFiltrado: any = [];
  detalle: any = [];
  titulos: any = [];
  ayudas: any = [];
  cronometro: any;
  leeBD: any;
  nombreReporte: string = "mttr_por_linea";
  tituloReporte: string = "MTTR por linea";
  laSeleccion: any = [];
  configuracion: any = [];
  fallas: any = [];
  lineas: any = [];
  areas: any = [];
  agrupadores1: any = [];
  agrupadores2: any = [];
  arreImagenes: any = [];
  arreHover: any = [];
  notas: string = "";
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  noLeer: boolean = false;
  operacioSel: boolean = false;
  maquinaSel: boolean = false;
  reparandoSel: boolean = false;
  abiertoSel: boolean = false;
  lineaSel: boolean = false;
  filtrando: boolean = false;
  formateando: boolean = false;
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajePadre: string = "";
  filtroReportes: string = "";
  filtroParos: string = "";
  filtroMTBF: string = "";
  filtroMTBF_are: string = "";
  filtroMTBF_fal: string = "";
  filtroMTBF_tec: string = "";
  filtroOEE: string = "";
  filtroOEEDias: string = "";
  filtroCorte: string = "";
  fDesde: string = "";
  fHasta: string = "";
  URL_BASE = "/sigma/api/upload.php"
  URL_IMAGENES = "/assets/imagenes/";
  mostrarDetalle: boolean = false;
  grActual: number = 1; //+this.servicio.rUsuario().preferencias_andon.substr(41, 1);

  ayuda01 = "Elimina la consulta seleccionada"
  ayuda02 = "Avanzar a la gráfica anterior"
  ayuda03 = "Avanzar a la gráfica siguiente"
  ayuda04 = "Mostrar menú de gráficas"
  ayuda20 = ""
  

  botonera1: number = 1;
  boton01: boolean = true;
  boton02: boolean = true;
  boton03: boolean = true;
  boton04: boolean = true;

  bot1: boolean = true;
  bot2: boolean = true;
  bot3: boolean = true;
  bot4: boolean = true;
  bot5: boolean = true;
  bot6: boolean = true;
  bot7: boolean = true;

  guardarSel: boolean = true;
  bot1Sel: boolean = false;
  bot2Sel: boolean = false;
  bot3Sel: boolean = false;
  bot4Sel: boolean = false;
  bot5Sel: boolean = false;
  bot6Sel: boolean = false;
  bot7Sel: boolean = false;
  bot8Sel: boolean = false;

  maxmin: {startValue: number, endValue: number};
  maxmin_o: {startValue: number, endValue: number};

  boton11: boolean = true;
  boton12: boolean = true;
  boton13: boolean = false;

  animando: boolean = true;
  listoMostrar: boolean = true;

  literalSingular: string = "";
  literalSingularArticulo: string = "";
  literalPlural: string = "";

  ayuda11: string = "Cambiar a vista"

    irArriba() 
  {
    this.verIrArriba = false;
    document.querySelector('[cdkScrollable]').scrollTop = 0;    
  }

  miScroll(data: CdkScrollable) 
  {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
      if (scrollTop < 5) 
      {
        this.verIrArriba = false
      }
      else 
      {
        this.verIrArriba = true
        clearTimeout(this.cronometro);
        this.cronometro = setTimeout(() => {
          this.verIrArriba = false;
        }, 3000);
      }

    this.offSet = scrollTop;
  }


  salidaEfecto(evento: any)
  {
    if (evento.toState)
    {
      this.modelo = this.modelo > 10 ? (this.modelo - 10) : this.modelo;
    }
  }

  
  exportar()
  {
    let resp = [];
    if (this.miGrafica.length > 0)
    {
      if (this.grActual == 1)
      {
        let i = 0;
        if (this.graficaActual == 1)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Nombre del transporte", id: "ID del transporte", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_transporte"
          this.nombreReporte = "pareto_por_transporte";
          this.tituloReporte = "Pareto por transporte";
        }
        else if (this.graficaActual == 2)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Placas del vehículo", id: "ID de la placa", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_vehiculo"
          this.nombreReporte = "pareto_por_vehiculo";
          this.tituloReporte = "Pareto por vehiculo";
        }
        else if (this.graficaActual == 3)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Nombre del chofer", id: "ID del chofer", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_chofer"
          this.nombreReporte = "pareto_por_chofer";
          this.tituloReporte = "Pareto por chofer";
        }
        else if (this.graficaActual == 4)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Tipo de vehiculo", id: "ID del tipo", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_tipo_vehiculo"
          this.nombreReporte = "pareto_por_tipo_vehiculo";
          this.tituloReporte = "Pareto por tipo de vehiculo";
        }
        else if (this.graficaActual == 5)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Tipo de carga", id: "ID de la carga", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_tipo_carga"
          this.nombreReporte = "pareto_por_tipo_carga";
          this.tituloReporte = "Pareto por tipo de carga";
        }
        else if (this.graficaActual == 6)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Area", id: "ID del area", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_area"
          this.nombreReporte = "pareto_por_area";
          this.tituloReporte = "Pareto por area";
        }
        else if (this.graficaActual == 7)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Fecha", id: "", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_dia"
          this.nombreReporte = "pareto_por_dia";
          this.tituloReporte = "Pareto por dia";
        }
        else if (this.graficaActual == 8)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Semana", id: "", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_semana"
          this.nombreReporte = "pareto_por_semana";
          this.tituloReporte = "Pareto por semana";
        }
        else if (this.graficaActual == 9)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Mes", id: "", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_mes"
          this.nombreReporte = "pareto_por_mes";
          this.tituloReporte = "Pareto por mes";
        }
        else if (this.graficaActual == 10)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Destino", id: "ID del destino", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_destino"
          this.nombreReporte = "pareto_por_destino";
          this.tituloReporte = "Pareto por destino";
        }
        else if (this.graficaActual == 11)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Hora (24h)", id: "", docs: "Total tactos", tiempo: "Tiempo de traslado (Hr)", des_tiempo: "Tiempo de descarga (Hr)", total_tiempo: "Tiempo total (Hr)", porcentaje: "Porcentaje" });
          this.nombreFile = "pareto_por_hora"
          this.nombreReporte = "pareto_por_hora";
          this.tituloReporte = "Pareto por hora";
        }
      }
      else if (this.grActual == 2)
      {
        let i = 0;
        let des1 = "Tiempo total de traslado (Seg)";
        let des2 = "Tiempo total de descarga (Seg)";
        let des3 = "Tiempo total de viaje (Seg)";
        let des4 = "Tiempo total estimado (Seg)";
        let des5 = "Tiempo de exceso (Seg)";
        if (this.parGrafica.mostrar_tabla == "1")
        {
          des1 = "Tiempo promedio de traslado (Seg)"     
          des2 = "Tiempo promedio de descarga (Seg)" 
          des3 = "Tiempo promedio de viaje (Seg)"
          des4 = "Tiempo promedio estimado (Seg)"
          des5 = "Tiempo promedio de exceso (Seg)";
        }
        if (this.graficaActual == 1)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Nombre del transporte", id: "ID del transporte", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "Eficiencia por transporte"
          this.nombreReporte = "eficiencia_por_transporte";
          this.tituloReporte = "Eficiencia por transporte";
        }
        else if (this.graficaActual == 2)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Tipo de vehículo", id: "ID del tipo de vehículo", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "Eficiencia por tipo de vehiculo"
          this.nombreReporte = "eficiencia_por_tipo_vehiculo";
          this.tituloReporte = "Eficiencia por tipo de vehiculo";
        }
        else if (this.graficaActual == 3)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Tipo de carga", id: "ID del tipo de carga", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "Eficiencia por tipo de carga"
          this.nombreReporte = "eficiencia_por_tipo_carga";
          this.tituloReporte = "Eficiencia por tipo de carga";
        }
        else if (this.graficaActual == 4)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Nombre del destino", id: "ID del destino", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3  });
          this.nombreFile = "Eficiencia por destino"
          this.nombreReporte = "eficiencia_por_destino";
          this.tituloReporte = "Eficiencia por destino";
        }
        else if (this.graficaActual == 5)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Area asignada al beeper", id: "ID del area", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "Eficiencia por area del beeper"
          this.nombreReporte = "eficiencia_por_area";
          this.tituloReporte = "Eficiencia por area";
        }
        else if (this.graficaActual == 6)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Fecha", id: "", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "eficiencia_por_dia"
          this.nombreReporte = "eficiencia_por_dia";
          this.tituloReporte = "Eficiencia por dia";
        }
        else if (this.graficaActual == 7)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Semana", id: "", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "Eficiencia_por_semana"
          this.nombreReporte = "eficiencia_por_semana";
          this.tituloReporte = "Eficiencia por semana";
        }
        else if (this.graficaActual == 8)
        {
          resp = this.miGraficaTotal.slice(); 
          resp.splice(i, 0, {nombre: "Mes", id: "", docs: "Total tactos", ttiempo: des4, tiempo: des1, des_tiempo: des2, porcentaje: "Eficiencia (%)", exceso: des5, total_tiempo: des3 });
          this.nombreFile = "Eficiencia_por_mes"
          this.nombreReporte = "eficiencia_por_mes";
          this.tituloReporte = "Eficiencia por mes";
        }
      }
    }
    this. servicio.generarReporte(resp, this.tituloReporte, this.nombreReporte + ".csv")
  }

  mostrar(modo: number)
  {
    if (modo == 1 && this.registros.length == 0)
    {
      this.listoMostrar = true;
    }
    else if (this.registros.length > 0)
    {
      this.listoMostrar = false;
    }
  }
  
  rConfiguracion()
  {
    this.configuracion = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.configuracion = resp[0]; 
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  
  leerBD()
  {
    
    if (this.noLeer || this.router.url.substr(0, 9) != "/graficas")
    {
      return;
    }
    let campos = {accion: 100, sentencia: this.cadSQLActual};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.arrFiltrado = resp;
      let arreTemp: any = this.arrFiltrado;
      let actualizar: boolean = false; 
      actualizar = JSON.stringify(this.registros) != JSON.stringify(arreTemp);
      if (actualizar)
      {
        if (resp.length == 0)
        {
          this.registros = [];
        }
        if (this.arrFiltrado.length == 0 && resp.length > 0)
        {
          this.registros = arreTemp;
        }
        else 
        {
          for (i = this.registros.length - 1; i >= 0; i--)
          {
            let hallado = false;
            for (var j = arreTemp.length - 1; j >= 0 ; j--)
            {
              if (this.registros[i].id ==  arreTemp[j].id)
              {
                if (this.registros[i].estatus !=  arreTemp[j].estatus || this.registros[i].nombre !=  arreTemp[j].nombre )
                {
                  this.registros[i].estatus = arreTemp[j].estatus;
                  this.registros[i].nombre = arreTemp[j].nombre;
                }
                if (this.miSeleccion == 2)
                {
                  if (this.registros[i].nlinea !=  arreTemp[j].nlinea)
                  {
                    this.registros[i].nlinea = arreTemp[j].nlinea;
                  }
                }
                hallado = true;
                break;
              }
            }
            if (!hallado)
            {
              this.registros.splice(i, 1);
            }
          }
          for (var i = 0; i < arreTemp.length; i++)
          {
            let agregar = true;
            for (var j = 0; j < this.registros.length; j++)
            {
              if (this.registros[j].id == arreTemp[i].id)
              {
                agregar = false
                break;              
              }
            }
            if (agregar)
            {
              this.registros.splice(i, 0, arreTemp[i])
              this.sondeo = arreTemp[i].id;
            }
          }
        }
      }
    });
    clearTimeout(this.leeBD);
    if (this.router.url.substr(0, 9) == "/graficas")
    {
      this.leeBD = setTimeout(() => {
        this.leerBD()
      },  +this.elTiempo);
    }
  }

  selectionChange(event){
    console.log('selection changed using keyboard arrow');
  }

  iniLeerBD()
  {
    if (!this.servicio.rConfig().visor_revisar_cada)
    {
      this.elTiempo = 5000;
    }
    else
    {
      this.elTiempo = +this.servicio.rConfig().visor_revisar_cada * 1000;
    }
    setTimeout(() => {
      this.leerBD();
    }, +this.elTiempo);
  }

  //Desde aqui
  selTipoGrafico()
  {
    this.servicio.guardarVista(42, this.grActual);
    let sentencia = "SELECT IFNULL(b.id, a.id) AS id, IFNULL(b.titulo, a.titulo) AS nombre, a.grafico - 100 AS nro, IFNULL(b.visualizar, a.visualizar) AS visualizar FROM " + this.servicio.rBD() + ".pu_graficos a LEFT JOIN " + this.servicio.rBD() + ".pu_graficos b ON a.grafico = b.grafico AND b.usuario = " + this.servicio.rUsuario().id + " WHERE a.grafico < 200 AND a.usuario = 0 AND a.activo = 'S' ORDER BY a.grafico;";
    if (this.grActual == 1)
    {
      this.icono_grafica = "i_pareto";
      this.opciones = [];
    }
    else if (this.grActual == 2)
    {
      sentencia = "SELECT IFNULL(b.id, a.id) AS id, IFNULL(b.titulo, a.titulo) AS nombre, a.grafico - 100 AS nro, IFNULL(b.visualizar, a.visualizar) AS visualizar FROM " + this.servicio.rBD() + ".pu_graficos a LEFT JOIN " + this.servicio.rBD() + ".pu_graficos b ON a.grafico = b.grafico AND b.usuario = " + this.servicio.rUsuario().id + " WHERE a.grafico > 200 AND a.grafico < 300 AND a.usuario = 0 AND a.activo = 'S' ORDER BY a.grafico;";
    
      this.icono_grafica = "i_tiempofallas";
      this.opciones = [];
    }
    //Se busca la consulta

    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.opciones = resp;
      this.aplicarConsulta(-1)
    });
    
  }

  preGraficar(id: number)
  {
    this.servicio.activarSpinner.emit(true);
    this.modelo = 11;
    this.miGrafica = [];
    this.parGrafica = [];
    let grafica = 0;
    if (id == -10)
    {
      for (var i = this.graficaActual - 2; i >= 0; i--)
      {
        if (this.opciones[i].visualizar=="S")
        {
          grafica = this.opciones[i].id;
          this.graficaActual = i + 1;
          break;
        }
      }
      if (grafica == 0)
      {
        for (i = this.opciones.length - 1; i >= 0; i--)
        {
          if (this.opciones[i].visualizar=="S")
          {
            grafica = this.opciones[i].id;
            this.graficaActual = i + 1;
            break;
          }
        } 
      }
    }
    else if (id == -5 || id == 0)
    {
      for (i = (id == 0 ? 0 : this.graficaActual); i < this.opciones.length; i++)
      {
        if (this.opciones[i].visualizar=="S")
        {
          grafica = this.opciones[i].id;
          this.graficaActual = i + 1;
          break;
        }
      }
      if (grafica == 0)
      {
        for (i = 0; i < this.opciones.length; i++)
        {
          if (this.opciones[i].visualizar=="S")
          {
            grafica = this.opciones[i].id;
            this.graficaActual = i + 1;
            break;
          }
        } 
      }
    }
    else 
    {
      if (id > this.opciones.length)
      {
        id = 0;
      }
      grafica = this.opciones[id].id
      this.graficaActual = id + 1;
    }
    this.yaAgrupado = false;
    this.graficar(grafica);  
      
  }

  colorear()
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE id = " + this.idGrafico +  ";";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {

      resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : resp[0].tipo_principal == "A" ? "area" : resp[0].tipo_principal == "S" ? "stackedBar" : "fullStackedBar"; 
      if (resp[0].tipo_valor == "stackedBar" || resp[0].tipo_valor == "fullStackedBar")
      {
        this.anguloEtiqueta = "270";
      }
        

      resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : resp[0].oee_tipo[0] == "A" ? "area" : resp[0].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : resp[0].oee_tipo[1] == "A" ? "area" : resp[1].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : resp[0].oee_tipo[2] == "A" ? "area" : resp[2].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
      
      let oee_colores = resp[0].oee_colores.split(";");
      resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";  


      resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
      resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
      resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

      resp[0].oee_selFTQ = resp[0].oee[0] == "S";
      resp[0].oee_selEFI = resp[0].oee[1] == "S";
      resp[0].oee_selDIS = resp[0].oee[2] == "S";

      
      resp[0].oee_etiFTQ = resp[0].oee[3];
      resp[0].oee_etiEFI = resp[0].oee[4];
      resp[0].oee_etiDIS = resp[0].oee[5];



      resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
      oee_colores = resp[0].oee_nombre.split(";");
      resp[0].oee_nombreFTQ = oee_colores[0];
      resp[0].oee_nombreEFI = oee_colores[1];
      resp[0].oee_nombreDIS = oee_colores[2];

      resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
      oee_colores = resp[0].esperado_esquema.split(";");
      resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
      resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
      resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
      oee_colores = resp[0].adicionales_colores.split(";");
      resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
      resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
      resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
      resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : "";    
      
      if (!resp[0].sub_titulo || resp[0].sub_titulo == "")
      {
        resp[0].sub_titulo = this.sub_titulo;
      }

      this.parGrafica = resp[0];
      this.parGrafica.overlap = (this.parGrafica.overlap == "R" ? "rotate" : "stagger");
      this.parGrafica.color_barra = (!this.parGrafica.color_barra ? "" : "#" + this.parGrafica.color_barra);
      this.parGrafica.etiqueta_color = (!this.parGrafica.etiqueta_color ? "" : "#" + this.parGrafica.etiqueta_color);
      this.parGrafica.etiqueta_fondo = (!this.parGrafica.etiqueta_fondo ? "" : "#" + this.parGrafica.etiqueta_fondo);
      this.parGrafica.color_fondo = (!this.parGrafica.color_fondo ? "" : "#" + this.parGrafica.color_fondo);
      this.parGrafica.color_fondo_barras = (!this.parGrafica.color_fondo_barras ? "" : "#" + this.parGrafica.color_fondo_barras);
      this.parGrafica.color_letras = (!this.parGrafica.color_letras ? "" : "#" + this.parGrafica.color_letras);
      this.parGrafica.color_leyenda = (!this.parGrafica.color_leyenda ? "" : "#" + this.parGrafica.color_leyenda);
      this.parGrafica.color_leyenda_fondo = (!this.parGrafica.color_leyenda_fondo ? "" : "#" + this.parGrafica.color_leyenda_fondo);
      this.parGrafica.color_spiline = (!this.parGrafica.color_spiline ? "" : "#" + this.parGrafica.color_spiline);
      this.parGrafica.grueso_spiline = (!this.parGrafica.grueso_spiline ? "0" : this.parGrafica.grueso_spiline);
      this.parGrafica.mostrar_tabla = (!this.parGrafica.mostrar_tabla ? "0" : this.parGrafica.mostrar_tabla);

    

    if (this.parGrafica.color_barra.length == 0)
    {
      this.parGrafica.color_barra = "#" + this.servicio.rColores().texto_boton; 
      this.parGrafica.color_barra_borde = "#" + this.servicio.rColores().borde_boton; 
    }

    if (this.parGrafica.color_spiline.length == 0)
    {
      this.parGrafica.color_spiline = "#" + this.servicio.rColores().texto_boton; 
    }

    if (this.parGrafica.etiqueta_color.length == 0)
    {
      this.parGrafica.etiqueta_color = "#" + this.servicio.rColores().texto_boton; 
      this.parGrafica.etiqueta_fondo = "#" + this.servicio.rColores().fondo_boton; 
    }
    if (this.parGrafica.color_fondo.length == 0)
    {
      this.parGrafica.color_fondo = "#" + this.servicio.rColores().fondo_tarjeta; 
    }
    if (this.parGrafica.color_fondo_barras.length == 0)
    {
      this.parGrafica.color_fondo_barras = "transparent";
    }

    if (this.parGrafica.color_letras.length == 0)
    {
      this.parGrafica.color_letras = "#" + this.servicio.rColores().texto_tarjeta; 
    }
    if (this.parGrafica.color_leyenda.length == 0)
    {
      this.parGrafica.color_leyenda = "#" + this.servicio.rColores().texto_boton;
    }
    if (this.parGrafica.color_leyenda_fondo.length == 0)
    {
      this.parGrafica.color_leyenda_fondo = "#" + this.servicio.rColores().fondo_boton;;
    }
  })
  }

  
  graficar(id: number)
  {
    
    this.servicio.activarSpinnerSmall.emit(true);
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE id = " + id +  ";";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {


      resp[0].adicionales = resp[0].adicionales ? resp[0].adicionales : "0;0;0;0;0;0;0";
      resp[0].adicionales = resp[0].adicionales == "NNNNNN" ? "0;0;0;0;0;0;0" : resp[0].adicionales;
      let oee_colores = resp[0].adicionales.split(";");
      resp[0].adic1 = oee_colores[0] ? oee_colores[0] : "0";
      resp[0].adic2 = oee_colores[1] ? oee_colores[1] : "0";
      resp[0].adic3 = oee_colores[2] ? oee_colores[2] : "0";
      resp[0].adic4 = oee_colores[3] ? oee_colores[3] : "0";
      resp[0].adic5 = oee_colores[4] ? oee_colores[4] : "0";
      resp[0].adic6 = oee_colores[5] ? oee_colores[5] : "0";
      resp[0].adic7 = oee_colores[6] ? oee_colores[6] : "0";


      resp[0].adicionales_titulos = resp[0].adicionales_titulos ? resp[0].adicionales_titulos : ";;;;;";
      let titulos = resp[0].adicionales_titulos.split(";");
      resp[0].tadic1 = titulos[0] ? titulos[0] : "";
      resp[0].tadic2 = titulos[1] ? titulos[1] : "";
      resp[0].tadic3 = titulos[2] ? titulos[2] : "";
      resp[0].tadic4 = titulos[3] ? titulos[3] : "";
      resp[0].tadic5 = titulos[4] ? titulos[4] : "";
      resp[0].tadic6 = titulos[5] ? titulos[5] : "";

      
      
      resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
      resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
      resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

      resp[0].oee_selFTQ = resp[0].oee[0] == "S";
      resp[0].oee_selEFI = resp[0].oee[1] == "S";
      resp[0].oee_selDIS = resp[0].oee[2] == "S";
      
      resp[0].oee_etiFTQ = resp[0].oee[3];
      resp[0].oee_etiEFI = resp[0].oee[4];
      resp[0].oee_etiDIS = resp[0].oee[5];

      resp[0].oee_etiFTQ = resp[0].oee_etiFTQ != "S" && resp[0].oee_etiFTQ != "N" ? "N" : resp[0].oee_etiFTQ;
      resp[0].oee_etiEFI = resp[0].oee_etiEFI != "S" && resp[0].oee_etiEFI != "N" ? "N" : resp[0].oee_etiEFI;
      resp[0].oee_etiDIS = resp[0].oee_etiDIS != "S" && resp[0].oee_etiDIS != "N" ? "N" : resp[0].oee_etiDIS;

      resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : resp[0].tipo_principal == "A" ? "area" : resp[0].tipo_principal == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : resp[0].oee_tipo[0] == "A" ? "area" : resp[0].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : resp[0].oee_tipo[1] == "A" ? "area" : resp[1].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : resp[0].oee_tipo[2] == "A" ? "area" : resp[2].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
      resp[0].colorFTQ = "";
      resp[0].colorEFI = "";
      resp[0].colorDIS = "";
      resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
      
      oee_colores = resp[0].oee_colores.split(";");
      resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";

      resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
      oee_colores = resp[0].oee_nombre.split(";");
      resp[0].oee_nombreFTQ = oee_colores[0];
      resp[0].oee_nombreEFI = oee_colores[1];
      resp[0].oee_nombreDIS = oee_colores[2];

      resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
      oee_colores = resp[0].esperado_esquema.split(";");
      resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
      resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
      resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
      oee_colores = resp[0].adicionales_colores.split(";");
      resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
      resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
      resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
      resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
      resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
      resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : ""; 
      
      if (!resp[0].sub_titulo || resp[0].sub_titulo == "")
      {
        resp[0].sub_titulo = this.sub_titulo;
      }

      this.parGrafica = resp[0];
      this.parGrafica.overlap = (this.parGrafica.overlap == "R" ? "rotate" : "stagger");
      this.parGrafica.color_barra = (!this.parGrafica.color_barra ? "" : "#" + this.parGrafica.color_barra);
      this.parGrafica.color_esperado = (!this.parGrafica.color_esperado ? "" : "#" + this.parGrafica.color_esperado);
      this.parGrafica.etiqueta_color = (!this.parGrafica.etiqueta_color ? "" : "#" + this.parGrafica.etiqueta_color);
      this.parGrafica.etiqueta_fondo = (!this.parGrafica.etiqueta_fondo ? "" : "#" + this.parGrafica.etiqueta_fondo);
      this.parGrafica.color_fondo = (!this.parGrafica.color_fondo ? "" : "#" + this.parGrafica.color_fondo);
      this.parGrafica.color_fondo_barras = (!this.parGrafica.color_fondo_barras ? "" : "#" + this.parGrafica.color_fondo_barras);
      this.parGrafica.color_letras = (!this.parGrafica.color_letras ? "" : "#" + this.parGrafica.color_letras);
      this.parGrafica.color_leyenda = (!this.parGrafica.color_leyenda ? "" : "#" + this.parGrafica.color_leyenda);
      this.parGrafica.color_leyenda_fondo = (!this.parGrafica.color_leyenda_fondo ? "" : "#" + this.parGrafica.color_leyenda_fondo);
      this.parGrafica.color_spiline = (!this.parGrafica.color_spiline ? "" : "#" + this.parGrafica.color_spiline);
      this.parGrafica.titulo_spiline = (!this.parGrafica.grueso_spiline ? "0" : this.parGrafica.grueso_spiline);
      this.parGrafica.mostrar_tabla = (!this.parGrafica.mostrar_tabla ? "0" : this.parGrafica.mostrar_tabla);
      
      if (this.parGrafica.color_barra.length == 0)
      {
        this.parGrafica.color_barra = "#" + this.servicio.rColores().texto_boton; 
        this.parGrafica.color_barra_borde = "#" + this.servicio.rColores().borde_boton; 
      }

      if (this.parGrafica.color_spiline.length == 0)
      {
        this.parGrafica.color_spiline = "#" + this.servicio.rColores().texto_boton; 
      }

      if (this.parGrafica.color_esperado.length == 0)
      {
        this.parGrafica.color_esperado = "#" + this.servicio.rColores().texto_boton; 
      }

      if (this.parGrafica.etiqueta_color.length == 0)
      {
        this.parGrafica.etiqueta_color = "#" + this.servicio.rColores().texto_boton; 
        this.parGrafica.etiqueta_fondo = "#" + this.servicio.rColores().fondo_boton; 
      }
      if (this.parGrafica.color_fondo.length == 0)
      {
        this.parGrafica.color_fondo = "#" + this.servicio.rColores().fondo_tarjeta; 
      }
      if (this.parGrafica.color_fondo_barras.length == 0)
      {
        this.parGrafica.color_fondo_barras = "transparent";
      }

      if (this.parGrafica.color_letras.length == 0)
      {
        this.parGrafica.color_letras = "#" + this.servicio.rColores().texto_tarjeta; 
      }
      if (this.parGrafica.color_leyenda.length == 0)
      {
        this.parGrafica.color_leyenda = "#" + this.servicio.rColores().texto_boton;
      }
      if (this.parGrafica.color_leyenda_fondo.length == 0)
      {
        this.parGrafica.color_leyenda_fondo = "#" + this.servicio.rColores().fondo_boton;;
      }

      this.idGrafico = this.parGrafica.id;
      this.parGrafica.overlap = (this.parGrafica.overlap == "R" || this.parGrafica.overlap == "rotate" ? "rotate" : "stagger");
        //MTTR
        //Buscar la consulta actual o por defecto
        let sentencia = "";
        if (this.grActual == 1)
        {
          this.nombrePareto = "PCT Acumulado";
          let tHaving = "";
          let ordenDatos = "3"; 
          if (this.parGrafica.orden==1)
          {
            ordenDatos = "4"; 
          }
          else if (this.parGrafica.orden==2)
          {
            ordenDatos = "5"; 
          }
          else  if (this.parGrafica.orden==3)
          {
            ordenDatos = "6";
          }
          
          if (this.parGrafica.orden_grafica == "M")
          {
            ordenDatos = ordenDatos + " DESC";
          }
          else if (this.parGrafica.orden_grafica == "A")
          {
            ordenDatos = " 1 ";
          }
          sentencia = "SELECT d.nombre, c.transporte, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_transportes d ON c.transporte = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.transporte, d.nombre " + tHaving + " ORDER BY " + ordenDatos

          if (this.graficaActual == 2)
          {
            sentencia = "SELECT d.nombre, c.vehiculo, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos d ON c.vehiculo = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.vehiculo, d.nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 3)
          {
            sentencia = "SELECT d.nombre, c.chofer, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_choferes d ON c.chofer = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.chofer, d.nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 4)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, b.tipo, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.tipo = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY b.tipo, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 5)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, c.carga, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_generales d ON c.carga = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.carga, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 6)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, c.area, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_generales d ON c.area = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.area, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 7)
          {
            sentencia = "SELECT DATE_FORMAT(c.inicio,'%x/%m/%d') AS nombre, 0 AS dia, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY DATE_FORMAT(c.inicio,'%x/%m/%d'), dia " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 8)
          {
            sentencia = "SELECT DATE_FORMAT(c.inicio,'%x/%v') AS nombre, 0 AS dia, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY DATE_FORMAT(c.inicio,'%x/%v'), dia " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 9)
          {
            sentencia = "SELECT DATE_FORMAT(c.inicio,'%x/%m') AS nombre, 0 AS dia, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY DATE_FORMAT(c.inicio,'%x/%m'), dia " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 10)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, c.destino, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_destinos d ON c.destino = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.destino, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 11)
          {
            sentencia = "SELECT HOUR(c.des_inicio) AS nombre, 0 AS dia, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE NOT ISNULL(c.des_inicio) AND c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY HOUR(c.des_inicio), dia " + tHaving + " ORDER BY " + ordenDatos
            if (this.parGrafica.oee_nombreFTQ == "S")
            {
              if (this.parGrafica.orden==1)
              {
                ordenDatos = "4"; 
              }
              else if (this.parGrafica.orden==2)
              {
                ordenDatos = "5"; 
              }
              else  if (this.parGrafica.orden==3)
              {
                ordenDatos = "6";
              }
          
              if (this.parGrafica.orden_grafica == "M")
              {
                ordenDatos = ordenDatos + " DESC";
              }
              else if (this.parGrafica.orden_grafica == "A")
              {
                ordenDatos = " 1 ";
              }

              sentencia = "SELECT HOUR(c.des_inicio) AS nombre, 0 AS dia, d.nombre AS destino, d.id, COUNT(*) AS docs, SUM(c.tiempo) / 3600 AS tiempo, SUM(c.des_tiempo) / 3600 AS des_tiempo, SUM(c.tiempo + c.des_tiempo) / 3600 AS total_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON c.destino = d.id WHERE NOT ISNULL(c.des_inicio) AND c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY HOUR(c.des_inicio), dia, d.nombre, d.id " + tHaving + " ORDER BY " + ordenDatos;
              this.parGrafica.tipo_valor=="stackedBar"
            }
            
          }
        }
        else if (this.grActual == 2)
        {
          this.nombrePareto = "PCT Eficiencia";
          let tHaving = "";
          let ordenDatos = "7"; 
          if (this.parGrafica.orden_grafica == "M")
          {
            ordenDatos = ordenDatos + " DESC";
          }
          else if (this.parGrafica.orden_grafica == "A")
          {
            ordenDatos = " 1 ";
          }

          sentencia = "SELECT d.nombre, c.transporte, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_transportes d ON c.transporte = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.transporte, d.nombre " + tHaving + " ORDER BY " + ordenDatos

          if (this.graficaActual == 2)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, b.tipo, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.tipo = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY b.tipo, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 3)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, c.carga, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.carga = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.carga, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 4)
          {
            sentencia = "SELECT d.nombre, c.destino, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id INNER JOIN " + this.servicio.rBD() + ".cat_destinos d ON c.destino = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.destino, d.nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 5)
          {
            sentencia = "SELECT IFNULL(d.nombre, 'N/A') AS nombre, c.area, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.area = d.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY c.area, nombre " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 6)
          {
            sentencia = "SELECT DATE_FORMAT(c.inicio,'%x/%m/%d') AS nombre, 0 AS dia, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY DATE_FORMAT(c.inicio,'%x/%m/%d'), dia " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 7)
          {
            sentencia = "SELECT DATE_FORMAT(c.inicio,'%x/%v') AS nombre, 0 AS dia, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY DATE_FORMAT(c.inicio,'%x/%v'), dia " + tHaving + " ORDER BY " + ordenDatos
          }
          else if (this.graficaActual == 8)
          {
            sentencia = "SELECT DATE_FORMAT(c.inicio,'%x/%m') AS nombre, 0 AS dia, COUNT(*) AS docs, ROUND(SUM(c.des_estimado + c.estimado)) AS ttiempo, ROUND(SUM(c.tiempo)) AS tiempo, ROUND(SUM(c.des_tiempo)) AS des_tiempo, 0 AS porcentaje FROM " + this.servicio.rBD() + ".movimientos_det c LEFT JOIN  " + this.servicio.rBD() + ".cat_vehiculos b ON c.vehiculo = b.id WHERE c.estatus <> 9 AND c.inicio >= '" + this.fDesde + "' AND c.inicio <= '" + this.fHasta + "' " + this.filtroReportes + " GROUP BY DATE_FORMAT(c.inicio,'%x/%m'), dia " + tHaving + " ORDER BY " + ordenDatos
          }
        }

        if (this.parGrafica.mostrar_tabla == "1")
        {
          sentencia = sentencia.replace(/SUM/g, "AVG");
      
        }
        
        this.cadSQLActual = sentencia;
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          
          this.miGraficaTotal = JSON.parse(JSON.stringify(resp));
          if (this.modelo == 0)
          {
            this.modelo = 1;
          }
          if (resp.length > 0)
          {
            
           if (this.grActual == 1)
            {
              this.formatoGraficoTiempo.tipo = "fixedPoint";
              this.formatoGraficoTiempo.precision = 0;
              this.variable_o = "";
              this.variable_literal_o = "";
              this.variable_2_o = "";
              this.variable = (this.parGrafica.orden == 0 ? "docs" : this.parGrafica.orden == 1 ? "tiempo" : this.parGrafica.orden == 2 ? "des_tiempo" : "total_tiempo");
              this.variable_literal = (this.parGrafica.orden == 0 ? "Tactos" : this.parGrafica.orden == 1 ? "Tiempo de traslado" : this.parGrafica.orden == 2 ? "Tiempo de descarga" : "Tiempo total");
              this.variable_2 = (this.parGrafica.orden == 0 ? "docs" : this.parGrafica.orden == 1 ? "tiempo" : this.parGrafica.orden == 2 ? "des_tiempo" : "total_tiempo");
            }
            else if (this.grActual == 2)
            {
                this.formatoGraficoTiempo.tipo = "fixedPoint";
                this.formatoGraficoTiempo.precision = 0;
                this.variable_o = "";
              this.variable_literal_o = "";
                this.variable_2_o = "";

              this.variableefi = "efi";
              this.variableefi_literal = this.parGrafica.oee_nombreEFI.length==0 ? "Total" : this.parGrafica.oee_nombreEFI;
              this.variableefi_2 = "total_tiempo";

              this.variableftq = "ftq";
              this.variableftq_literal = this.parGrafica.oee_nombreFTQ.length==0 ? "Tránsito" : this.parGrafica.oee_nombreFTQ;
              this.variableftq_2 = "tiempo";

              this.variabledis = "dis";
              this.variabledis_literal = this.parGrafica.oee_nombreDIS.length==0 ? "Descarga" : this.parGrafica.oee_nombreDIS;
              this.variabledis_2 = "des_tiempo";

              this.variableoee = "oee";
              this.variableoee_literal = "OAE";
              this.variableoee_2 = "oee";
              if (this.parGrafica.tipo_valor=="stackedBar" || this.parGrafica.tipo_valor=="fullStackedBar")
              {
                this.parGrafica.tipo_valorFTQ = "";
                //this.parGrafica.tipo_valorEFI = "";
                this.parGrafica.tipo_valorDIS = "";
              }
              for (var i = 0; i < resp.length; i++)
              {
                resp[i].total_tiempo = +resp[i].tiempo + +resp[i].des_tiempo;
                if (+resp[i].ttiempo > 0)
                {
                  resp[i].exceso = +resp[i].tiempo + +resp[i].des_tiempo - +resp[i].ttiempo;
                  resp[i].porcentaje = Math.floor((1 - (resp[i].exceso) / (+resp[i].tiempo + +resp[i].des_tiempo)) * 100);
                }
                else
                {
                  resp[i].exceso = 0;
                  resp[i].porcentaje = 100;
                }
                this.miGraficaTotal[i].porcentaje = resp[i].porcentaje;
                this.miGraficaTotal[i].exceso = resp[i].exceso;
                this.miGraficaTotal[i].total_tiempo = resp[i].total_tiempo;
              }
            }
            //if (this.parGrafica.oee[0]=='N' && this.parGrafica.oee[1]=='N' && this.parGrafica.oee[2]=='N')
            if (this.parGrafica.oee[1]=='N' && this.parGrafica.oee[2]=='N')
            {
              this.parGrafica.oee = "SSSSSS";
            }
            //if (!this.variableefi_literal && !this.variableftq_literal && !this.variabledis_literal)
            if (!this.variableftq_literal && !this.variabledis_literal)
            {
              //this.variableefi_literal = "Espera";
              this.variableftq_literal = "Tránsito";
              this.variabledis_literal = "Descarga";
            }
            let limitar = 0;
            let agrupado;
            let total = 0;
            if (+this.parGrafica.maximo_barraspct > 0)
            {
              let pct = +this.parGrafica.maximo_barraspct / 100;
              
              if (this.grActual == 1)
              {
                if (this.parGrafica.orden == 0)
                {
                  for (var i = 0; i < resp.length; i++)
                  {
                    total = total + +resp[i].docs;
                  }
                  let pcAcum = 0;
                  for (var i = 0; i < resp.length; i++)
                  {
                    pcAcum = pcAcum + +resp[i].docs;
                    if (pcAcum / total >= pct)
                    {
                      limitar = i;
                      break;
                    }
                  }  
                }
                else if (this.parGrafica.orden == 1)
                {
                  for (var i = 0; i < resp.length; i++)
                  {
                    total = total + +resp[i].tiempo;
                  }
                  let pcAcum = 0;
                  for (var i = 0; i < resp.length; i++)
                  {
                    pcAcum = pcAcum + +resp[i].tiempo;
                    if (pcAcum / total >= pct)
                    {
                      limitar = i;
                      break;
                    }
                  }  
                }
                else if (this.parGrafica.orden == 2)
                {
                  for (var i = 0; i < resp.length; i++)
                  {
                    total = total + +resp[i].des_tiempo;
                  }
                  let pcAcum = 0;
                  for (var i = 0; i < resp.length; i++)
                  {
                    pcAcum = pcAcum + +resp[i].des_tiempo;
                    if (pcAcum / total >= pct)
                    {
                      limitar = i;
                      break;
                    }
                  }  
                }
                else 
                {
                  for (var i = 0; i < resp.length; i++)
                  {
                    total = total + +resp[i].total_tiempo;
                  }
                  let pcAcum = 0;
                  for (var i = 0; i < resp.length; i++)
                  {
                    pcAcum = pcAcum + +resp[i].total_tiempo;
                    if (pcAcum / total >= pct)
                    {
                      limitar = i;
                      break;
                    }
                  }  
                }
                
              }
              else if (this.grActual == 2)
              {
                for (var i = 0; i < resp.length; i++)
                {
                  total = total + +resp[i].total_tiempo;
                }
                let pcAcum = 0;
                for (var i = 0; i < resp.length; i++)
                {
                  pcAcum = pcAcum + +resp[i].total_tiempo;
                  if (pcAcum / total >= pct)
                  {
                    limitar = i;
                    break;
                  }
                }  
              }
            }
            if (+this.parGrafica.maximo_barras > 0)
            {
              if (limitar > +this.parGrafica.maximo_barras || limitar == 0)
              {
                limitar= +this.parGrafica.maximo_barras;
              }
            }
            if (limitar >= resp.length)
            {
              limitar = 0;
            }
            if (limitar > 0)
            {
              if (this.parGrafica.agrupar == "S")
              {
                let faltante = 0;
                let totalAgr = 0;
                if (this.grActual == 1)
                {
                  if (this.parGrafica.orden == 0)
                  {
                    for (var i = limitar; i < resp.length; i++)
                    {
                      faltante = faltante + +resp[i].docs;
                    }
                    totalAgr = resp.length - limitar;
                     agrupado = {nombre: (!this.parGrafica.agrupar_texto || this.parGrafica.agrupar_texto.length==0 ? "Agrupado" : this.parGrafica.agrupar_texto) + " (" + totalAgr + ")", tiempo: 0, porcentaje: 0, docs: faltante }
                  }
                  else if (this.parGrafica.orden == 1)
                  {
                    for (var i = limitar; i < resp.length; i++)
                    {
                      faltante = faltante + +resp[i].tiempo;
                    }
                    totalAgr = resp.length - limitar;
                    agrupado = {nombre: (!this.parGrafica.agrupar_texto || this.parGrafica.agrupar_texto.length==0 ? "Agrupado" : this.parGrafica.agrupar_texto)  + " (" + totalAgr + ")", tiempo: faltante, porcentaje: 0, docs: 0 }
                  }
                  else if (this.parGrafica.orden == 2)
                  {
                    for (var i = limitar; i < resp.length; i++)
                    {
                      faltante = faltante + +resp[i].des_tiempo;
                    }
                    totalAgr = resp.length - limitar;
                    agrupado = {nombre: (!this.parGrafica.agrupar_texto || this.parGrafica.agrupar_texto.length==0 ? "Agrupado" : this.parGrafica.agrupar_texto)  + " (" + totalAgr + ")", tiempo: faltante, porcentaje: 0, docs: 0 }
                  }
                  else 
                  {
                    for (var i = limitar; i < resp.length; i++)
                    {
                      faltante = faltante + +resp[i].total_tiempo;
                    }
                    totalAgr = resp.length - limitar;
                    agrupado = {nombre: (!this.parGrafica.agrupar_texto || this.parGrafica.agrupar_texto.length==0 ? "Agrupado" : this.parGrafica.agrupar_texto)  + " (" + totalAgr + ")", tiempo: faltante, porcentaje: 0, docs: 0 }
                  }
                  
                }
                else if (this.grActual == 2)
                {
                  let esperas = 0;
                  let descargas = 0;
                  let transitos = 0;
                  let tactos = 0;
                  let excesos = 0;
                  let porcentaje = 100;
                  for (var i = limitar; i < resp.length; i++)
                  {
                    transitos = transitos + +resp[i].tiempo;
                    descargas = descargas + +resp[i].des_tiempo;
                    faltante = faltante + +resp[i].total_tiempo;
                    excesos = excesos + +resp[i].excesos;
                    tactos = tactos + +resp[i].docs;
                  }
                  totalAgr = resp.length - limitar;
                  if (faltante > 0)
                  {
                    porcentaje = Math.floor((1 - excesos / faltante) * 100)
                  }
                  agrupado = {nombre: (!this.parGrafica.agrupar_texto || this.parGrafica.agrupar_texto.length==0 ? "Agrupado" : this.parGrafica.agrupar_texto) + " (" + totalAgr + ")", tiempo: transitos, des_tiempo: descargas, total_tiempo: faltante, excesos: excesos, docs: tactos, porcentaje: porcentaje }
                }
                
              }
              resp.splice(limitar);
              if (this.parGrafica.agrupar == "S")
              {
                if (this.parGrafica.agrupar_posicion == "P")
                {
                  resp.unshift(agrupado);
                }
                else 
                {
                  resp.push(agrupado);
                  if (this.parGrafica.agrupar_posicion == "N")
                  {
                    //Se vuelve a ordenar
                    if (this.grActual == 1)
                    {
                      if (this.parGrafica.orden_grafica)
                      {
                        if (this.parGrafica.orden_grafica == "A")
                        {
                          resp.sort(this.compararParetoa)
                          
                        }
                        else if (this.parGrafica.orden_grafica == "N")
                        {
                          if (this.parGrafica.orden == 0)
                          {
                            resp.sort(this.compararPareton1)
                          }
                          else if (this.parGrafica.orden == 1)
                          {
                            resp.sort(this.compararPareton2)
                          }
                          else if (this.parGrafica.orden == 2)
                          {
                            resp.sort(this.compararPareton3)
                          }
                          else
                          {
                            resp.sort(this.compararPareton4)
                          }
                        }
                        else
                        {
                          if (this.parGrafica.orden == 0)
                          {
                            resp.sort(this.compararParetom1)
                          }
                          else if (this.parGrafica.orden == 1)
                          {
                            resp.sort(this.compararParetom2)
                          }
                          else if (this.parGrafica.orden == 2)
                          {
                            resp.sort(this.compararParetom3)
                          }
                          else
                          {
                            resp.sort(this.compararParetom4)
                          }
                        }
                      }
                      else
                      {
                        if (this.parGrafica.orden == 0)
                        {
                          resp.sort(this.compararParetom1)
                        }
                        else if (this.parGrafica.orden == 1)
                        {
                          resp.sort(this.compararParetom2)
                        }
                        else if (this.parGrafica.orden == 2)
                        {
                          resp.sort(this.compararParetom3)
                        }
                        else 
                        {
                          resp.sort(this.compararParetom4)
                        }
                      }
                    }
                    else  if (this.grActual == 2)
                    {
                      if (this.parGrafica.orden_grafica)
                      {
                        if (this.parGrafica.orden_grafica == "A")
                        {
                          resp.sort(this.compararParetoa)
                        }
                        else if (this.parGrafica.orden_grafica == "N")
                        {
                          resp.sort(this.compararPareton4)
                        }
                        else
                        {
                          resp.sort(this.compararParetom4)
                        }
                      }
                      else
                      {
                        resp.sort(this.compararParetom4)
                      }
                    }

                  }
                }
              }
              
            }

            //Calcular el maxmin de la grafica
            if (this.grActual == 1)
            {
              let valmax = 0;
              for (var i = 0; i < resp.length; i++)
              {
                if (this.parGrafica.orden == 0)
                {
                  if (+resp[i].docs > valmax)
                  {
                    valmax = +resp[i].docs;
                  }
                }
                else if (this.parGrafica.orden == 1)
                {
                  if (+resp[i].tiempo > valmax)
                  {
                    valmax = +resp[i].tiempo;
                  }
                }  
                else if (this.parGrafica.orden == 2)
                {
                  if (+resp[i].des_tiempo > valmax)
                  {
                    valmax = +resp[i].des_tiempo;
                  }
                }  
                else 
                {
                  if (+resp[i].total_tiempo > valmax)
                  {
                    valmax = +resp[i].total_tiempo;
                  }
                }                
              }
              if (this.resumenes.length > 0)
              {
                for (var i = 0; i < this.resumenes.length; i++)
                {
                  if (this.parGrafica.orden == 0)
                  {
                    if (+this.resumenes[i].docs > valmax)
                    {
                      valmax = +this.resumenes[i].docs;                    
                    }
                  }
                  else if (this.parGrafica.orden == 1)
                  {
                    if (+this.resumenes[i].tiempo > valmax)
                    {
                      valmax = +this.resumenes[i].tiempo;                    
                    }
                  }
                  else if (this.parGrafica.orden == 2)
                  {
                    if (+this.resumenes[i].des_tiempo > valmax)
                    {
                      valmax = +this.resumenes[i].des_tiempo;                    
                    }
                  }
                  else 
                  {
                    if (+this.resumenes[i].total_tiempo > valmax)
                    {
                      valmax = +this.resumenes[i].total_tiempo;                    
                    }
                  }
                  
                }
              }
              this.maxmin = {startValue: 0, endValue: valmax};
              
              let totalTTL = 0;
              for (var i = 0; i < resp.length; i++)
              {

                totalTTL = totalTTL + (this.parGrafica.orden == 0 ? +resp[i].docs : this.parGrafica.orden == 1 ? +resp[i].tiempo : this.parGrafica.orden == 2 ? +resp[i].des_tiempo : +resp[i].total_tiempo);
              }
              let acumulado = 0;
              for (var i = 0; i < resp.length; i++)
              {
                acumulado = acumulado + (this.parGrafica.orden == 0 ? +resp[i].docs : this.parGrafica.orden == 1 ? +resp[i].tiempo : this.parGrafica.orden == 2 ? +resp[i].des_tiempo : +resp[i].total_tiempo) / totalTTL * 100;
                resp[i].porcentaje = acumulado;
              }

              resp[resp.length - 1].porcentaje = 100;
               totalTTL = 0;
              for (var i = 0; i < this.miGraficaTotal.length; i++)
              {

                totalTTL = totalTTL + (this.parGrafica.orden == 0 ? +this.miGraficaTotal[i].docs : this.parGrafica.orden == 1 ? +this.miGraficaTotal[i].tiempo : this.parGrafica.orden == 2 ? +this.miGraficaTotal[i].des_tiempo : +this.miGraficaTotal[i].total_tiempo);
              }
               acumulado = 0;
              for (var i = 0; i < this.miGraficaTotal.length; i++)
              {
                acumulado = acumulado + (this.parGrafica.orden == 0 ? +this.miGraficaTotal[i].docs : this.parGrafica.orden == 1 ? +this.miGraficaTotal[i].tiempo : this.parGrafica.orden == 2 ? +this.miGraficaTotal[i].des_tiempo : +this.miGraficaTotal[i].total_tiempo) / totalTTL * 100;
                this.miGraficaTotal[i].porcentaje = acumulado;
              }

              this.miGraficaTotal[this.miGraficaTotal.length - 1].porcentaje = 100;
              this.formatoGrafico.tipo = "fixedPoint";
              this.formatoGrafico.precision = 0;
            }
            else if (this.grActual == 2)
            {
              let valmax = 0;
              for (var i = 0; i < resp.length; i++)
              {
                if (+resp[i].total_tiempo > valmax)
                {
                  valmax = +resp[i].total_tiempo;
                }
              }
              
              if (this.parGrafica.tipo_valor=="fullStackedBar")
              {
                valmax = 1;
                this.formatoGrafico.tipo = "percent";
                this.formatoGrafico.precision = 0;
              }
              else
              {
                this.formatoGrafico.tipo = "fixedPoint";
                this.formatoGrafico.precision = 0;
              }
              this.maxmin = {startValue: 0, endValue: valmax};
            }
            this.miGrafica = resp;
          }
          else
          {
            this.servicio.activarSpinnerSmall.emit(false);
            this.servicio.activarSpinner.emit(false);
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = "No hay datos para graficar";
            mensajeCompleto.tiempo = 1000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
          this.modelo = 1;
        })
    })
  }


  compararPareton1(a, b) 
  {
    let comparison = 0;
    if (+a.docs > +b.docs) 
    {
      comparison = 1;
    } 
    else if (+a.docs < +b.docs) 
    {
      comparison = -1;
    }
    return comparison;
  }

  compararPareton2(a, b) 
  {
    let comparison = 0;
    if (+a.tiempo > +b.tiempo) 
    {
      comparison = 1;
    } 
    else if (+a.tiempo < +b.tiempo) 
    {
      comparison = -1;
    }
    return comparison;
  }

  compararPareton3(a, b) 
  {
    let comparison = 0;
    if (+a.des_tiempo > +b.des_tiempo) 
    {
      comparison = 1;
    } 
    else if (+a.des_tiempo < +b.des_tiempo) 
    {
      comparison = -1;
    }
    return comparison;
  }

  compararPareton4(a, b) 
  {
    let comparison = 0;
    if (+a.total_tiempo > +b.total_tiempo) 
    {
      comparison = 1;
    } 
    else if (+a.total_tiempo < +b.total_tiempo) 
    {
      comparison = -1;
    }
    return comparison;
  }

  compararParetom1(a, b) 
  {
    let comparison = 0;
    if (+a.docs < +b.docs) 
    {
      comparison = 1;
    } 
    else if (+a.docs > +b.docs) 
    {
      comparison = -1;
    }
    return comparison;
  }

  compararParetom2(a, b) 
  {
  let comparison = 0;
  if (+a.tiempo < +b.tiempo) 
  {
    comparison = 1;
  } 
  else if (+a.tiempo > +b.tiempo) 
  {
    comparison = -1;
  }
  return comparison;
  }

  compararParetom3(a, b) 
  {
  let comparison = 0;
  if (+a.des_tiempo < +b.des_tiempo) 
  {
    comparison = 1;
  } 
  else if (+a.des_tiempo > +b.des_tiempo) 
  {
    comparison = -1;
  }
  return comparison;
  }

  compararParetom4(a, b) 
  {
  let comparison = 0;
  if (+a.total_tiempo < +b.total_tiempo) 
  {
    comparison = 1;
  } 
  else if (+a.total_tiempo > +b.total_tiempo) 
  {
    comparison = -1;
  }
  return comparison;
  }

  compararParetoa(a, b) 
  {
    let comparison = 0;
    
    if (+a.nombre < +b.nombre) 
    {
      comparison = 1;
    } 
    else if (+a.nombre > +b.nombre) 
    {
      comparison = -1;
    }
    return comparison;
  }

  
filtrar()
{
  this.servicio.mensajeInferior.emit("Mantenimiento de consultas");
  this.listarConsultas()
  this.filtrando = true;
  this.formateando = false;
  this.filtrarC = false;
  this.graficando = false;
  this.bot4Sel = false;
  this.bot7Sel = false;
  this.guardarSel = false;
  this.modelo = 12;
  this.buscarConsulta(this.servicio.rConsulta());
}

buscarConsulta(id: number)
{
  this.botElim = false;
  this.botGuar = false;
  this.botCan = false;
  this.consultaTemp = '' + id;
  
  this.listarLineas();
  this.listarMaquinas();
  this.listarAreas();
  this.listarFallas();
  this.listarTecnicos();
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + id;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    { 
      if (!resp[0].nombre)
      {
        this.botElim = false;  
      }     
      else if (resp[0].nombre == "")
      {
        this.botElim = false;  
      }
      else if (resp[0].usuario != + this.servicio.rUsuario().id)
      {
        this.botElim = false;  
      }
      else
      {
        this.botElim = true;
      }
      this.detalle = resp[0]; 
      this.detalle.periodo = +this.detalle.periodo;
      if (this.detalle.periodo==8)
      {
        this.detalle.desde = new Date(this.detalle.desde);
        this.detalle.hasta = new Date(this.detalle.hasta);
      }
    }
    else
    {
      this.detalle.nombre = "";
      this.detalle.defecto = "N";
      this.detalle.id = "0";
      this.detalle.periodo = 1;
      this.detalle.publico = "N";
      this.detalle.desde = "";
      this.detalle.hasta = "";
      this.detalle.filtrolin = "S";
      this.detalle.filtromaq = "S";
      this.detalle.filtroare = "S";
      this.detalle.filtrofal = "S";
      this.detalle.filtrotec = "S";
      this.detalle.filtronpar = "S";
      this.detalle.filtrotur = "S";
      this.detalle.filtroord = "S";      
      this.detalle.filtropar = "S";  
      this.detalle.filtrocla = "S";      
    }
    this.consultaBuscada = false;
    this.detalle.selMaquinasT = "S";
    this.detalle.selFallasT = "S";
    this.detalle.selTurnosT = "S";
    this.detalle.selLotesT = "S";
    this.detalle.selLineasT = "S";
    this.detalle.selAreasT = "S";
    this.detalle.selPartesT = "S";
    this.detalle.selTecnicosT = "S";
    this.detalle.selParosT = "S";
    this.detalle.selClasesT = "S";
    setTimeout(() => {
      this.txtNombre.nativeElement.focus();  
    }, 200);
  }, 
  error => 
    {
      console.log(error)
    })
}

regresar()
{
  this.servicio.mensajeInferior.emit("Graficas de la aplicación");
  this.modelo = 11;
  this.graficando = true;
  this.filtrando = false;
  this.formateando = false;
}


listarConsultas()
  {
    let sentencia = "SELECT id, nombre, general, usuario FROM " + this.servicio.rBD() + ".consultas_cab WHERE (usuario = " + this.servicio.rUsuario().id + ") OR (general = 'S' AND NOT ISNULL(nombre)) ORDER BY nombre;";
    this.consultas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      for (var i = 0; i < resp.length; i++) 
      {
        if (!resp[i].nombre)
        {
          resp[i].nombre = " [Consulta por defecto]";
        }
        else if (resp[i].nombre == "")
        {
          resp[i].nombre = " [Consulta por defecto]";
        }
      }
      this.consultas = resp;
    });
  }

   cConsulta(event: any) 
  {
    this.eliminar = event.value != 0;
    this.buscarConsulta(event.value);
  }

  eliminarConsulta()
  {
    this.bot7Sel = false;
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: "ELIMINAR CONSULTA", mensaje: "Esta acción eliminará permanentemente la consulta actual y ya no podrá ser usada en el sistema<br><br><strong>¿Desea continuar con la operación?</strong>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Continuar y eliminar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_eliminar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result.accion)
      {
        if (result.accion == 1) 
        {
          let sentencia = "DELETE FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.detalle.id + ";"
          let campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe(resp =>
          {
            if (this.servicio.rConsulta() == this.detalle.id)
            {
              this.servicio.aConsulta(0);
            }
            this.botElim = false;
            this.detalle.id = 0;
            this.detalle.nombre = "";
            this.detalle.defecto = "N";
            this.detalle.id = "0";
            this.detalle.periodo = 1;
            this.detalle.publico = "N";
            this.detalle.desde = "";
            this.detalle.hasta = "";
            this.detalle.filtrolin = "S";
            this.detalle.filtromaq = "S";
            this.detalle.filtroare = "S";
            this.detalle.filtrofal = "S";
            this.detalle.filtrotec = "S";
            this.detalle.filtronpar = "S";
            this.detalle.filtrotur = "S";
            this.detalle.filtroord = "S";
            this.detalle.filtropar = "S";
            this.detalle.filtrocla = "S";      
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = "La consulta ha sido  eliminada";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            setTimeout(() => {
              this.txtNombre.nativeElement.focus();  
            }, 200);
          });
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "Acción cancelada por el usuario";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "Acción cancelada por el usuario";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  listarLineas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 10 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.lineas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.lineas = resp;
        }, 300);
      
    });
  }

 
  listarMaquinas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 20 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, nombre;"
    this.maquinas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.maquinas = resp;
      }, 300);
    });
  }

  listarAreas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 30 AND b.consulta = " + this.consultaTemp + " WHERE a.tabla = 30 ORDER BY seleccionado DESC, a.nombre;"
    this.areas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.areas = resp;
        }, 300);
      
    });
  }

  listarFallas()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 40 AND b.consulta = " + this.consultaTemp + " WHERE a.tabla = 50 ORDER BY seleccionado DESC, a.nombre;"
    this.fallas = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.fallas = resp;
        }, 300);
      
    });
  }

  listarTecnicos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 50 AND b.consulta = " + this.consultaTemp + "  WHERE a.tabla = 65 ORDER BY seleccionado DESC, a.nombre;"
    this.tecnicos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.tecnicos = resp;
        }, 300);
      
    });
  }


  cancelar()
  {
    this.bot4Sel = false;
    this.eliminar = this.detalle.id != 0;
    this.buscarConsulta(this.detalle.id);
  }

  seleccion(tipo: number, event: any) 
  {
    this.botGuar = true;
    this.botCan = true;
    if (tipo == 1)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.lineas.length; i++) 
        {
          this.lineas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrolin = "N";  
        }, 100);
      }
    }
    else if (tipo == 2)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.maquinas.length; i++) 
        {
          this.maquinas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtromaq = "N";  
        }, 100);
      }
    }
    else if (tipo == 3)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.areas.length; i++) 
        {
          this.areas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtroare = "N";  
        }, 100);
      }
    }
    else if (tipo == 4)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.fallas.length; i++) 
        {
          this.fallas[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrofal = "N";  
        }, 100);
      }
    }
    else if (tipo == 5)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.tecnicos.length; i++) 
        {
          this.tecnicos[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrotec = "N";  
        }, 100);
      }
    }

    else if (tipo == 7)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.partes.length; i++) 
        {
          this.partes[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtronpar = "N";  
        }, 100);
      }
    }
    else if (tipo == 6)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.turnos.length; i++) 
        {
          this.turnos[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrotur = "N";   
        }, 100);
      }
    }
    else if (tipo == 8)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.lotes.length; i++) 
        {
          this.lotes[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtroord = "N";   
        }, 100);
      }
    }
    else if (tipo == 9)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.paros.length; i++) 
        {
          this.paros[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtropar = "N";   
        }, 100);
      }
    }
    else if (tipo == 10)
    {
      if (event.value <= 1) 
      {
        for (var i = 0; i < this.clases.length; i++) 
        {
          this.clases[i].seleccionado = event.value;
        }
        setTimeout(() => {
          this.detalle.filtrocla = "N";   
        }, 100);
      }
    }
  }

  guardar(id: number)
  {
    this.botGuar = false;
    this.guardarSel = false;
    let errores = 0;
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.faltaMensaje = "<strong>No se ha guardado el registro por el siguiente mensaje:</strong> ";
    if (!this.detalle.nombre && id == 1)
    {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el Nombre de la consulta";      
    }
    else if ((!this.detalle.nombre || this.detalle.nombre=="") && id == 1)
    {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el Nombre de la consulta";      
    }
    if (this.detalle.periodo == "8")
    {
      if (!this.detalle.desde) 
      {
        errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") La fecha de inicio no está permitida";      
      }

      if (!this.detalle.hasta) 
      {
        errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") La fecha de fin no está permitida";      
      }

      if (this.detalle.desde && this.detalle.hasta) 
      {
        if (this.detalle.desde > this.detalle.hasta)
        {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") La fecha inicial no puede ser mayor a la final";      
        }
      }
    }
    if (id== 1 && !this.consultaBuscada)
    {
      this.consultaBuscada = true;
      this.buscarConsultaID();
      return;
    }
    this.consultaBuscada = false;
    
    if (errores > 0)
    {
      setTimeout(() => {
        if (this.error01)
        {
          this.txtNombre.nativeElement.focus();
        }
        else if (this.error02)
        {
          this.txtDesde.nativeElement.focus();
        }
        else if (this.error03)
        {
          this.txtHasta.nativeElement.focus();
        }
        this.botGuar = true;
      }, 300);
      return;
    }
    this.editando = false;
    this.faltaMensaje = "";
    if (id == 0 && !this.detalle.nombre)
    {
      this.detalle.publico = "N";
    }
    this.botGuar = false;
    this.botCan = false;

    this.detalle.filtrolin = this.detalle.filtrolin != "S" && this.detalle.filtrolin !="N" ? "N" : this.detalle.filtrolin;
    this.detalle.filtromaq = this.detalle.filtromaq != "S" && this.detalle.filtromaq !="N" ? "N" : this.detalle.filtromaq
    this.detalle.filtroare = this.detalle.filtroare != "S" && this.detalle.filtroare !="N" ? "N" : this.detalle.filtroare
    
    this.detalle.filtrofal = this.detalle.filtrofal != "S" && this.detalle.filtrofal !="N" ? "N" : this.detalle.filtrofal
    
    this.detalle.filtrotec = this.detalle.filtrotec != "S" && this.detalle.filtrotec !="N" ? "N" : this.detalle.filtrotec
    
    let previa = "";
    if (!this.detalle.nombre)
    {
      previa = "DELETE FROM " + this.servicio.rBD() + ".consultas_cab WHERE (ISNULL(nombre) OR nombre = '') AND usuario = " + this.servicio.rUsuario().id + ";";
    }
    let previa2 = "";
    if (this.detalle.defecto == "S")
    {
      previa2 = "UPDATE " + this.servicio.rBD() + ".consultas_cab SET defecto = 'N', actualizacion = NOW() WHERE usuario = " + this.servicio.rUsuario().id + ";";
    }
    let nuevo = true;
    let sentencia = previa + previa2 + "INSERT INTO " + this.servicio.rBD() + ".consultas_cab (usuario, " + (id == 1 ? "nombre, " : "") + "publico, periodo, defecto, filtrolin, filtromaq, filtroare, filtrofal, filtrotec, filtronpar, filtrotur, filtroord" + (this.detalle.periodo != 8 ? ")" : ", desde, hasta, actualizacion)") + " VALUES (" + this.servicio.rUsuario().id + ", '" + (id == 1 ? this.detalle.nombre + "', '" : "") + this.detalle.publico + "', '" + this.detalle.periodo + "', '" + this.detalle.defecto + "', '" + this.detalle.filtrolin + "', '" + this.detalle.filtromaq + "', '" + this.detalle.filtroare + "', '" + this.detalle.filtrofal + "', '" + this.detalle.filtrotec + "', '" + this.detalle.filtronpar + "', '" + this.detalle.filtrotur + "', '" + this.detalle.filtroord + "'" + (this.detalle.periodo != 8 ? ");" : ", '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "', '" +  this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "', NOW());")
    if (+this.detalle.id > 0)
    {
      nuevo = false;
      sentencia = previa2 + "UPDATE " + this.servicio.rBD() + ".consultas_cab SET " + (id == 1 ? "nombre = '" + this.detalle.nombre + "', " : "") + "actualizacion = NOW(), publico = '" + this.detalle.publico + "', periodo = '" + this.detalle.periodo + "', defecto = '" + this.detalle.defecto + "', filtrolin = '" + this.detalle.filtrolin + "', filtromaq = '" + this.detalle.filtromaq + "', filtroare = '" + this.detalle.filtroare + "', filtrofal = '" + this.detalle.filtrofal + "', filtrotec = '" + this.detalle.filtrotec + "', filtronpar = '" + this.detalle.filtronpar + "', filtrotur = '" + this.detalle.filtrotur + "', filtroord = '" + this.detalle.filtroord + "'" + (this.detalle.periodo != 8 ? "" : ", desde = '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "', hasta = '" +  this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "' ") + " WHERE id = " + +this.detalle.id + ";";
    }
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (nuevo)
      {
        sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".consultas_cab;";
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          this.detalle.id = resp[0].nuevoid
          this.guardar_2()
          if (this.detalle.defecto == "S")
          {
            this.servicio.aConsulta(this.detalle.id);
          }
          setTimeout(() => {
            this.txtNombre.nativeElement.focus();  
          }, 200);

        })
      }
      else
      {
        this.guardar_2();
      }
      
    })
    
  }

  buscarConsultaID()
{
  let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".consultas_cab WHERE (usuario = " + this.servicio.rUsuario().id + ") AND nombre = '" + this.detalle.nombre + "'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    {
      this.detalle.id = resp[0].id  
    }
    else
    {
      this.detalle.id = 0; 
    }
    this.guardar(1)
  })
}

  guardar_2()
  {
    let sentencia = "DELETE FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + +this.detalle.id + ";";
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let cadTablas = "INSERT INTO " + this.servicio.rBD() + ".consultas_det (consulta, tabla, valor) VALUES";
      if (this.listaLineas)
      {
        for (var i = 0; i < this.listaLineas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas +  "(" + this.detalle.id + ", 10,  " + +this.listaLineas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaMaquinas)
      {
        for (var i = 0; i < this.listaMaquinas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 20,  " + +this.listaMaquinas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaAreas)
      {
        for (var i = 0; i < this.listaAreas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 30,  " + +this.listaAreas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaFallas)
      {
        for (var i = 0; i < this.listaFallas.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 40,  " + +this.listaFallas.selectedOptions.selected[i].value + "),";
        }
      }
      if (this.listaTecnicos)
      {
        for (var i = 0; i < this.listaTecnicos.selectedOptions.selected.length; i++) 
        {
          cadTablas = cadTablas + "(" + this.detalle.id + ", 50,  " + +this.listaTecnicos.selectedOptions.selected[i].value + "),";
        }
      }
      if (cadTablas != "INSERT INTO " + this.servicio.rBD() + ".consultas_det (consulta, tabla, valor) VALUES")
      {
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.modelo = 11;
          this.servicio.aConsulta(this.detalle.id);
          this.graficando = true;
          this.filtrando = false;
          this.aplicarConsulta(this.servicio.rConsulta());
        });
      }
      else
      {
        this.modelo = 11;
        this.servicio.aConsulta(this.detalle.id);
        this.graficando = true;
        this.filtrando = false;
        this.aplicarConsulta(this.servicio.rConsulta());
      }
      
    })
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = "La consulta se ha guardado satisfactoriamente";
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
  }


  guardarF(id: number)
  {
    this.detalle.color_letras = this.detalle.color_letras ? this.detalle.color_letras.substr(1) : "";
    this.detalle.etiqueta_color = this.detalle.etiqueta_color ? this.detalle.etiqueta_color.substr(1) : "";
    this.detalle.etiqueta_fondo = this.detalle.etiqueta_fondo ? this.detalle.etiqueta_fondo.substr(1) : "";
    this.detalle.color_leyenda = this.detalle.color_leyenda ? this.detalle.color_leyenda.substr(1) : "";
    this.detalle.color_leyenda_fondo = this.detalle.color_leyenda_fondo ? this.detalle.color_leyenda_fondo.substr(1) : "";
    this.detalle.color_fondo_barras = this.detalle.color_fondo_barras ? this.detalle.color_fondo_barras.substr(1) : "";
    this.detalle.color_fondo = this.detalle.color_fondo ? this.detalle.color_fondo.substr(1) : "";
    this.detalle.color_barra = this.detalle.color_barra ? this.detalle.color_barra.substr(1) : "";

    this.detalle.oee_colores = (this.detalle.colorFTQ ? this.detalle.colorFTQ.substr(1) : "") + ";" + (this.detalle.colorEFI ? this.detalle.colorEFI.substr(1) : "") + ";" + (this.detalle.colorDIS ? this.detalle.colorDIS.substr(1) : "");
    
    this.detalle.color_barra_borde = this.detalle.color_barra_borde ? this.detalle.color_barra_borde.substr(1) : "";
    this.detalle.color_spiline = this.detalle.color_spiline ? this.detalle.color_spiline.substr(1) : "";
    this.detalle.color_esperado = this.detalle.color_esperado ? this.detalle.color_esperado.substr(1) : "";
    this.detalle.titulo_fuente = (!this.detalle.titulo_fuente) ? 20 : this.detalle.titulo_fuente > 99 ? 99 : this.detalle.titulo_fuente;
    this.detalle.subtitulo_fuente = (!this.detalle.subtitulo_fuente) ? 15 : this.detalle.subtitulo_fuente > 99 ? 99 : this.detalle.subtitulo_fuente;
    this.detalle.texto_x_fuente = (!this.detalle.texto_x_fuente) ? 10 : this.detalle.texto_x_fuente > 99 ? 99 : this.detalle.texto_x_fuente;
    this.detalle.texto_y_fuente = (!this.detalle.texto_y_fuente) ? 10 : this.detalle.texto_y_fuente > 99 ? 99 : this.detalle.texto_y_fuente;
    this.detalle.texto_z_fuente = (!this.detalle.texto_z_fuente) ? 10 : this.detalle.texto_z_fuente > 99 ? 99 : this.detalle.texto_z_fuente;
    this.detalle.etiqueta_fuente = (!this.detalle.etiqueta_fuente) ? 10 : this.detalle.etiqueta_fuente > 99 ? 99 : this.detalle.etiqueta_fuente;
    this.detalle.alto = (!this.detalle.alto) ? 0 : this.detalle.alto > 999999 ? 999999 : this.detalle.alto;
    this.detalle.ancho = (!this.detalle.ancho) ? 0 : this.detalle.ancho > 999999 ? 999999 : this.detalle.ancho;
    this.detalle.margen_arriba = (!this.detalle.margen_arriba) ? 0 : this.detalle.margen_arriba > 99 ? 99 : this.detalle.margen_arriba;
    this.detalle.margen_abajo = (!this.detalle.margen_abajo) ? 0 : this.detalle.margen_abajo > 99 ? 99 : this.detalle.margen_abajo;

    this.detalle.tadic1 = !this.detalle.tadic1 ? "" : this.detalle.tadic1;
    this.detalle.tadic2 = !this.detalle.tadic2 ? "" : this.detalle.tadic2;
    this.detalle.tadic3 = !this.detalle.tadic3 ? "" : this.detalle.tadic3;
    this.detalle.tadic4 = !this.detalle.tadic4 ? "" : this.detalle.tadic4;
    this.detalle.tadic5 = !this.detalle.tadic5 ? "" : this.detalle.tadic5;
    this.detalle.tadic6 = !this.detalle.tadic6 ? "" : this.detalle.tadic6;
    this.detalle.adic1 = !this.detalle.adic1 ? "0" : this.detalle.adic1;
    this.detalle.adic2 = !this.detalle.adic2 ? "0" : this.detalle.adic2;
    this.detalle.adic3 = !this.detalle.adic3 ? "0" : this.detalle.adic3;
    this.detalle.adic4 = !this.detalle.adic4 ? "0" : this.detalle.adic4;
    this.detalle.adic5 = !this.detalle.adic5 ? "0" : this.detalle.adic5;
    this.detalle.adic6 = !this.detalle.adic6 ? "0" : this.detalle.adic6;

    this.detalle.coladic1 = this.detalle.coladic1 ? this.detalle.coladic1.substr(1) : "";
    this.detalle.coladic2 = this.detalle.coladic2 ? this.detalle.coladic2.substr(1) : "";
    this.detalle.coladic3 = this.detalle.coladic3 ? this.detalle.coladic3.substr(1) : "";
    this.detalle.coladic4 = this.detalle.coladic4 ? this.detalle.coladic4.substr(1) : "";
    this.detalle.coladic5 = this.detalle.coladic5 ? this.detalle.coladic5.substr(1) : "";
    this.detalle.coladic6 = this.detalle.coladic6 ? this.detalle.coladic6.substr(1) : "";
    
    this.detalle.color_alto = this.detalle.color_alto ? this.detalle.color_alto.substr(1) : "";
    this.detalle.color_bajo = this.detalle.color_bajo ? this.detalle.color_bajo.substr(1) : "";

    this.detalle.margen_izquierda = (!this.detalle.margen_izquierda) ? 0 : this.detalle.margen_izquierda > 99 ? 99 : this.detalle.margen_izquierda;
    this.detalle.margen_derecha = (!this.detalle.margen_derecha) ? 0 : this.detalle.margen_derecha > 99 ? 99 : this.detalle.margen_derecha;
    this.detalle.grueso_esperado = (!this.detalle.grueso_esperado) ? 1 : this.detalle.grueso_esperado > 10 ? 10 : this.detalle.grueso_esperado;
    this.detalle.mostrar_tabla = (!this.detalle.mostrar_tabla) ? "0" : this.detalle.mostrar_tabla;
    this.detalle.grueso_spiline = (!this.detalle.grueso_spiline) ? 0 : this.detalle.grueso_spiline > 10 ? 10 : this.detalle.grueso_spiline;
    this.detalle.maximo_barras = (!this.detalle.maximo_barras) ? 0 : this.detalle.maximo_barras > 100 ? 100 : this.detalle.maximo_barras;
    this.detalle.maximo_barraspct = (!this.detalle.maximo_barraspct) ? 0 : this.detalle.maximo_barraspct > 99 ? 99 : this.detalle.maximo_barraspct;
    this.detalle.valor_esperado = (!this.detalle.valor_esperado) ? 0 : this.detalle.valor_esperado;
    
    let cadOEE = "NNNNNN";

    this.detalle.oee_tipo = this.detalle.oee_tipoFTQ + this.detalle.oee_tipoEFI + this.detalle.oee_tipoDIS

    this.detalle.oee_nombre = this.detalle.oee_nombreFTQ + ";" + this.detalle.oee_nombreEFI + ";" + this.detalle.oee_nombreDIS;
    this.detalle.adicionales_titulos = this.detalle.tadic1 + ";" +this.detalle.tadic2 + ";" +this.detalle.tadic3 + ";" +this.detalle.tadic4 + ";" +this.detalle.tadic5 + ";" +this.detalle.tadic6
    
    this.detalle.adicionales = this.detalle.adic1 + ";" +this.detalle.adic2 + ";" +this.detalle.adic3 + ";" +this.detalle.adic4 + ";" +this.detalle.adic5 + ";" +this.detalle.adic6 + ";" +this.detalle.adic7
    
    this.detalle.adicionales_colores = this.detalle.coladic1 + ";" +this.detalle.coladic2 + ";" +this.detalle.coladic3 + ";" +this.detalle.coladic4 + ";" +this.detalle.coladic5 + ";" +this.detalle.coladic6

  
    this.detalle.esperado_esquema = (!this.detalle.dividir_colores ? "N" : this.detalle.dividir_colores) + ";" + this.detalle.color_bajo + ";" + this.detalle.color_alto 

    cadOEE = (this.detalle.oee_selFTQ ? "S" : "N") + (this.detalle.oee_selEFI ? "S" : "N") + (this.detalle.oee_selDIS ? "S" : "N");
    cadOEE = cadOEE + (this.detalle.oee_etiFTQ ? this.detalle.oee_etiFTQ : "N");
    cadOEE = cadOEE + (this.detalle.oee_etiEFI ? this.detalle.oee_etiEFI : "N");
    cadOEE = cadOEE + (this.detalle.oee_etiDIS ? this.detalle.oee_etiDIS : "N");
    this.detalle.texto_esperado = this.detalle.texto_esperado ? this.detalle.texto_esperado : "";
    this.detalle.texto_esperado = this.detalle.texto_esperado == "null" ? "" : this.detalle.texto_esperado;

    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".pu_graficos WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = " + this.servicio.rUsuario().id; 
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let esNuevo = false;
      if (resp.length == 0)
      {
        esNuevo = true;
        sentencia = "INSERT INTO " + this.servicio.rBD() + ".pu_graficos (grafico, usuario) VALUES(" + (this.grActual * 100 + this.graficaActual) + ", " + this.servicio.rUsuario().id + ");"
      }
      else
      {
        sentencia = "";
      }
      sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".pu_graficos SET visualizar = '" + this.detalle.visualizar + "', titulo = '" + this.detalle.titulo + "', orden = '" + (!this.detalle.orden ? "1" : this.detalle.orden) + "', tipo_principal = '" + this.detalle.tipo_principal + "', oee_tipo = '" + this.detalle.oee_tipo + "', oee_nombre = '" + this.detalle.oee_nombre + "', oee = '" + cadOEE + "', oee_colores = '" + this.detalle.oee_colores + "', titulo_fuente = " + this.detalle.titulo_fuente + ", sub_titulo = '" + this.detalle.sub_titulo + "', subtitulo_fuente = " + this.detalle.subtitulo_fuente + ", texto_x = '" + this.detalle.texto_x + "', texto_x_fuente = " + this.detalle.texto_x_fuente + ", texto_y = '" + this.detalle.texto_y + "', texto_y_fuente = " + this.detalle.texto_y_fuente + ", texto_z = '" + this.detalle.texto_z + "', texto_z_fuente = " + this.detalle.texto_z_fuente + ", etiqueta_mostrar = '" + this.detalle.etiqueta_mostrar + "', etiqueta_fuente = " + this.detalle.etiqueta_fuente + ", etiqueta_leyenda = '" + this.detalle.etiqueta_leyenda + "', etiqueta_color = '" + this.detalle.etiqueta_color + "', etiqueta_fondo = '" + this.detalle.etiqueta_fondo + "', ancho = " + this.detalle.ancho + ", alto = " + this.detalle.alto + ", margen_arriba = " + this.detalle.margen_arriba + ", margen_abajo = " + this.detalle.margen_abajo + ", margen_izquierda = " + this.detalle.margen_izquierda + ", margen_derecha = " + this.detalle.margen_derecha + ", maximo_barras = " + this.detalle.maximo_barras + ", maximo_barraspct = " + this.detalle.maximo_barraspct + ", agrupar = '" + this.detalle.agrupar + "', agrupar_posicion = '" + this.detalle.agrupar_posicion + "', agrupar_texto = '" + this.detalle.agrupar_texto + "', fecha = NOW(), color_fondo_barras = '" + this.detalle.color_fondo_barras + "', color_letras = '" + this.detalle.color_letras + "', color_fondo = '" + this.detalle.color_fondo + "', color_leyenda_fondo = '" + this.detalle.color_leyenda_fondo + "', color_leyenda = '" + this.detalle.color_leyenda + "', ver_esperado = '" + this.detalle.ver_esperado + "', valor_esperado = " + +this.detalle.valor_esperado + ", grueso_esperado = " + this.detalle.grueso_esperado + ", color_esperado = '" + this.detalle.color_esperado + "', texto_esperado = '" + this.detalle.texto_esperado + "', incluir_ceros = '" + this.detalle.incluir_ceros + "', orden_grafica = '" + this.detalle.orden_grafica + "', color_barra = '" + this.detalle.color_barra + "', color_barra_borde = '" + this.detalle.color_barra_borde + "', ver_leyenda = '" + this.detalle.ver_leyenda + "', overlap = '" + this.detalle.overlap + "', colores_multiples = '" + this.detalle.colores_multiples + "', color_spiline = '" + this.detalle.color_spiline + "', adicionales = '" + this.detalle.adicionales + "', esperado_esquema = '" + this.detalle.esperado_esquema + "', adicionales_colores = '" + this.detalle.adicionales_colores + "', adicionales_titulos = '" + this.detalle.adicionales_titulos + "', grueso_spiline = " + this.detalle.grueso_spiline + ", mostrar_tabla = '" + this.detalle.mostrar_tabla + "' WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = " + this.servicio.rUsuario().id, 
      sentencia = sentencia.replace(/null/g, '');
      campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe(resp =>
      {
        this.graficando = true;
        this.formateando = false;
        sentencia = "SELECT id, titulo AS nombre, visualizar FROM " + this.servicio.rBD() + ".pu_graficos WHERE usuario = " + this.servicio.rUsuario().id + " AND grafico = " + (this.grActual * 100 + this.graficaActual);
        campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          if (resp.length>0)
          {
            resp[0].nro = this.graficaActual
            this.opciones[this.graficaActual - 1] = resp[0];
            this.modelo = 11;
            this.preGraficar(this.graficaActual - 1);
          }
          
        })
        this.servicio.mensajeInferior.emit("Graficas de la aplicación");
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "El formato de la gráfica se ha guardado satisfactoriamente";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        
      })
    })
  }

  cambiando(evento: any)
  {
    this.botGuar = true;
    this.botCan = true;
    if (evento.value == 8)
    {
      if (!this.detalle.desde)
      {
        this.detalle.desde = new Date();
      }
      if (!this.detalle.hasta)
      {
        this.detalle.hasta = new Date();
      }
    }
    
  }

  aplicarConsulta(id: number)
  {
    this.filtroReportes = "";
    this.ayuda20 = "";
    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE id = " + this.servicio.rConsulta() + ";"
    if (this.servicio.rConsulta() == 0)
    {
      sentencia = "SELECT * FROM " + this.servicio.rBD() + ".consultas_cab WHERE usuario = " + this.servicio.rUsuario().id + " AND (defecto = 'S' OR ISNULL(nombre) OR nombre = '') ORDER BY actualizacion DESC LIMIT 1"
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let desde = new Date();
      let hasta = new Date();
      this.ayuda20 = resp[0].nombre ? "Consulta aplicada: " + resp[0].nombre : "";
        
      this.hayFiltro = false;
      if (resp.length > 0)
      { 
        this.servicio.aConsulta(resp[0].id)
        this.hayFiltro = true;
        if (resp[0].periodo == "2")
        {
          if (desde.getDay()==0) 
          {
            //domingo
            desde.setDate(desde.getDate() - 6);
          }
          else 
          {
            desde.setDate(desde.getDate() - (desde.getDay() - 1));
          }
        }
        else if (resp[0].periodo == "3")
        {
          let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
          desde = new Date(nuevaFecha);
        }
        else if (resp[0].periodo == "4")
        {
          let nuevaFecha = this.servicio.fecha(1, '' , "yyyy") + "/01/01";         
          desde = new Date(nuevaFecha);
        }
        else if (resp[0].periodo == "5")
        {
          desde = new Date();
          if (desde.getDay() == 0) 
          {
            desde.setDate(desde.getDate() - 13);
            hasta.setDate(hasta.getDate() - 7);
          }
          else 
          {
            hasta.setDate(hasta.getDate() - (hasta.getDay()));
            desde.setDate(desde.getDate() - (desde.getDay() - 1) - 7);
          }
        }
        else if (resp[0].periodo == "6")
        {
          let mesTemp = new Date(this.datepipe.transform(new Date(desde), "yyyy/MM") + "/01");
          mesTemp.setDate(mesTemp.getDate() - 1);
          desde = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy/MM") + "/01");
          hasta = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy/MM/dd"));
        }
        else if (resp[0].periodo == "7")
        {
          let mesTemp = new Date(this.datepipe.transform(new Date(desde), "yyyy") + "/01/01");
          mesTemp.setDate(mesTemp.getDate() - 1);
          desde = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/01/01");
          hasta = new Date(this.datepipe.transform(new Date(mesTemp), "yyyy") + "/12/31");
        }
        else if (resp[0].periodo == "9")
        {
          desde.setDate(desde.getDate() - 1);
          hasta.setDate(hasta.getDate() - 1);
        }
        if (resp[0].periodo == "8")
        {
          desde = new Date(this.datepipe.transform(new Date(resp[0].desde), "yyyy/MM/dd"));
          hasta = new Date(this.datepipe.transform(new Date(resp[0].hasta), "yyyy/MM/dd"));  
        }
        if (resp[0].filtrolin == "N")
        {
          this.filtroReportes = " AND c.transporte IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 10) "
         
        }
        if (resp[0].filtromaq == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND c.vehiculo IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 20) "
          
        }
        if (resp[0].filtroare == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND c.area IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 30) "
          
        }
        if (resp[0].filtrofal == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND b.tipo IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 40) "
        }
        if (resp[0].filtrotec == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND c.carga IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 50) "
        } 
      } 
      else
      {
        let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
        desde = new Date(nuevaFecha);
      }
      this.fHasta = this.datepipe.transform(hasta, "yyyy/MM/dd") + " 23:59:59";
      this.fDesde = this.datepipe.transform(desde, "yyyy/MM/dd") + " 00:00:00";  
      this.sub_titulo = "Desde: " + this.datepipe.transform(desde, "dd-MMM-yyyy") + " Hasta: " + this.datepipe.transform(hasta, "dd-MMM-yyyy");
      this.preGraficar(id == -1 ? (this.graficaActual - 1) : id)
    })
  }
  
  
  formatear()
  {
    this.servicio.mensajeInferior.emit("Formato de gráfica");
    this.filtrando = false;
    this.formateando = true;
    this.filtrarC = false;
    this.graficando = false;
    this.bot4Sel = false;
    this.bot7Sel = false;
    this.guardarSel = false;
    this.modelo = 13;
    this.buscarGrafica(1);
  }

  buscarGrafica(accion: number)
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE id = " + this.idGrafico;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
        resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
        resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

        resp[0].oee_selFTQ = resp[0].oee[0] == "S";
        resp[0].oee_selEFI = resp[0].oee[1] == "S";
        resp[0].oee_selDIS = resp[0].oee[2] == "S";

        
        resp[0].oee_etiFTQ = resp[0].oee[3];
        resp[0].oee_etiEFI = resp[0].oee[4];
        resp[0].oee_etiDIS = resp[0].oee[5];

        resp[0].oee_etiFTQ = resp[0].oee_etiFTQ != "S" && resp[0].oee_etiFTQ != "N" ? "N" : resp[0].oee_etiFTQ;
        resp[0].oee_etiEFI = resp[0].oee_etiEFI != "S" && resp[0].oee_etiEFI != "N" ? "N" : resp[0].oee_etiEFI;
        resp[0].oee_etiDIS = resp[0].oee_etiDIS != "S" && resp[0].oee_etiDIS != "N" ? "N" : resp[0].oee_etiDIS;

        resp[0].color_letras = resp[0].color_letras ? ("#" + resp[0].color_letras) : "";
        resp[0].etiqueta_color = resp[0].etiqueta_color ? ("#" + resp[0].etiqueta_color) : "";
        resp[0].etiqueta_fondo = resp[0].etiqueta_fondo ? ("#" + resp[0].etiqueta_fondo) : "";
        resp[0].color_leyenda = resp[0].color_leyenda ? ("#" + resp[0].color_leyenda) : "";
        resp[0].color_leyenda_fondo = resp[0].color_leyenda_fondo ? ("#" + resp[0].color_leyenda_fondo) : "";
        resp[0].color_fondo_barras = resp[0].color_fondo_barras ? ("#" + resp[0].color_fondo_barras) : "";
        resp[0].color_fondo = resp[0].color_fondo ? ("#" + resp[0].color_fondo) : "";
        resp[0].color_spiline = resp[0].color_spiline ? ("#" + resp[0].color_spiline) : "";
        resp[0].color_esperado = resp[0].color_esperado ? ("#" + resp[0].color_esperado) : "";
        resp[0].color_barra = resp[0].color_barra ? ("#" + resp[0].color_barra) : "";
        resp[0].color_barra_borde = resp[0].color_barra_borde ? ("#" + resp[0].color_barra_borde) : "";
        resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : resp[0].tipo_principal == "A" ? "area" : resp[0].tipo_principal == "S" ? "stackedBar" : "fullStackedBar";
        resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : resp[0].oee_tipo[0] == "A" ? "area" : resp[0].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
        resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : resp[0].oee_tipo[1] == "A" ? "area" : resp[1].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
        resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : resp[0].oee_tipo[2] == "A" ? "area" : resp[2].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
        resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
        let oee_colores = resp[0].oee_colores.split(";");
        resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
        resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
        resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";

        resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
        oee_colores = resp[0].oee_nombre.split(";");
        resp[0].oee_nombreFTQ = oee_colores[0];
        resp[0].oee_nombreEFI = oee_colores[1];
        resp[0].oee_nombreDIS = oee_colores[2];

      
        resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
        oee_colores = resp[0].esperado_esquema.split(";");
        resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
        resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
        resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
        resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
        oee_colores = resp[0].adicionales_colores.split(";");
        resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
        resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
        resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
        resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
        resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
        resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : "";    

        resp[0].adicionales = resp[0].adicionales ? resp[0].adicionales : "0;0;0;0;0;0;0";
        resp[0].adicionales = resp[0].adicionales == "NNNNNN" ? "0;0;0;0;0;0;0" : resp[0].adicionales;
        oee_colores = resp[0].adicionales.split(";");
        resp[0].adic1 = oee_colores[0] ? oee_colores[0] : "0";
        resp[0].adic2 = oee_colores[1] ? oee_colores[1] : "0";
        resp[0].adic3 = oee_colores[2] ? oee_colores[2] : "0";
        resp[0].adic4 = oee_colores[3] ? oee_colores[3] : "0";
        resp[0].adic5 = oee_colores[4] ? oee_colores[4] : "0";
        resp[0].adic6 = oee_colores[5] ? oee_colores[5] : "0";
        resp[0].adic7 = oee_colores[6] ? oee_colores[6] : "0";

        
        resp[0].adicionales_titulos = resp[0].adicionales_titulos ? resp[0].adicionales_titulos : ";;;;;";
        oee_colores = resp[0].adicionales_titulos.split(";");
        resp[0].tadic1 = oee_colores[0] ? oee_colores[0] : "";
        resp[0].tadic2 = oee_colores[1] ? oee_colores[1] : "";
        resp[0].tadic3 = oee_colores[2] ? oee_colores[2] : "";
        resp[0].tadic4 = oee_colores[3] ? oee_colores[3] : "";
        resp[0].tadic5 = oee_colores[4] ? oee_colores[4] : "";
        resp[0].tadic6 = oee_colores[5] ? oee_colores[5] : "";
      

        this.detalle = resp[0];
        
      }
      
    });

    sentencia = "SELECT titulo FROM " + this.servicio.rBD() + ".pu_graficos WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = 0;";
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length>0)
      {
        this.nGrafica = resp[0].titulo;
      }
      if (accion==0)
      {
        this.detalle = resp[0];
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "Se ha cancelado la edición de la gráfica";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    });
  }

  predeterminados()
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: "RECUPERAR VALORES PREDETERMINADOS", mensaje: "Esta acción recuperará los valores predeterminados de la gráfica sustituyendo los valores personalizados por el usuario.<br><br><strong>¿Desea continuar con la operación?</strong>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Recuperar valores", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_recuperar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result.accion)
      {
        if (result.accion == 1) 
        {
          let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_graficos WHERE grafico = " + (this.grActual * 100 + this.graficaActual) +  " AND usuario = 0";
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              this.botGuar = true;
              this.botCan = true;
              resp[0].oee_tipoFTQ = resp[0].oee_tipo[0];
              resp[0].oee_tipoEFI = resp[0].oee_tipo[1];
              resp[0].oee_tipoDIS = resp[0].oee_tipo[2];

              resp[0].oee_selFTQ = resp[0].oee[0] == "S";
              resp[0].oee_selEFI = resp[0].oee[1] == "S";
              resp[0].oee_selDIS = resp[0].oee[2] == "S";

              resp[0].oee_etiFTQ = resp[0].oee[3];
              resp[0].oee_etiEFI = resp[0].oee[4];
              resp[0].oee_etiDIS = resp[0].oee[5];
              resp[0].oee_etiFTQ = resp[0].oee_etiFTQ != "S" && resp[0].oee_etiFTQ != "N" ? "N" : resp[0].oee_etiFTQ;
              resp[0].oee_etiEFI = resp[0].oee_etiEFI != "S" && resp[0].oee_etiEFI != "N" ? "N" : resp[0].oee_etiEFI;
              resp[0].oee_etiDIS = resp[0].oee_etiDIS != "S" && resp[0].oee_etiDIS != "N" ? "N" : resp[0].oee_etiDIS;

              resp[0].color_letras = resp[0].color_letras ? ("#" + resp[0].color_letras) : "";
              resp[0].etiqueta_color = resp[0].etiqueta_color ? ("#" + resp[0].etiqueta_color) : "";
              resp[0].etiqueta_fondo = resp[0].etiqueta_fondo ? ("#" + resp[0].etiqueta_fondo) : "";
              resp[0].color_leyenda = resp[0].color_leyenda ? ("#" + resp[0].color_leyenda) : "";
              resp[0].color_leyenda_fondo = resp[0].color_leyenda_fondo ? ("#" + resp[0].color_leyenda_fondo) : "";
              resp[0].color_fondo_barras = resp[0].color_fondo_barras ? ("#" + resp[0].color_fondo_barras) : "";
              resp[0].color_fondo = resp[0].color_fondo ? ("#" + resp[0].etiqueta_fondo) : "";
              resp[0].color_spiline = resp[0].color_spiline ? ("#" + resp[0].color_spiline) : "";
              resp[0].color_esperado = resp[0].color_esperado ? ("#" + resp[0].color_esperado) : "";
              resp[0].color_barra = resp[0].color_barra ? ("#" + resp[0].color_barra) : "";
              resp[0].color_barra_borde = resp[0].color_barra_borde ? ("#" + resp[0].color_barra_borde) : "";

              resp[0].tipo_valor = resp[0].tipo_principal == "B" ? "bar" : resp[0].tipo_principal == "L" ? "spline" : resp[0].tipo_principal == "A" ? "area" : resp[0].tipo_principal == "S" ? "stackedBar" : "fullStackedBar";
              resp[0].tipo_valorFTQ = resp[0].oee_tipo[0] == "B" ? "bar" : resp[0].oee_tipo[0] == "L" ? "spline" : resp[0].oee_tipo[0] == "A" ? "area" : resp[0].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
              resp[0].tipo_valorEFI = resp[0].oee_tipo[1] == "B" ? "bar" : resp[0].oee_tipo[1] == "L" ? "spline" : resp[0].oee_tipo[1] == "A" ? "area" : resp[1].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
              resp[0].tipo_valorDIS = resp[0].oee_tipo[2] == "B" ? "bar" : resp[0].oee_tipo[2] == "L" ? "spline" : resp[0].oee_tipo[2] == "A" ? "area" : resp[2].oee_tipo == "S" ? "stackedBar" : "fullStackedBar";
              resp[0].oee_colores = resp[0].oee_colores ? resp[0].oee_colores : ";;";
              let oee_colores = resp[0].oee_colores.split(";");
              resp[0].colorFTQ = oee_colores[0] ? ("#" + oee_colores[0]) : "";
              resp[0].colorEFI = oee_colores[1] ? ("#" + oee_colores[1]) : "";
              resp[0].colorDIS = oee_colores[2] ? ("#" + oee_colores[2]) : "";

              resp[0].oee_nombre = resp[0].oee_nombre ? resp[0].oee_nombre : ";;";
              oee_colores = resp[0].oee_nombre.split(";");
              resp[0].oee_nombreFTQ = oee_colores[0];
              resp[0].oee_nombreEFI = oee_colores[1];
              resp[0].oee_nombreDIS = oee_colores[2];


              resp[0].esperado_esquema =!resp[0].esperado_esquema ? ";;" : resp[0].esperado_esquema;
              oee_colores = resp[0].esperado_esquema.split(";");
              resp[0].dividir_colores = oee_colores[0] ? oee_colores[0] : "N";
              resp[0].color_bajo = oee_colores[1] ? ("#" + oee_colores[1]) : "";
              resp[0].color_alto = oee_colores[2] ? ("#" + oee_colores[2]) : "";  
      
              resp[0].adicionales_colores = resp[0].adicionales_colores ? resp[0].adicionales_colores : ";;;;;";
              oee_colores = resp[0].adicionales_colores.split(";");
              resp[0].coladic1 = oee_colores[0] ? ("#" + oee_colores[0]) : "";
              resp[0].coladic2 = oee_colores[1] ? ("#" + oee_colores[1]) : "";
              resp[0].coladic3 = oee_colores[2] ? ("#" + oee_colores[2]) : "";    
              resp[0].coladic4 = oee_colores[3] ? ("#" + oee_colores[3]) : "";    
              resp[0].coladic5 = oee_colores[4] ? ("#" + oee_colores[4]) : "";    
              resp[0].coladic6 = oee_colores[5] ? ("#" + oee_colores[5]) : "";    

              resp[0].adicionales = resp[0].adicionales ? resp[0].adicionales : "0;0;0;0;0;0;0";
              resp[0].adicionales = resp[0].adicionales == "NNNNNN" ? "0;0;0;0;0;0;0" : resp[0].adicionales;
              oee_colores = resp[0].adicionales.split(";");
              resp[0].adic1 = oee_colores[0] ? oee_colores[0] : "0";
              resp[0].adic2 = oee_colores[1] ? oee_colores[1] : "0";
              resp[0].adic3 = oee_colores[2] ? oee_colores[2] : "0";
              resp[0].adic4 = oee_colores[3] ? oee_colores[3] : "0";
              resp[0].adic5 = oee_colores[4] ? oee_colores[4] : "0";
              resp[0].adic6 = oee_colores[5] ? oee_colores[5] : "0";
              resp[0].adic7 = oee_colores[6] ? oee_colores[6] : "0";

              
              resp[0].adicionales_titulos = resp[0].adicionales_titulos ? resp[0].adicionales_titulos : ";;;;;";
        
              oee_colores = resp[0].adicionales_titulos.split(";");
              resp[0].tadic1 = oee_colores[0] ? oee_colores[0] : "";
              resp[0].tadic2 = oee_colores[1] ? oee_colores[1] : "";
              resp[0].tadic3 = oee_colores[2] ? oee_colores[2] : "";
              resp[0].tadic4 = oee_colores[3] ? oee_colores[3] : "";
              resp[0].tadic5 = oee_colores[4] ? oee_colores[4] : "";
              resp[0].tadic6 = oee_colores[5] ? oee_colores[5] : "";
      
      
              this.detalle = resp[0];
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "Se han recuperado los valores predeterminados de la gráfica";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
            
          })
        }
      }
    });
    }

  cancelarF()
  {
    this.bot4Sel = false;
    this.botGuar = false;
    this.botCan = false;
    this.buscarGrafica(0);
  }  

  calcularPCT(arg: any)
  {
    return arg.valueText + "%";
  }

  calcularTotal(arg: any)
  {
    return arg.total;
  }

  calcularEscala(arg: any)
  {
    if (this.grActual == 2)
    {
        let tiempoSeg = Math.round(arg.value);
        let dias = Math.floor(tiempoSeg / 86400);
        let horas = Math.floor((tiempoSeg % 86400) / 3600);
        let minutos = Math.floor(((tiempoSeg % 86400) % 3600) / 60);
        let segundos = tiempoSeg % 60 ; 
        return (dias > 0 ? "(" + dias + "d) " : "") + horas + ":" + (minutos < 10 ? "0" + minutos : minutos) + ":" + (segundos < 10 ? "0" + segundos : segundos); 
    }
    else
    {
      return arg.valueText; 
    }
  }

  calcularHora(arg: any)
  {
    if (this.grActual == 2)
    {
      if (arg.seriesName = "Total")
      {
        let tiempoSeg = Math.round(arg.value);
        let dias = Math.floor(tiempoSeg / 86400);
        let horas = Math.floor((tiempoSeg % 86400) / 3600);
        let minutos = Math.floor(((tiempoSeg % 86400) % 3600) / 60);
        let segundos = tiempoSeg % 60 ; 
        return (dias > 0 ? "(" + dias + "d) " : "") + horas + ":" + (minutos < 10 ? "0" + minutos : minutos) + ":" + (segundos < 10 ? "0" + segundos : segundos);
      }
      else
      {
        return "";
      }
      
    }
    
  }

  calcularColor(arg: any) 
  {
    let seguir1 = false;
    let seguir2 = false;
    let seguir3 = false;
    if (this.grActual==2)
    {
      return;
    }
    if ((this.parGrafica.adic1 != 0 && this.parGrafica.coladic1) || (this.parGrafica.adic2 != 0 && this.parGrafica.coladic2) || (this.parGrafica.adic3 != 0 && this.parGrafica.coladic3) || (this.parGrafica.adic4 != 0 && this.parGrafica.coladic4) || (this.parGrafica.adic5 != 0 && this.parGrafica.coladic5) || (this.parGrafica.adic6 != 0 && this.parGrafica.coladic6))
    {
      seguir1 = true
    }
    if (this.parGrafica.valor_esperado && this.parGrafica.dividir_colores == "S" && this.parGrafica.color_alto && this.parGrafica.color_bajo)
    {
      seguir2 = true
    }
    if (!seguir2 && this.parGrafica.colores_multiples=="S")
    {
      seguir3 = true;
    }
    if (!seguir1 && !seguir2 && !seguir3)
    {
      return;
    }
    if (seguir2)
    {
      if(+arg.value > +this.parGrafica.valor_esperado ) {
        return { color: this.parGrafica.color_alto };
      }         
      else { 
        return { color: this.parGrafica.color_bajo };
      }
    }
    else if (seguir1)
    {
      if (arg.index == 0 && this.parGrafica.adic1 != 0 && this.parGrafica.coladic1)
      {
        return { color: this.parGrafica.coladic1};
      }
      else if (arg.index == 1 && this.parGrafica.adic2 != 0 && this.parGrafica.coladic2)
      {
        return { color: this.parGrafica.coladic2};
      }
      else if (arg.index == 2 && this.parGrafica.adic3 != 0 && this.parGrafica.coladic3)
      {
        return { color: this.parGrafica.coladic3};
      }
      else if (arg.index == 3 && this.parGrafica.adic4 != 0 && this.parGrafica.coladic4)
      {
        return { color: this.parGrafica.coladic4};
      }
      else if (arg.index == 4 && this.parGrafica.adic5 != 0 && this.parGrafica.coladic5)
      {
        return { color: this.parGrafica.coladic5};
      }
      else if (arg.index == 5 && this.parGrafica.adic6 != 0 && this.parGrafica.coladic6)
      {
        return { color: this.parGrafica.coladic6};
      }
      else if (seguir3)
      {
        return { color: this.coloresArreglo[arg.index % this.coloresArreglo.length]};
      }
    }
    else if (seguir3)
    {
      return { color: this.coloresArreglo[arg.index % this.coloresArreglo.length]};
      
    }
  }

  terminaGrafico(e: any)
  {
    setTimeout(() => {
      this.servicio.activarSpinnerSmall.emit(false);
      this.servicio.activarSpinner.emit(false);
    }, 200);
  }

}


