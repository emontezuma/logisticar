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
import { SesionComponent } from '../sesion/sesion.component';
import { ListKeyManager } from '@angular/cdk/a11y';
import { UP_ARROW, DOWN_ARROW, ENTER } from '@angular/cdk/keycodes';
import { DxChartComponent } from "devextreme-angular";
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
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
    trigger('aparecer', [
      transition(':enter', [
        style({ opacity: 0.3 }),
        animate('0.2s', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.2s', style({ opacity: 0 }))
      ])
    ]),
    trigger('arriba', [
    transition(':enter', [
      style({ opacity: 0.5, transform: 'scale(0.9)' }),
      animate('0.1s', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
      animate('0.1s', style({ opacity: 0.5, transform: 'scale(0.9)' }))
    ])
  ]),]
})


export class PanelComponent implements OnInit {

  @ViewChild("txtBuscar") txtBuscar: ElementRef;
  @ViewChild("txtNombre") txtNombre: ElementRef;
  @ViewChild("txtDesde") txtDesde: ElementRef;
  @ViewChild("txtHasta") txtHasta: ElementRef;
  @ViewChild(DxChartComponent) chart: DxChartComponent;
  @ViewChild("listaLineas") listaLineas: MatSelectionList;
  @ViewChild("listaMaquinas") listaMaquinas: MatSelectionList;
  @ViewChild("listaAreas") listaAreas: MatSelectionList;
  @ViewChild("listaFallas") listaFallas: MatSelectionList;
  @ViewChild("listaTecnicos") listaTecnicos: MatSelectionList;
  
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
    private viewportRuler: ViewportRuler
  ) {

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
      if (this.router.url.substr(0, 6) == "/panel")
      {
        
        this.colorear();

      }
      
    });

    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 6) == "/panel")
      {
        this.cadaSegundo();
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
        else if (accion==1030)
        {
          this.grActual = 3;
        }
        this.graficar(this.grActual)
        this.iniLeerBD()
      }
    });
    this.servicio.mostrarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 6) == "/panel")
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
    else if (accion==1030)
    {
      this.grActual = 3;
    }
    this.colorear();
    this.rConfiguracion();    
  }

  ngOnInit() {
    this.servicio.validarLicencia(1)
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
    this.servicio.mensajeInferior.emit("Panel de control");
  }

  idGrafico: number = 0;
  cadSQLActual: string = "";
  modelo: number  = 1;
  alarmados: number  = 0;
  offSet: number;
  verIrArriba: boolean = false;
  yaVer: boolean = false;
  noMostrar: boolean = false;
  primeraVez: boolean = true;
  animadoEFI: boolean = true
  etiBuscar: string = "Buscar línea";
  noLeer: boolean = false;
  arreImagenes: any = [];
  arreTiempos: any = [];
  arreHover: any = [];
  arreIndicadores = [];
  colores: any = [];
  segLinea: number = 0;
  muestra: number = 0;

  hayFiltro: boolean = false
  eliminar: boolean = false;
  editando: boolean = false;
  graficando: boolean = true;
  borde_boton: string = this.servicio.rColores().borde_boton;
  verBuscar: boolean = true;
  verTabla: boolean = false;
  cambioVista: boolean = true;
  soloAlarmados: boolean = true;
  parIndicador: string = "1.0-2"
  lit_EFI: string = "OEE";

  movil: boolean = false;
  verGrafico: boolean = false;
  verTop: boolean = this.servicio.rUsuario().preferencias_andon.substr(40, 1) == "1";
  
  ultimaActualizacion = new Date();
  altoGrafica: number = this.servicio.rPantalla().alto - 156 - (this.verTop ? 94 : 0);
  anchoGrafica: number = this.servicio.rPantalla().ancho - this.servicio.rAnchoSN() - 80;
  errorTitulo: string = "Ocurrió un error durante la conexión al servidor";
  errorMensaje: string = "";
  textoBuscar: string = "";
  colorEFI: string = "yellowgreen";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  graficaActual: number = 1;
  iconoGeneral: string = "";
  icono_grafica: string = "";
  tituloReporte: string = "";
  nombreReporte: string = "";
  nombreFile: string = "";
  iconoVista: string = "";
  sentenciaR: string = "";
  fDesde: string = "";
  fHasta: string = "";
  fDesdeY: string = "";
  fHastaY: string = "";
  elTiempo: number = 0;
  botElim: boolean = false;
  botGuar: boolean = false;
  botCan: boolean = false;
  contarTiempo: boolean = false;
  visualizarImagen: boolean = false;
  sondeo: number = 0;
  registros: any = [];
  opciones: any = [];
  arrFiltrado: any = [];
  configuracion: any = [];
  parGrafica: any = [];
  miGrafica: any = [];
  cronometro: any;
  leeBD: any;
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  hoverp03: boolean = false;
  descargarD: boolean = false;
  derecha: boolean = false;

  mensajePadre: string = "";
  URL_BASE = "/sigma/api/upload.php"
  URL_IMAGENES = "/assets/imagenes/";
  mostrarDetalle: boolean = false;
  grActual: number = 1; //+this.servicio.rUsuario().preferencias_andon.substr(41, 1);

  
  maxmin: {startValue: "0", endValue: "20"};
  maxmin_o: {startValue: "0", endValue: "20"};

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
      this.modelo = this.modelo > 10 ? this.modelo - 10 : this.modelo;
    }
  }

  

  
  rConfiguracion()
  {    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        if (resp[0].bajo_color)
        {
          resp[0].bajo_color = "#" + resp[0].bajo_color;  
        }
        else
        {
          resp[0].bajo_color = "#FF0000";
        }
        if (resp[0].medio_color)
        {
          resp[0].medio_color = "#" + resp[0].medio_color;  
        }
        else
        {
          resp[0].medio_color = "#FFCC00";
        }
        if (resp[0].alto_color)
        {
          resp[0].alto_color = "#" + resp[0].alto_color;  
        }
        else
        {
          resp[0].alto_color = "#00FF00";
        }
        this.configuracion = resp[0]; 
        if (this.primeraVez)
        {
          this.iniLeerBD()
          this.graficar(this.grActual);
          this.primeraVez = false;
        }
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  
  leerBD()
  {
    
    if (this.noLeer || this.router.url.substr(0, 6) != "/panel")
    {
      return;
    }
    this.servicio.activarSpinnerSmall.emit(true);     
    this.rConfiguracion();
    let campos = {accion: 100, sentencia: this.cadSQLActual};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.servicio.activarSpinnerSmall.emit(false);     
      this.arrFiltrado = resp;
      let arreTemp: any = this.arrFiltrado;
      if (this.hayFiltro)
      {
        arreTemp = this.aplicarFiltro(this.textoBuscar);
      }
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
        else if (this.grActual == 1)
        {
          //for (var i = 0; i < this.registros.length; i++)
          for (i = this.registros.length - 1; i >= 1; i--)
          {
            let hallado = false;
            for (var j = 0; j < arreTemp.length; j++)
            {
              if (this.registros[i].linea ==  arreTemp[j].linea)
              {
                if (this.registros[i].tmaquinas !=  arreTemp[j].tmaquinas || this.registros[i].paros_m !=  arreTemp[j].paros_m || this.registros[i].docs_m !=  arreTemp[j].docs_m || this.registros[i].produccion_m !=  arreTemp[j].produccion_m || this.registros[i].calidad_m !=  arreTemp[j].calidad_m || this.registros[i].disponible_m !=  arreTemp[j].disponible_m || this.registros[i].reportest !=  arreTemp[j].reportest || this.registros[i].reporteid !=  arreTemp[j].reporteid || this.registros[i].tiempo_c_m !=  arreTemp[j].tiempo_c_m || this.registros[i].tdisponible_m !=  arreTemp[j].tdisponible_m || this.registros[i].mttrc_m !=  arreTemp[j].mttrc_m || this.registros[i].mtbfc_m !=  arreTemp[j].mtbfc_m)
                {
                  this.registros[i].tmaquinas = arreTemp[j].tmaquinas;
                  this.registros[i].paros_m = arreTemp[j].paros_m;
                  this.registros[i].produccion_m = arreTemp[j].produccion_m;
                  this.registros[i].calidad_m = arreTemp[j].calidad_m;
                  this.registros[i].disponible_m = arreTemp[j].disponible_m;
                  this.registros[i].reportest = arreTemp[j].reportest;
                  this.registros[i].reporteid = arreTemp[j].reporteid;
                  this.registros[i].narea = arreTemp[j].narea;
                  this.registros[i].reportefecha = arreTemp[j].reportefecha;
                  this.registros[i].reportests = arreTemp[j].reportests;
                  this.registros[i].tiempo_c_m = arreTemp[j].tiempo_c_m;
                  this.registros[i].tdisponible_m = arreTemp[j].tdisponible_m;
                  this.registros[i].mttrc_m = arreTemp[j].mttrc_m;
                  this.registros[i].mtbfc_m = arreTemp[j].mtbfc_m;
                  this.registros[i].docs_m = arreTemp[j].docs_m;
                  this.registros[i].mttrc_y = arreTemp[j].mttrc_y;
                  this.registros[i].mtbfc_y = arreTemp[j].mtbfc_y;
                  this.registros[i].docs_y = arreTemp[j].docs_y;
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
            for (var j = 1; j < this.registros.length; j++)
            {
              if (this.registros[j].linea == arreTemp[i].linea)
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
        else if (this.grActual == 2)
        {
          //for (var i = 0; i < this.registros.length; i++)
          for (i = this.registros.length - 1; i >= 1; i--)
          {
            let hallado = false;
            for (var j = 0; j < arreTemp.length; j++)
            {
              if (this.registros[i].id ==  arreTemp[j].id)
              {
                if (this.registros[i].paros_m !=  arreTemp[j].paros_m || this.registros[i].docs_m !=  arreTemp[j].docs_m || this.registros[i].produccion_m !=  arreTemp[j].produccion_m || this.registros[i].calidad_m !=  arreTemp[j].calidad_m || this.registros[i].disponible_m !=  arreTemp[j].disponible_m || this.registros[i].reportest !=  arreTemp[j].reportest || this.registros[i].reporteid !=  arreTemp[j].reporteid || this.registros[i].tiempo_c_m !=  arreTemp[j].tiempo_c_m || this.registros[i].tdisponible_m !=  arreTemp[j].tdisponible_m || this.registros[i].mttrc_m !=  arreTemp[j].mttrc_m || this.registros[i].mtbfc_m !=  arreTemp[j].mtbfc_m)
                {
                  this.registros[i].paros_m = arreTemp[j].paros_m;
                  this.registros[i].produccion_m = arreTemp[j].produccion_m;
                  this.registros[i].calidad_m = arreTemp[j].calidad_m;
                  this.registros[i].disponible_m = arreTemp[j].disponible_m;
                  this.registros[i].reportest = arreTemp[j].reportest;
                  this.registros[i].reporteid = arreTemp[j].reporteid;
                  this.registros[i].narea = arreTemp[j].narea;
                  this.registros[i].reportefecha = arreTemp[j].reportefecha;
                  this.registros[i].reportests = arreTemp[j].reportests;
                  this.registros[i].tiempo_c_m = arreTemp[j].tiempo_c_m;
                  this.registros[i].tdisponible_m = arreTemp[j].tdisponible_m;
                  this.registros[i].mttrc_m = arreTemp[j].mttrc_m;
                  this.registros[i].mtbfc_m = arreTemp[j].mtbfc_m;
                  this.registros[i].docs_m = arreTemp[j].docs_m;
                  this.registros[i].mttrc_y = arreTemp[j].mttrc_y;
                  this.registros[i].mtbfc_y = arreTemp[j].mtbfc_y;
                  this.registros[i].docs_y = arreTemp[j].docs_y;
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
            for (var j = 1; j < this.registros.length; j++)
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
        else if (this.grActual == 3)
        {
          //for (var i = 0; i < this.registros.length; i++)
          for (i = this.registros.length - 1; i >= 1; i--)
          {
            let hallado = false;
            for (var j = 0; j < arreTemp.length; j++)
            {
              if (this.registros[i].id ==  arreTemp[j].id)
              {
                if (this.registros[i].docs_m !=  arreTemp[j].docs_m || this.registros[i].reportest !=  arreTemp[j].reportest || this.registros[i].reporteid !=  arreTemp[j].reporteid || this.registros[i].tdisponible !=  arreTemp[j].tdisponible || this.registros[i].mttrc_m !=  arreTemp[j].mttrc_m || this.registros[i].mtbfc_m !=  arreTemp[j].mtbfc_m)
                {
                  this.registros[i].reportest = arreTemp[j].reportest;
                  this.registros[i].reporteid = arreTemp[j].reporteid;
                  this.registros[i].reportefecha = arreTemp[j].reportefecha;
                  this.registros[i].reportests = arreTemp[j].reportests;
                  this.registros[i].tdisponible_m = arreTemp[j].tdisponible_m;
                  this.registros[i].mttrc_m = arreTemp[j].mttrc_m;
                  this.registros[i].mtbfc_m = arreTemp[j].mtbfc_m;
                  this.registros[i].docs_m = arreTemp[j].docs_m;
                  this.registros[i].mttrc_y = arreTemp[j].mttrc_y;
                  this.registros[i].mtbfc_y = arreTemp[j].mtbfc_y;
                  this.registros[i].docs_y = arreTemp[j].docs_y;
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
            for (var j = 1; j < this.registros.length; j++)
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
        this.calcularIndicadores();
        this.contarRegs()
      }
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 6) == "/panel")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD()
        }, +this.elTiempo);
      }
  
    })
  }

  calcularIndicadores()
  {
    let t01 = 0;
    let t02 = 0;
    let t03 = 0;
    let t04 = 0;
    let t05 = 0;
    let t06 = 0;
    let t07 = 0;
    let t08 = 0;
    let t09 = 0;

    let t10 = 0;
    let t11 = 0;
    let t12 = 0;
    let t13 = 0;
    let t14 = 0;
    let t15 = 0;
    let t16 = 0;
    let t17 = 0;
    let t18 = 0;
    let t19 = 0;
    let t20 = 0;
    let t21 = 0;
    let t22 = 0;

    let uFecha;
    let uArea: string = "";
    let uReporte: number = 0;

    this.arreIndicadores = [];
    for (var i = 0; i < this.registros.length; i++)
    {
      if (this.registros[i].linea != -1)
      {
        t01 = t01 + +this.registros[i].tmaquinas;
        t02 = t02 + +this.registros[i].paros_m;
        t03 = t03 + +this.registros[i].produccion_m;
        t04 = t04 + +this.registros[i].calidad_m;
        t05 = t05 + +this.registros[i].disponible_m;
        t06 = t06 + +this.registros[i].reportest;
        t07 = t07 + +this.registros[i].tdias_m;
        t08 = t08 + +this.registros[i].tiempo_c_m;
        t09 = t09 + +this.registros[i].docs_m;
        t10 = t10 + +this.registros[i].tdisponible_m;

        t11 = t11 + +this.registros[i].paros_y;
        t12 = t12 + +this.registros[i].produccion_y;
        t13 = t13 + +this.registros[i].calidad_y;
        t14 = t14 + +this.registros[i].disponible_y;
        t15 = t15 + +this.registros[i].tdias_y;
        t16 = t16 + +this.registros[i].tiempo_c_y;
        t17 = t17 + +this.registros[i].docs_y;
        t18 = t18 + +this.registros[i].tdisponible_y;   
        t19 = t19 + +this.registros[i].piezas_m;   
        t20 = t20 + +this.registros[i].rechazos_m;   
        t21 = t21 + +this.registros[i].piezas_y;   
        t22 = t22 + +this.registros[i].rechazos_y;        
      }

      if (this.registros[i].reportefecha)
        {
          if (!uFecha)
          {
            uFecha = this.registros[i].reportefecha;
            uArea = this.registros[i].narea ? this.registros[i].narea : this.registros[i].nombre;
            uReporte = this.registros[i].reporteid;
          }
          else if (uFecha < this.registros[i].reportefecha)
          {
            uFecha = this.registros[i].reportefecha;
            uArea = this.registros[i].narea ? this.registros[i].narea : this.registros[i].nombre;
            uReporte = this.registros[i].reporteid;
          }
        }
      if (this.grActual != 3)
      {
        this.arreIndicadores.splice(i, 0, {efi_m: 0, oee_m: 0, dis_m: 0, ftq_m: 0, efi_y: 0, oee_y: 0, dis_y: 0, ftq_y: 0} );
        this.arreIndicadores[i].efi_m = 0;
        this.arreIndicadores[i].dis_m = 0;
        this.arreIndicadores[i].ftq_m = 0;
        this.arreIndicadores[i].oee_m = 0;
        this.arreIndicadores[i].efi_y = 0;
        this.arreIndicadores[i].dis_y = 0;
        this.arreIndicadores[i].ftq_y = 0;
        this.arreIndicadores[i].oee_y = 0;
        if (this.registros[i].disponible_m > 0)
        {
          this.arreIndicadores[i].dis_m = (+this.registros[i].disponible_m - +this.registros[i].paros_m) / +this.registros[i].disponible_m * 100;    
          this.arreIndicadores[i].dis_m = this.arreIndicadores[i].dis_m > 100 ? 100 : this.arreIndicadores[i].dis_m;
        }
        if ((+this.registros[i].disponible_m - +this.registros[i].paros_m) > 0)
        {
          this.arreIndicadores[i].efi_m = +this.registros[i].produccion_m / (+this.registros[i].disponible_m - +this.registros[i].paros_m) * 100;        
          this.arreIndicadores[i].efi_m = this.arreIndicadores[i].efi_m > 100 ? 100 : this.arreIndicadores[i].efi_m;
        }
        if (this.registros[i].produccion_m > 0)
        {
          this.arreIndicadores[i].ftq_m = (+this.registros[i].produccion_m - +this.registros[i].calidad_m) / +this.registros[i].produccion_m * 100;        
          this.arreIndicadores[i].ftq_m = this.arreIndicadores[i].ftq_m > 100 ? 100 : this.arreIndicadores[i].ftq_m;
        }
        this.arreIndicadores[i].oee_m = +this.arreIndicadores[i].dis_m * +this.arreIndicadores[i].efi_m * +this.arreIndicadores[i].ftq_m / 10000;
        ///
        if (this.registros[i].disponible_y > 0)
        {
          this.arreIndicadores[i].dis_y = (+this.registros[i].disponible_y - +this.registros[i].paros_y) / +this.registros[i].disponible_y * 100;    
          this.arreIndicadores[i].dis_y = this.arreIndicadores[i].dis_y > 100 ? 100 : this.arreIndicadores[i].dis_y;
  
        }
        if ((+this.registros[i].disponible_y - +this.registros[i].paros_y) > 0)
        {
          this.arreIndicadores[i].efi_y = +this.registros[i].produccion_y / (+this.registros[i].disponible_y - +this.registros[i].paros_y) * 100;        
          this.arreIndicadores[i].efi_y = this.arreIndicadores[i].efi_y > 100 ? 100 : this.arreIndicadores[i].efi_y;
        }
        if (this.registros[i].produccion_y > 0)
        {
          this.arreIndicadores[i].ftq_y = (+this.registros[i].produccion_y - +this.registros[i].calidad_y) / +this.registros[i].produccion_y * 100;        
          this.arreIndicadores[i].ftq_y = this.arreIndicadores[i].ftq_y > 100 ? 100 : this.arreIndicadores[i].ftq_y;
        }
        this.arreIndicadores[i].oee_y = +this.arreIndicadores[i].dis_y * +this.arreIndicadores[i].efi_y * +this.arreIndicadores[i].ftq_y / 10000;
      }
      
    }
    //Se agrega el último
    if (this.registros[0].linea != -1)
    {
      this.registros.splice(0, 0, {linea: -1, nombre: 'TOTAL PLANTA', tmaquinas: 0, paros_m: 0, produccion_m: 0, piezas_m: 0, rechazos_m: 0, calidad_m: 0, disponible_m: 0, reportest: 0, tdias_m: 0, tiempo_c_m: 0, docs_m: 0, tdisponible_m: 0, paros_y: 0, produccion_y: 0, piezas_y: 0, rechazos_y: 0, calidad_y: 0, disponible_y: 0, tdias_y: 0, tiempo_c_y: 0, docs_y: 0, tdisponible_y: 0, mttrc_m: 0, mttrc_y: 0, mtbfc_m: 0, mtbfc_y: 0, reportefecha: uFecha, narea: uArea, reporteid: uReporte });

    }
    
    this.registros[0].reportefecha = uFecha;
    this.registros[0].narea = uArea;
    this.registros[0].reporteid = uReporte;
    this.registros[0].tmaquinas = t01;
    this.registros[0].paros_m = t02;
    this.registros[0].produccion_m = t03;
    this.registros[0].calidad_m = t04;
    this.registros[0].disponible_m = t05;
    this.registros[0].reportest = t06;
    this.registros[0].tdias_m = t07;
    this.registros[0].tiempo_c_m = t08;
    this.registros[0].docs_m = t09;
    this.registros[0].tdisponible_m = t10;
    this.registros[0].paros_y = t11;
    this.registros[0].produccion_y = t12;
    this.registros[0].calidad_y = t13;
    this.registros[0].disponible_y = t14;
    this.registros[0].tdias_y = t15;
    this.registros[0].tiempo_c_y = t16;
    this.registros[0].docs_y = t17;
    this.registros[0].tdisponible_y = t18;
    this.registros[0].piezas_m = t19;
    this.registros[0].rechazos_m = t20;
    this.registros[0].piezas_y = t21;
    this.registros[0].rechazos_y = t22;
    this.registros[0].mttrc_m = this.registros[0].docs_m == 0 ? 0 : this.registros[0].tiempo_c_m / this.registros[0].docs_m / 3600;
    this.registros[0].mttrc_y = this.registros[0].docs_y == 0 ? 0 : this.registros[0].tiempo_c_y / this.registros[0].docs_y / 3600;
    this.registros[0].mtbfc_m = this.registros[0].tdisponible_m / (this.registros[0].docs_m + 1) / 3600;
    this.registros[0].mtbfc_y = this.registros[0].tdisponible_y / (this.registros[0].docs_y + 1) / 3600;
    if (this.grActual != 3)
    {
      this.arreIndicadores.splice(this.registros.length, 0, {efi_m: 0, oee_m: 0, dis_m: 0, ftq_m: 0, efi_y: 0, oee_y: 0, dis_y: 0, ftq_y: 0} );
      this.arreIndicadores[0].efi_m = 0;
      this.arreIndicadores[0].dis_m = 0;
      this.arreIndicadores[0].ftq_m = 0;
      this.arreIndicadores[0].oee_m = 0;
      this.arreIndicadores[0].efi_y = 0;
      this.arreIndicadores[0].dis_y = 0;
      this.arreIndicadores[0].ftq_y = 0;
      this.arreIndicadores[0].oee_y = 0;
      if (this.registros[0].disponible_m > 0)
      {
        this.arreIndicadores[0].dis_m = (+this.registros[0].disponible_m - +this.registros[0].paros_m) / +this.registros[0].disponible_m * 100;    
        this.arreIndicadores[0].dis_m = this.arreIndicadores[0].dis_m > 100 ? 100 : this.arreIndicadores[0].dis_m;
  
      }
      if ((+this.registros[0].disponible_m - +this.registros[0].paros_m) > 0)
      {
        this.arreIndicadores[0].efi_m = +this.registros[0].produccion_m / (+this.registros[0].disponible_m - +this.registros[0].paros_m) * 100;        
        this.arreIndicadores[0].efi_m = this.arreIndicadores[0].efi_m > 100 ? 100 : this.arreIndicadores[0].efi_m;
      }
      if (this.registros[0].produccion_m > 0)
      {
        this.arreIndicadores[0].ftq_m = (+this.registros[0].produccion_m - +this.registros[0].calidad_m) / +this.registros[0].produccion_m * 100;        
        this.arreIndicadores[0].ftq_m = this.arreIndicadores[0].ftq_m > 100 ? 100 : this.arreIndicadores[0].ftq_m;
      }
      this.arreIndicadores[0].oee_m = +this.arreIndicadores[0].dis_m * +this.arreIndicadores[0].efi_m * +this.arreIndicadores[0].ftq_m / 10000;
      ///
      if (this.registros[0].disponible_y > 0)
      {
        this.arreIndicadores[0].dis_y = (+this.registros[0].disponible_y - +this.registros[0].paros_y) / +this.registros[0].disponible_y * 100;    
        this.arreIndicadores[0].dis_y = this.arreIndicadores[0].dis_y > 100 ? 100 : this.arreIndicadores[0].dis_y;
  
      }
      if ((+this.registros[0].disponible_y - +this.registros[0].paros_y) > 0)
      {
        this.arreIndicadores[0].efi_y = +this.registros[0].produccion_y / (+this.registros[0].disponible_y - +this.registros[0].paros_y) * 100;        
        this.arreIndicadores[0].efi_y = this.arreIndicadores[0].efi_y > 100 ? 100 : this.arreIndicadores[0].efi_y;
      }
      if (this.registros[0].produccion_y > 0)
      {
        this.arreIndicadores[0].ftq_y = (+this.registros[0].produccion_y - +this.registros[0].calidad_y) / +this.registros[0].produccion_y * 100;        
        this.arreIndicadores[0].ftq_y = this.arreIndicadores[0].dis_y > 100 ? 100 : this.arreIndicadores[0].dis_y;
      }
      this.arreIndicadores[0].oee_y = +this.arreIndicadores[0].dis_y * +this.arreIndicadores[0].efi_y * +this.arreIndicadores[0].ftq_y / 10000;
    }
    //Se agrega el registro en el arreglo general
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


  exportar()
  {
    let resp = [];
    if (this.grActual!= 3)
    {
      resp.splice(i, 0, {nombre: "Nombre de la linea", referencia: "Referencia de la linea", linea: "ID de la linea", tmaquinas: "Total maquinas asociadas", paros_m: "Tiempo total de paro MTD (seg)", produccion_m: "Tiempo total de produccion MTD (seg)", piezas_m: "Piezas producidas", calidad_m: "Tiempo total de piezas rechazadas MTD (seg)", rechazos_m: "Piezas rechazadas", disponible_m: "Tiempo total disponible MTD (seg)", tdias_m: "Total dias MTD", oee_m: "OEE MTD", dis_m: "Disponibilidad MTD", ftq_m: "FTQ MTD", efi_m: "Eficiencia MTD", tiempo_c_m: "Andon tiempo total de reparaciones MTD (seg)", docs_m: "Andon total fallas MTD (seg)", tdisponible_m: "Andon tiempo total de disponibilidad MTD (seg)", mttrc_m: "MTTR MTD (Hr)", mtbfc_m: "MTBF MTD (Hr)", paros_y: "Tiempo total de paro YTD (seg)", produccion_y: "Tiempo total de produccion YTD (seg)", piezas_y: "Piezas producidas", calidad_y: "Tiempo total de piezas rechazadas YTD (seg)", rechazos_y: "Piezas rechazadas", disponible_y: "Tiempo total disponible YTD (seg)", tdias_y: "Total dias YTD", oee_y: "OEE YTD", dis_y: "Disponibilidad YTD", ftq_y: "FTQ YTD", efi_y: "Eficiencia YTD", tiempo_c_y: "Andon tiempo total de reparaciones YTD (seg)", docs_y: "Andon total fallas YTD (seg)", tdisponible_y: "Andon tiempo total de disponibilidad YTD (seg)", mttrc_y: "MTTR YTD (Hr)", mtbfc_y: "MTBF YTD (Hr)" });
      for (var i = 0; i < this.registros.length; i++)
      {
        resp.splice(i + 1, 0, {nombre: this.registros[i].nombre, referencia: this.registros[i].referencia, linea: this.registros[i].linea, tmaquinas: this.registros[i].tmaquinas, paros_m: this.registros[i].paros_m, produccion_m: this.registros[i].produccion_m, piezas_m: this.registros[i].piezas_m, calidad_m: this.registros[i].calidad_m, rechazos_m: this.registros[i].rechazos_m, disponible_m: this.registros[i].disponible_m, tdias_m: this.registros[i].tdias_m, oee_m: this.arreIndicadores[i].oee_m, dis_m: this.arreIndicadores[i].dis_m, ftq_m: this.arreIndicadores[i].ftq_m, efi_m: this.arreIndicadores[i].efi_m, tiempo_c_m: this.registros[i].tiempo_c_m, docs_m: this.registros[i].docs_m, tdisponible_m: this.registros[i].tdisponible_m, mttrc_m: this.registros[i].mttrc_m, mtbfc_m: this.registros[i].mtbfc_m, paros_y: this.registros[i].paros_y, produccion_y: this.registros[i].produccion_y, piezas_y: this.registros[i].piezas_y, calidad_y: this.registros[i].calidad_y, rechazos_y: this.registros[i].rechazos_y, disponible_y: this.registros[i].disponible_y, tdias_y: this.registros[i].tdias_y, oee_y: this.arreIndicadores[i].oee_y, dis_y: this.arreIndicadores[i].dis_y, ftq_y: this.arreIndicadores[i].ftq_y, efi_y: this.arreIndicadores[i].efi_y, tiempo_c_y: this.registros[i].tiempo_c_y, docs_y: this.registros[i].docs_y, tdisponible_y: this.registros[i].tdisponible_y, mttrc_y: this.registros[i].mttrc_y, mtbfc_y: this.registros[i].mtbfc_y })
      }    
    }
    else
    {
      resp.splice(i, 0, {nombre: "Nombre del area", referencia: "Referencia del area", linea: "ID del area", tdias: "Total dias MTD", docs_m: "Andon total fallas MTD (seg)", tiempo_c_m: "Andon tiempo total de reparaciones MTD (seg)", tdisponible_m: "Andon tiempo total de disponibilidad MTD (seg)", mttrc_m: "MTTR MTD (Hr)", mtbfc_m: "MTBF MTD (Hr)", tdias_y: "Total dias YTD", docs_y: "Andon total fallas YTD (seg)", tiempo_c_y: "Andon tiempo total de reparaciones MTD (seg)", tdisponible_y: "Andon tiempo total de disponibilidad YTD (seg)", mttrc_y: "MTTR YTD (Hr)", mtbfc_y: "MTBF YTD (Hr)" });
      for (var i = 0; i < this.registros.length; i++)
      {
        resp.splice(i + 1, 0, {nombre: this.registros[i].nombre, referencia: this.registros[i].referencia, linea: this.registros[i].id, tdias: this.registros[i].tdias, docs_m: this.registros[i].docs_m, tiempo_c_m: this.registros[i].tiempo_c_m, tdisponible_m: this.registros[i].tdisponible_m, mttrc_m: this.registros[i].mttrc_m, mtbfc_m: this.registros[i].mtbfc_m, tdias_y: this.registros[i].tdias_y, docs_y: this.registros[i].docs_y, tiempo_c_y: this.registros[i].tiempo_c_y, tdisponible_y: this.registros[i].tdisponible_y, mttrc_y: this.registros[i].mttrc_y, mtbfc_y: this.registros[i].mtbfc_y })
      }
    }
    this.servicio.generarReporte(resp, this.tituloReporte, this.nombreReporte + ".csv")
  }
    
  graficar(id: number)
  {
    this.servicio.activarSpinner.emit(true);     
    this.modelo = 11;
    if (id == 3 && this.configuracion.modulo_oee=='S')
    {
      setTimeout(() => {
        this.yaVer = true;
      }, 300);
    }
    else
    {
      this.yaVer = false;
    }
    this.grActual = id;
    
      let sentencia = "";
      let ordenDatos = " 10 DESC, 1";
      this.iconoGeneral = "i_lineas"
      this.etiBuscar = "Buscar línea"
      this.literalSingular = "línea"
      this.literalPlural = "líneas"        
      if (this.configuracion.modulo_oee=="S")
      {
        this.tituloReporte = "OEE y Andon por linea";
        this.nombreReporte = "andon_y_oee_linea.csv";
      }
      else
      {
        this.tituloReporte = "Andon por linea";
        this.nombreReporte = "andon_linea.csv";
      }
      
      this.crearFiltro();
      sentencia = "SELECT * FROM (SELECT IFNULL(b.nombre, 'N/A') AS nombre, b.referencia, b.imagen, a.linea, COUNT(a.id) AS tmaquinas, IFNULL(SUM(i.paros), 0) AS paros_m, IFNULL(SUM(i.produccion), 0) AS produccion_m, IFNULL(SUM(i.piezas), 0) AS piezas_m, IFNULL(SUM(i.rechazos), 0) AS rechazos_m, IFNULL(SUM(i.calidad), 0) AS calidad_m, IFNULL(SUM(i.disponible), 0) AS disponible_m, IFNULL(d.reportest, 0) AS reportest, d.reporteid, h.reportefecha, h.reportests, IFNULL(h.narea, '') AS narea, e.tdias_m, IFNULL(c.totaltiempo, 0) AS tiempo_c_m, c.totalrep AS docs_m, SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) AS tdisponible_m, IFNULL(c.totaltiempo / 3600 / c.totalrep, 0) AS mttrc_m, (SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) - IFNULL(SUM(f.tiempo), 0) / (IFNULL(c.totalrep, 0) + 1)) / 3600 AS mtbfc_m FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id LEFT JOIN (SELECT c.maquina, COUNT(*) AS totalrep, SUM(c.tiemporeparacion + c.tiempollegada) AS totaltiempo FROM " + this.servicio.rBD() + ".reportes c WHERE c.contabilizar = 'S' AND c.estatus >= 100  AND c.fecha_reporte >= '" + this.fDesde + "' AND c.fecha_reporte <= '" + this.fHasta + "' GROUP BY c.maquina) AS c ON a.id = c.maquina LEFT JOIN (SELECT d.linea, COUNT(*) AS reportest, MAX(d.id) AS reporteid FROM " + this.servicio.rBD() + ".reportes d WHERE d.contabilizar = 'S' AND d.estatus <= 10 GROUP BY d.linea) AS d ON a.linea = d.linea LEFT JOIN (SELECT IF(h.estatus = 0, h.fecha, h.inicio_atencion) reportefecha, h.estatus AS reportests, h.id, g.nombre AS narea FROM " + this.servicio.rBD() + ".reportes h LEFT JOIN " + this.servicio.rBD() + ".cat_destinos g ON h.AREA = g.id WHERE h.contabilizar = 'S' AND h.estatus <= 10) AS h ON d.reporteid = h.id LEFT JOIN (SELECT maquina, tiempo FROM " + this.servicio.rBD() + ".detalleparos f WHERE f.contabilizar = 'S'  AND f.fecha >= '" + this.fDesde + "' AND f.fecha <= '" + this.fHasta + "'  AND f.tipo = 1) AS f ON c.maquina = f.maquina LEFT JOIN (SELECT i.equipo, SUM((SELECT SUM(tiempo) AS tparos FROM " + this.servicio.rBD() + ".detalleparos_info WHERE estatus = 'A' AND corte = i.id AND tipo = 'C')) AS paros, SUM(i.produccion_tc) AS produccion, SUM(i.produccion) AS piezas, SUM(i.calidad) AS rechazos, SUM(i.tiempo_disponible) disponible, SUM(i.calidad_tc) AS calidad  FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.id > 0 AND i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' GROUP BY i.equipo) AS i ON i.equipo = a.id, (SELECT COUNT(*) AS tdias_m, SUM(IF(dia = 2, 1, 0)) AS lunes, SUM(IF(dia = 3, 1, 0)) AS martes, SUM(IF(dia = 4, 1, 0)) AS miercoles, SUM(IF(dia = 5, 1, 0)) AS jueves, SUM(IF(dia = 6, 1, 0)) AS viernes, SUM(IF(dia = 7, 1, 0)) AS sabado, SUM(IF(dia = 1, 1, 0)) AS domingo FROM " + this.servicio.rBD() + ".dias WHERE  fecha >= '" + this.fDesde + "' AND fecha <= '" + this.fHasta + "' ) AS e GROUP BY a.linea, nombre) AS a LEFT JOIN (SELECT a.linea, IFNULL(SUM(i.paros), 0) AS paros_y, IFNULL(SUM(i.produccion), 0) AS produccion_y, IFNULL(SUM(i.piezas), 0) AS piezas_y, IFNULL(SUM(i.rechazos), 0) AS rechazos_y, IFNULL(SUM(i.calidad), 0) AS calidad_y, IFNULL(SUM(i.disponible), 0) AS disponible_y, e.tdias_y, IFNULL(c.totaltiempo, 0) AS tiempo_c_y, c.totalrep AS docs_y, SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) AS tdisponible_y, IFNULL(c.totaltiempo / 3600 / c.totalrep, 0) AS mttrc_y, (SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) - IFNULL(SUM(f.tiempo), 0) / (IFNULL(c.totalrep, 0) + 1)) / 3600 AS mtbfc_y FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id LEFT JOIN (SELECT c.maquina, COUNT(*) AS totalrep, SUM(c.tiemporeparacion + c.tiempollegada) AS totaltiempo FROM " + this.servicio.rBD() + ".reportes c WHERE c.contabilizar = 'S' AND c.estatus >= 100  AND c.fecha_reporte >= '" + this.fDesdeY + "' AND c.fecha_reporte <= '" + this.fHastaY + "' GROUP BY c.maquina) AS c ON a.id = c.maquina LEFT JOIN (SELECT maquina, tiempo FROM " + this.servicio.rBD() + ".detalleparos f WHERE f.contabilizar = 'S'  AND f.fecha >= '" + this.fDesdeY + "' AND f.fecha <= '" + this.fHastaY + "'  AND f.tipo = 1) AS f ON c.maquina = f.maquina LEFT JOIN (SELECT i.equipo, SUM((SELECT SUM(tiempo) AS tparos FROM " + this.servicio.rBD() + ".detalleparos_info WHERE estatus = 'A' AND corte = i.id AND tipo = 'C')) AS paros, SUM(i.produccion_tc) AS produccion, SUM(i.produccion) AS piezas, SUM(i.calidad) AS rechazos, SUM(i.tiempo_disponible) disponible, SUM(i.calidad_tc) AS calidad  FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.id > 0 AND i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' GROUP BY i.equipo) AS i ON i.equipo = a.id, (SELECT COUNT(*) AS tdias_y, SUM(IF(dia = 2, 1, 0)) AS lunes, SUM(IF(dia = 3, 1, 0)) AS martes, SUM(IF(dia = 4, 1, 0)) AS miercoles, SUM(IF(dia = 5, 1, 0)) AS jueves, SUM(IF(dia = 6, 1, 0)) AS viernes, SUM(IF(dia = 7, 1, 0)) AS sabado, SUM(IF(dia = 1, 1, 0)) AS domingo FROM " + this.servicio.rBD() + ".dias WHERE  fecha >= '" + this.fDesdeY + "' AND fecha <= '" + this.fHastaY + "' ) AS e GROUP BY a.linea) AS b ON a.linea = b.linea ORDER BY " + ordenDatos + ";";
      
      if (this.grActual == 2)
      {
        this.iconoGeneral = "i_maquina"
        ordenDatos = " 11 DESC, 2";
        this.etiBuscar = "Buscar máquina"
        this.literalSingular = "máquina"
        this.literalPlural = "máquinas"
        if (this.configuracion.modulo_oee=="S")
        {
          this.tituloReporte = "OEE y Andon por maquina";
          this.nombreReporte = "andon_y_oee_maquina.csv";
        }
        else
        {
          this.tituloReporte = "Andon por maquina";
          this.nombreReporte = "andon_maquina.csv";
        }

       sentencia = "SELECT * FROM (SELECT a.id, IFNULL(CONCAT(a.nombre , ' / ', b.nombre), 'N/A') AS nombre, a.referencia, a.imagen, a.linea, IFNULL(b.nombre, 'N/A') AS nlinea, IFNULL(SUM(i.paros), 0) AS paros_m, IFNULL(SUM(i.produccion), 0) AS produccion_m, IFNULL(SUM(i.piezas), 0) AS piezas_m, IFNULL(SUM(i.rechazos), 0) AS rechazos_m, IFNULL(SUM(i.calidad), 0) AS calidad_m, IFNULL(SUM(i.disponible), 0) AS disponible_m, IFNULL(d.reportest, 0) AS reportest, d.reporteid, h.reportefecha, h.reportests, IFNULL(h.narea, '') AS narea, e.tdias_m, IFNULL(c.totaltiempo, 0) AS tiempo_c_m, c.totalrep AS docs_m, SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) AS tdisponible_m, IFNULL(c.totaltiempo / 3600 / c.totalrep, 0) AS mttrc_m, (SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) / (IFNULL(c.totalrep, 0) + 1)) / 3600 AS mtbfc_m FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id LEFT JOIN (SELECT c.maquina, COUNT(*) AS totalrep, SUM(c.tiemporeparacion + c.tiempollegada) AS totaltiempo FROM " + this.servicio.rBD() + ".reportes c WHERE c.contabilizar = 'S' AND c.estatus >= 100  AND c.fecha_reporte >= '" + this.fDesde + "' AND c.fecha_reporte <= '" + this.fHasta + "' GROUP BY c.maquina) AS c ON a.id = c.maquina LEFT JOIN (SELECT d.maquina, COUNT(*) AS reportest, MAX(d.id) AS reporteid FROM " + this.servicio.rBD() + ".reportes d WHERE d.contabilizar = 'S' AND d.estatus <= 10 GROUP BY d.maquina) AS d ON a.id = d.maquina LEFT JOIN (SELECT IF(h.estatus = 0, h.fecha, h.inicio_atencion) reportefecha, h.estatus AS reportests, h.id, g.nombre AS narea FROM " + this.servicio.rBD() + ".reportes h LEFT JOIN " + this.servicio.rBD() + ".cat_destinos g ON h.AREA = g.id WHERE h.contabilizar = 'S' AND h.estatus <= 10) AS h ON d.reporteid = h.id LEFT JOIN (SELECT i.equipo, SUM((SELECT SUM(tiempo) AS tparos FROM " + this.servicio.rBD() + ".detalleparos_info WHERE estatus = 'A' AND corte = i.id AND tipo = 'C')) AS paros, SUM(i.produccion_tc) AS produccion, SUM(i.produccion) AS piezas, SUM(i.calidad) AS rechazos, SUM(i.tiempo_disponible) disponible, SUM(i.calidad_tc) AS calidad  FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.id > 0 AND i.dia >= '" + this.fDesde + "' AND i.dia <= '" + this.fHasta + "' GROUP BY i.equipo) AS i ON i.equipo = a.id, (SELECT COUNT(*) AS tdias_m, SUM(IF(dia = 2, 1, 0)) AS lunes, SUM(IF(dia = 3, 1, 0)) AS martes, SUM(IF(dia = 4, 1, 0)) AS miercoles, SUM(IF(dia = 5, 1, 0)) AS jueves, SUM(IF(dia = 6, 1, 0)) AS viernes, SUM(IF(dia = 7, 1, 0)) AS sabado, SUM(IF(dia = 1, 1, 0)) AS domingo FROM " + this.servicio.rBD() + ".dias WHERE  fecha >= '" + this.fDesde + "' AND fecha <= '" + this.fHasta + "' ) AS e GROUP BY a.id, a.nombre) AS a LEFT JOIN (SELECT a.id, IFNULL(SUM(i.paros), 0) AS paros_y, IFNULL(SUM(i.produccion), 0) AS produccion_y, IFNULL(SUM(i.piezas), 0) AS piezas_y, IFNULL(SUM(i.rechazos), 0) AS rechazos_y, IFNULL(SUM(i.calidad), 0) AS calidad_y, IFNULL(SUM(i.disponible), 0) AS disponible_y, e.tdias_y, IFNULL(c.totaltiempo, 0) AS tiempo_c_y, IFNULL(c.totalrep, 0) AS docs_y, SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) AS tdisponible_y, IFNULL(c.totaltiempo / 3600 / IFNULL(c.totalrep, 0), 0) AS mttrc_y, (SUM(e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((a.linea = linea) OR (a.id = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) / (IFNULL(c.totalrep, 0) + 1)) / 3600 AS mtbfc_y FROM " + this.servicio.rBD() + ".cat_maquinas a LEFT JOIN " + this.servicio.rBD() + ".cat_lineas b ON a.linea = b.id LEFT JOIN (SELECT c.maquina, COUNT(*) AS totalrep, SUM(c.tiemporeparacion + c.tiempollegada) AS totaltiempo FROM " + this.servicio.rBD() + ".reportes c WHERE c.contabilizar = 'S' AND c.estatus >= 100  AND c.fecha_reporte >= '" + this.fDesdeY + "' AND c.fecha_reporte <= '" + this.fHastaY + "' GROUP BY c.maquina) AS c ON a.id = c.maquina LEFT JOIN (SELECT i.equipo, SUM((SELECT SUM(tiempo) AS tparos FROM " + this.servicio.rBD() + ".detalleparos_info WHERE estatus = 'A' AND corte = i.id AND tipo = 'C')) AS paros, SUM(i.produccion_tc) AS produccion, SUM(i.produccion) AS piezas, SUM(i.calidad) AS rechazos, SUM(i.tiempo_disponible) disponible, SUM(i.calidad_tc) AS calidad  FROM " + this.servicio.rBD() + ".lecturas_cortes i WHERE i.id > 0 AND i.dia >= '" + this.fDesdeY + "' AND i.dia <= '" + this.fHastaY + "' GROUP BY i.equipo) AS i ON i.equipo = a.id, (SELECT COUNT(*) AS tdias_y, SUM(IF(dia = 2, 1, 0)) AS lunes, SUM(IF(dia = 3, 1, 0)) AS martes, SUM(IF(dia = 4, 1, 0)) AS miercoles, SUM(IF(dia = 5, 1, 0)) AS jueves, SUM(IF(dia = 6, 1, 0)) AS viernes, SUM(IF(dia = 7, 1, 0)) AS sabado, SUM(IF(dia = 1, 1, 0)) AS domingo FROM " + this.servicio.rBD() + ".dias WHERE  fecha >= '" + this.fDesdeY + "' AND fecha <= '" + this.fHastaY + "') AS e GROUP BY a.id, a.nombre) AS b ON a.id = b.id ORDER BY " + ordenDatos + ";";
      }
      else if (this.grActual == 3)
      {
        this.iconoGeneral = "i_responsable"
        ordenDatos = " 9 DESC, 2";
        this.etiBuscar = "Buscar área"
        this.literalSingular = "área"
        this.literalPlural = "áreas"
        if (this.configuracion.modulo_oee=="S")
        {
          this.tituloReporte = "OEE y Andon por area";
          this.nombreReporte = "andon_y_oee_area.csv";
        }
        else
        {
          this.tituloReporte = "Andon por area";
          this.nombreReporte = "andon_area.csv";
        }

       sentencia = "SELECT * FROM (SELECT a.id, a.nombre, a.referencia, e.tdias, IFNULL(SUM(c.tiemporeparacion + c.tiempollegada), 0) AS tiempo_c_m, COUNT(c.id) AS docs_m, (e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) AS tdisponible_m, IFNULL(SUM(c.tiemporeparacion + c.tiempollegada) / 3600 / COUNT(c.id), 0) AS mttrc_m, ((SELECT tdisponible_m) - IFNULL(SUM(f.tiempo), 0)) / (COUNT(c.id) + 1) / 3600 AS mtbfc_m, IFNULL(d.reportest, 0) AS reportest, d.reporteid, h.reportefecha, h.reportests FROM " + this.servicio.rBD() + ".cat_destinos a LEFT JOIN (SELECT d.AREA, COUNT(*) AS reportest, MAX(d.id) AS reporteid FROM " + this.servicio.rBD() + ".reportes d WHERE d.contabilizar = 'S' AND d.estatus <= 10 GROUP BY d.maquina) AS d ON a.id = d.AREA LEFT JOIN (SELECT IF(h.estatus = 0, h.fecha, h.inicio_atencion) reportefecha, h.estatus AS reportests, h.id FROM " + this.servicio.rBD() + ".reportes h WHERE h.contabilizar = 'S') AS h ON d.reporteid = h.id LEFT JOIN (SELECT id, maquina, linea, AREA, tiemporeparacion, tiempollegada FROM " + this.servicio.rBD() + ".reportes c WHERE c.contabilizar = 'S' AND c.estatus >= 100  AND c.fecha_reporte >= '" + this.fDesde + "' AND c.fecha_reporte <= '" + this.fHasta + "' ) AS c ON a.id = c.AREA LEFT JOIN (SELECT maquina, tiempo FROM " + this.servicio.rBD() + ".detalleparos f WHERE f.contabilizar = 'S'  AND f.fecha >= '" + this.fDesde + "' AND f.fecha <= '" + this.fHasta + "'  AND f.tipo = 1) AS f ON c.maquina = f.maquina, (SELECT COUNT(*) AS tdias, SUM(IF(dia = 2, 1, 0)) AS lunes, SUM(IF(dia = 3, 1, 0)) AS martes, SUM(IF(dia = 4, 1, 0)) AS miercoles, SUM(IF(dia = 5, 1, 0)) AS jueves, SUM(IF(dia = 6, 1, 0)) AS viernes, SUM(IF(dia = 7, 1, 0)) AS sabado, SUM(IF(dia = 1, 1, 0)) AS domingo FROM " + this.servicio.rBD() + ".dias WHERE  fecha >= '" + this.fDesde + "' AND fecha <= '" + this.fHasta + "' ) AS e GROUP BY a.nombre) AS a LEFT JOIN (SELECT a.id, a.nombre, a.referencia, e.tdias AS tdias_y, IFNULL(SUM(c.tiemporeparacion + c.tiempollegada), 0) AS tiempo_c_y, COUNT(c.id) AS docs_y, (e.lunes * IFNULL((SELECT lunes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.martes * IFNULL((SELECT martes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.miercoles * IFNULL((SELECT miercoles FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.jueves * IFNULL((SELECT jueves FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.viernes * IFNULL((SELECT viernes FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.sabado * IFNULL((SELECT sabado FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0) + e.domingo * IFNULL((SELECT domingo FROM " + this.servicio.rBD() + ".disponibilidad WHERE (estatus = 'A') AND ((c.linea = linea) OR (c.maquina = maquina) OR (maquina = 0 AND linea = 0)) ORDER BY maquina DESC, linea DESC LIMIT 1), 0)) AS tdisponible_y, IFNULL(SUM(c.tiemporeparacion + c.tiempollegada) / 3600 / COUNT(c.id), 0) AS mttrc_y, ((SELECT tdisponible_y) - IFNULL(SUM(f.tiempo), 0)) / (COUNT(c.id) + 1) / 3600 AS mtbfc_y FROM " + this.servicio.rBD() + ".cat_destinos a LEFT JOIN (SELECT d.AREA, COUNT(*) AS reportest, MAX(d.id) AS reporteid FROM " + this.servicio.rBD() + ".reportes d WHERE d.contabilizar = 'S' AND d.estatus <= 10 GROUP BY d.maquina) AS d ON a.id = d.AREA LEFT JOIN (SELECT IF(h.estatus = 0, h.fecha, h.inicio_atencion) reportefecha, h.estatus AS reportests, h.id FROM " + this.servicio.rBD() + ".reportes h WHERE h.contabilizar = 'S') AS h ON d.reporteid = h.id LEFT JOIN (SELECT id, maquina, linea, AREA, tiemporeparacion, tiempollegada FROM " + this.servicio.rBD() + ".reportes c WHERE c.contabilizar = 'S' AND c.estatus >= 100  AND c.fecha_reporte >= '" + this.fDesdeY + "' AND c.fecha_reporte <= '" + this.fHastaY + "' ) AS c ON a.id = c.AREA LEFT JOIN (SELECT maquina, tiempo FROM " + this.servicio.rBD() + ".detalleparos f WHERE f.contabilizar = 'S'  AND f.fecha >= '" + this.fDesdeY + "' AND f.fecha <= '" + this.fHastaY + "'  AND f.tipo = 1) AS f ON c.maquina = f.maquina, (SELECT COUNT(*) AS tdias, SUM(IF(dia = 2, 1, 0)) AS lunes, SUM(IF(dia = 3, 1, 0)) AS martes, SUM(IF(dia = 4, 1, 0)) AS miercoles, SUM(IF(dia = 5, 1, 0)) AS jueves, SUM(IF(dia = 6, 1, 0)) AS viernes, SUM(IF(dia = 7, 1, 0)) AS sabado, SUM(IF(dia = 1, 1, 0)) AS domingo FROM " + this.servicio.rBD() + ".dias WHERE  fecha >= '" + this.fDesdeY + "' AND fecha <= '" + this.fHastaY + "' ) AS e GROUP BY a.nombre) AS b ON a.id = b.id ORDER BY " + ordenDatos + ";";
      }
      this.cadSQLActual = sentencia;
      this.visualizarImagen = false;
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.servicio.activarSpinner.emit(false);     
        if (resp.length > 0)
        {
          this.registros = resp;
          this.revisarTiempo();
          this.arrFiltrado = this.registros.slice();
          this.calcularIndicadores();
          this.arreHover.length = resp.length;
          this.arreImagenes.length = resp.length;
          for (var i = 0; i < this.arreImagenes.length; i++)
          {
            this.arreImagenes[i] = 'S'
          }
        }
        else
        {
          this.miGrafica = [];
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "No hay datos para reportar";
          mensajeCompleto.tiempo = 1000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
        setTimeout(() => {
          this.contarRegs();
          //this.animadoEFI = true;
          this.visualizarImagen = true;
        }, 100);
        this.buscar();
      
      })
  }

  buscar()
  {
    if (this.verBuscar)
    {
      setTimeout(() => {
        if (this.txtBuscar)
        {
          this.txtBuscar.nativeElement.focus();
        }
        
      }, 150);
    }
  }

  filtrar()
  {
    this.sondeo = 0;
    this.animando = false;
    this.animadoEFI = false;
    this.registros = this.aplicarFiltro(this.textoBuscar);
    this.calcularIndicadores();
    setTimeout(() => {
      this.animando = true; 
    }, 1000);

    setTimeout(() => {
      this.animadoEFI = true; 
    }, 1000);
    
    
    this.contarRegs(); 
  }

  
  aplicarFiltro(cadena: string) 
  {
    let tmpRegistros = [];
    this.servicio.activarSpinnerSmall.emit(true);
    if (cadena ) 
    {
      for (var i = 0; i < this.arrFiltrado.length; i  ++)
      {
        for (var j in this.arrFiltrado[i])
        {
          if (this.arrFiltrado[i][j])
          {
            if (this.servicio.tildes(this.arrFiltrado[i][j], "M").toLowerCase().indexOf(cadena.toLowerCase()) !== -1)
            {
              tmpRegistros.splice(tmpRegistros.length, 0, this.arrFiltrado[i]);
              break;
            }
          }
        }
      }
    }
    else
    {
      tmpRegistros = this.arrFiltrado;
    }
    this.servicio.activarSpinnerSmall.emit(false);
    return tmpRegistros;
  }


  contarRegs()
  {
    if (this.router.url.substr(0, 6) != "/panel")
    {
      return;
    }
    let mensaje = "";
    
    let cadAdicional: string = (this.registros.length - 1 != this.arrFiltrado.length ? " (filtrado de un total de " + this.arrFiltrado.length + ") " : "");
    this.hayFiltro = this.registros.length - 1 != this.arrFiltrado.length;
    if (this.registros.length > 0)
    {
      mensaje = "Hay " + (this.registros.length == 2 ? " " + this.literalSingular : this.registros.length - 1 + " " + this.literalPlural) 
    }
    else
    {
      mensaje = "No hay " + this.literalPlural
    }
    let cadAlarmas: string = "";
    this.alarmados = 0;
    for (var i = 1; i < this.registros.length; i++)
    {
      if (this.registros[i].reportest > 0)
      {
        this.alarmados = this.alarmados + 1
      }
    }
    if (this.alarmados > 0)
    {
      cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? "uno alarmado" : this.alarmados + " alarmados") + "</span>";
    }
    mensaje = mensaje + ' ' + cadAdicional + ' ' + this.mensajePadre + cadAlarmas
    this.servicio.mensajeInferior.emit(mensaje);          
  }

  alarma()
  {
    this.soloAlarmados = !this.soloAlarmados;
  }

  crearFiltro()
  {
    let desde = new Date();
    let hasta = new Date();
    this.fHasta = this.datepipe.transform(hasta, "yyyy/MM/dd");
    this.fHastaY = this.datepipe.transform(hasta, "yyyy/MM/dd");
    let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";       
    desde = new Date(nuevaFecha);
    this.fDesde = this.datepipe.transform(desde, "yyyy/MM/dd");
    nuevaFecha = this.servicio.fecha(1, '' , "yyyy") + "/01/01";         
    desde = new Date(nuevaFecha);
    this.fDesdeY = this.datepipe.transform(desde, "yyyy/MM/dd");
  }

  imagenError(id: number)
  {
    this.arreImagenes[id] = "N"
  }

  revisarTiempo()
  {
    this.contarTiempo = false;
    for (var i = 0; i < this.registros.length; i++)
      {
        if (this.registros[i].reportefecha)
        {
          let segundos = this.servicio.tiempoTranscurrido(this.registros[i].reportefecha, "").split(";");
          this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
        }
        else
        {
          this.arreTiempos[i] = "";
        }
        
      }
      this.contarTiempo = true;
  }

  colorear()
  {
    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores WHERE id = " + this.servicio.rTemaActual();
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        
        if (resp[0].texto_boton)
        {
          resp[0].texto_boton = "#" + resp[0].texto_boton;
        }
        else
        {
          resp[0].texto_boton = "black";
        }
        this.colores = resp[0]
        this.colorEFI = this.colores.texto_boton;
      }
    })
  }


  cadaSegundo()
  {
    if (this.router.url.substr(0, 6) != "/panel")
    {
      return;
    }
    if (this.segLinea >= 8 &&  this.configuracion.modulo_oee == 'S')
    {
      this.segLinea = 0;
      let tmpNumero = this.muestra;
      this.muestra = 99;
      setTimeout(() => {
        this.muestra = tmpNumero == 0 ? 1 : 0;  
      }, 100);
      
    }
    this.segLinea = this.segLinea + 1;
    this.revisarTiempo();
  }

  escapar()
  {
    if (this.verBuscar)
    {
      this.textoBuscar = "";
    }
  }

}



