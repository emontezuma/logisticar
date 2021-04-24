import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { HttpClient  } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { OpcionesComponent } from '../opciones/opciones.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css'],
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
        style({ opacity: 0.3, transform: 'translateY(15px)' }),
        animate('0.5s', style({ opacity: 1, transform: 'translateY(0px)' })),
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0, transform: 'translateY(15px)' }))
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

export class CatalogosComponent implements OnInit {

  @ViewChild("txtBuscar") txtBuscar: ElementRef;
  @ViewChild("txtNombre") txtNombre: ElementRef;
  @ViewChild("txtTelefonos") txtTelefonos: ElementRef;
  @ViewChild("lstC0") lstC0: MatSelect;
  @ViewChild("lstC1") lstC1: MatSelect;
  @ViewChild("lstC2") lstC2: MatSelect;
  @ViewChild("lstC3") lstC3: MatSelect;
  @ViewChild("lstC4") lstC4: MatSelect;
  @ViewChild("lstC5") lstC5: MatSelect;
  @ViewChild("listaListad") listaListad: MatSelectionList;
  @ViewChild("listaComplejidad") listaComplejidad: MatSelectionList;
  
  @ViewChild("lista1") lista1: MatSelectionList;
  @ViewChild("lista2") lista2: MatSelectionList;
  @ViewChild("lista3") lista3: MatSelectionList;
  @ViewChild("lista4") lista4: MatSelectionList;
  @ViewChild("lista5") lista5: MatSelectionList;

  @ViewChild("lstC10") lstC10: MatSelect;
  @ViewChild("lstC11") lstC11: MatSelect;
  @ViewChild("lstC12") lstC12: MatSelect;
  @ViewChild("lstC13") lstC13: MatSelect;
  @ViewChild("lstC14") lstC14: MatSelect;
  @ViewChild("lstC15") lstC15: MatSelect;


  @ViewChild("txtT1") txtT1: ElementRef;
  @ViewChild("txtT2") txtT2: ElementRef;
  @ViewChild("txtT3") txtT3: ElementRef;
  @ViewChild("txtT4") txtT4: ElementRef;
  @ViewChild("txtT5") txtT5: ElementRef;
  @ViewChild("txtT6") txtT6: ElementRef;
  @ViewChild("txtT7") txtT7: ElementRef;
  @ViewChild("txtT8") txtT8: ElementRef;
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/logisticar/assets/datos/";  
  URL_FOLDER = "/logisticar/assets/datos/";  

  constructor
  (
    private servicio: ServicioService,
    private route: ActivatedRoute,
    public scroll: ScrollDispatcher,
    private http: HttpClient,
    public dialogo: MatDialog, 
    private router: Router, 
    private viewportRuler: ViewportRuler
  ) {

    this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      this.altoPantalla = this.servicio.rPantalla().alto - 92;
      this.anchoPantalla = this.servicio.rPantalla().ancho - 2;// - (pantalla ? 0 : this.servicio.rAnchoSN());// : 0);
      if (this.anchoPantalla < 330)
      {
        document.documentElement.style.setProperty("--ancho_campo", "260px");
      }
      else if (this.anchoPantalla >= 470)
      {
        document.documentElement.style.setProperty("--ancho_campo", "400px");
      }
      else 
      {
        document.documentElement.style.setProperty("--ancho_campo", (this.anchoPantalla - 70) + "px");
      }
      
    });
   
    this.servicio.teclaBuscar.subscribe((accion: boolean)=>
    {
      this.buscar();
    });
    this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      this.cancelar();
    });
    this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
      this.modelo = this.movil ? 3 : 2;
      this.verTabla = this.movil;
      document.documentElement.style.setProperty("--ancho_campo", this.movil ? ('' + (this.anchoPantalla - 40)) : "400px");
    });
    this.servicio.vista.subscribe((accion: number)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        if (accion >= 30 && accion <= 43 || accion >= 46 && accion <= 70)
        {
          this.miSeleccion = accion - 29;  
          if (accion == 65)
          {
            this.miSeleccion = 31;
          }
          else if (accion == 60)
          {
            this.miSeleccion = 36;
          }
          this.bot9 = this.miSeleccion == 8;
          this.textoBuscar = "";
          this.rRegistros(this.miSeleccion);
          this.iniLeerBD()
          this.filtroAplicado = false;
          this.filtro35 = false;
          this.literalFiltros()
          this.cambiarVista(0)
          
          
        }
        this.servicio.mostrarBmenu.emit(0);
      }
    });
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.cadaSegundo();
      }
    });

  
    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    this.rConfiguracion();
    let accion = this.servicio.rVista();
    this.miSeleccion = accion - 29;
    if (accion == 65)
    {
      this.miSeleccion = 31;
    }
    else if (accion == 60)
    {
      this.miSeleccion = 36;
    }
    this.bot9 = this.miSeleccion == 8;
    document.documentElement.style.setProperty("--ancho_campo", this.servicio.rMovil() ? "300px" : "400px");
    this.movil = this.servicio.rMovil(); 
    
    this.filtroAplicado = false;
    this.literalFiltros()
    this.rRegistros(this.miSeleccion);
    this.cambiarVista(2)
    this.iniLeerBD();
    setTimeout(() => {
      this.irArriba();  
    }, 300);
    
  }

  ngOnInit() 
  {
    this.servicio.validarLicencia(1)
    this.servicio.mostrarBmenu.emit(0);
    this.rPlacas();
    this.rChoferes();
    this.rTransportes();
    this.rReferencias();

  }

  offSet: number;
  idRates: number = 0;
  grActual: number = 0;
  nListado: number = 0;
  verIrArriba: boolean = false;
  efectoDemorado: boolean = false;
  catalogoImagen: boolean = false;
  verFiltro: boolean = false;
  verBuscar: boolean = true;
  existePager: boolean = false;
  verTabla: boolean = false;
  contarTiempo: boolean = false;
  asignando: boolean = false;
  cadenaAntes: string = "";
  transfiriendo: boolean = false;
  liberando: boolean = false;
  menos200: boolean = false;
  editandoD: boolean = false;
  procesoGuardar: number = 0;
  cambioVista: boolean = true;
  vistaResumen: number = 0
  hayFiltro: boolean = false;
  movil: boolean = false;
  nCatalogo: string = "TRANSPORTES"
  cadPlaca: number = 0;  
  cadAsignando: string = "";  
  cadReferencia: number = 0;  
  cadChofer: number = 0;  
  cadTransporte: number = 0;  
  arreTiempos: any = [];
  arreTiempos2: any = [];
  arreTiempos3: any = [];
  cadTiempos: any = [];
  datostransporte: any = [];
  pagerActual: number = 0;
  reqActual: number = 0;
  nombreBeeper: string = "";
  indiceActual: number = 0;
  icoExpandir: string = "i_reducir";
  verBarra: string = "";
  ultimoReporte: string = "";
  ultimoID: number = 0;
  copiandoDesde: number = 0;
  textoBuscar: string = "";
  sentenciaR: string = "";
  cadSQLActual: string = "";
  nuevoRegistro: string = ";";
  nExtraccion: string = "0";
  nLapso: string = "0";
  piezasAntes: number = 0;
  equipoAntes: number = -1;
  validarCU: boolean = false;
  validarUSER: boolean = false
  validarRuta: boolean = false
  validaInicial: boolean = false
  validaFinal: boolean = false
  validaEspera: boolean = false
  
  validarDescarga: boolean = false;
  validarTiempoRuta: boolean = false
  valTactos: boolean = false;
  rutaConfirmada: boolean = false;
  choferSuspendidoConfirmado: boolean = false;
  tiempoRuta: string = "";
  tiempoRutaSeg: number = 0;
  monitorear: string = "N"
  des_monitorear: string = "N"
  rutaHallada: number = 0;
  descargaHallada: number = 0;

  validarTiempoDescarga: boolean = false
  descargaConfirmada: boolean = false;
  tiempoDescarga: string = "";
  tiempoDescargaSeg: number = 0;
  



  validarM: boolean = false;
  nHorario: string = "T";
  sentenciaRate: string = "";
  nFrecuencia: string = "T";
  ordenadoPor: number = 2;
  verSR: boolean = false;
  vObjetivoCero: boolean = false;
  bot: any = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
  placasFiltradas: any = [];
  placas: any = [];
  choferesFiltradas: any = [];
  choferes: any = [];
  transportesFiltradas: any = [];
  transportes: any = [];
  referenciasFiltradas: any = [];
  referencias: any = [];
  
  mostrarImagenRegistro: string = "N";
  mensajeImagen: string = "Campo opcional";
  cancelarEdicion: boolean = false;

  modelo: number = 0;
  ultimaActualizacion = new Date();
  altoPantalla: number = this.servicio.rPantalla().alto - 92;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();
  errorTitulo: string = "Ocurrió un error durante la conexión al servidor";
  errorMensaje: string = "";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  selListadoT: string = "S";
  opciones: string = "S";
  iconoGeneral: string = "";
  iconoVista: string = "";
  literalVista: string = "Ver detalle";
  litFiltrar: string = "Filtrar"
  tituloBuscar: string = "";
  alarmados: number = 0;
  elTiempo: number = 0;
  despuesBusqueda: number = 0;
  enCadaSegundo: boolean = false;
  filtroAplicado: boolean = false;
  filtro35: boolean = false;
  visualizarImagen: boolean = false;
  //sondeo: number = 0;
  registros: any = [];
  tmpRegistros: any = [];
  arrFiltrado: any = [];
  detalle: any = [];
  titulos: any = [];
  tablas: any = [];
  ayudas: any = [];
  cronometro: any;
  cronometroCat: any;
  leeBD: any;
  laSeleccion: any = [];
  configuracion: any = [];
  fallas: any [];
  lineas: any = [];
  eventos: any = [];
  lotes: any = [];
  historias: any = [];
  cargas: any = [];
  paros: any = [];
  maquinas: any = [];
  partes: any = [];
  areas: any = [];
  lineasSel: any = [];
  operacionesSel: any = [];
  partesSel: any = [];
  maquinasSel: any = [];
  areasSel: any = [];
  opcionesSel: any = [];
  tipos: any = [];
  turnos: any = [];
  listas: any = [];
  listados: any = [];
  agrupadores1: any = [];
  agrupadores2: any = [];
  arreImagenes: any = [];
  arreHover: any = [];

  seleccionMensaje = ["M", "C"];
  seleccionescalar1 = ["C"];
  seleccionescalar2 = ["C"];
  seleccionescalar3 = ["C"];
  seleccionescalar4 = ["C"];
  seleccionescalar5 = ["C"];
  seleccionProcesos = [];

  notas: string = "";
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  noLeer: boolean = false;
  operacioSel: boolean = false;
  maquinaSel: boolean = false;
  maquinaSel2: boolean = false;
  maquinaSel3: boolean = false;
  reparandoSel: boolean = false;
  abiertoSel: boolean = false;
  lineaSel: boolean = false;
  masivoSel: boolean = false;
  editando: boolean = false;
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajePadre: string = "";
  URL_IMAGENES = "/logisticar/assets/imagenes/";
  URL_BASE = "/logisticar/api/upload.php"
  mostrarDetalle: boolean = false;

  ayuda01 = "Seleccionar una imagen para subir"

  botonera1: number = 1;
  verParos: number = 1;
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
  bot8: boolean = true;
  bot9: boolean = true;

  yaValidado: number = -1;

  animando: boolean = true;
  listoMostrar: boolean = true;

  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  error04: boolean = false;
  error05: boolean = false;
  error06: boolean = false;
  error07: boolean = false;
  error08: boolean = false;
  error09: boolean = false;
  error10: boolean = false;
  error20: boolean = false;
  error21: boolean = false;
  error22: boolean = false;
  error23: boolean = false;
  error24: boolean = false; 
  error25: boolean = false;
  error30: boolean = false;
  error31: boolean = false;
  error32: boolean = false;
  error33: boolean = false;
  error34: boolean = false;
  error35: boolean = false;
  error36: boolean = false;

  literalSingular: string = "";
  literalSingularArticulo: string = "";
  literalPlural: string = "";

  ayuda11: string = "Cambiar a vista"



  escapar()
  {
    if (this.verBuscar)
    {
      this.textoBuscar = "";
    }
    else
    {
      this.cancelar();
    }
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
      setTimeout(() => {
        this.irArriba();  
      }, 100);
      this.modelo = this.modelo == 11 ? 1 : this.modelo == 12 ? 2 : this.modelo == 13 ? 3 : this.modelo == 14 ? 4 : this.modelo == 15 ? 5 : this.modelo;
    }
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

  rRegistros(tabla: number)
  {
    
    if (this.movil)
      {
        this.modelo = 3;
      }
    if (tabla <= 30 || tabla == 32)
    {
      this.vistaResumen = 0;
    }
    else 
    {
      this.vistaResumen = this.vistaResumen == 0 ? 1 : this.vistaResumen
    }
    //this.verBuscar = tabla <= 4 || tabla==11;
    //this.cambioVista = tabla <= 4 || tabla==1;
    this.visualizarImagen = false;
    this.animando = false;
    this.despuesBusqueda = 0;
    this.copiandoDesde = 0;
    this.botonera1 = 1;
    this.registros = [];
    this.arrFiltrado = [];
    this.arreHover = [];
    this.arreImagenes = [];
    this.servicio.activarSpinner.emit(true);     
    this.noLeer = false;  
    this.valTactos = false
    //
    this.catalogoImagen = false;
    let sentencia: string  = "";
    if (tabla == 1)
    {
      this.catalogoImagen = true;
      this.verFiltro = false;
      this.nCatalogo = "TRANSPORTE"
      this.iconoGeneral = "i_transporte";
      sentencia = "SELECT a.id, a.nombre, a.referencia, 0 AS cuenta, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY 2;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Razón social', 'Referencia', 'Notas', 'Ruta de la imagen asociada', 'Tipo de transporte', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IFNULL(f.nombre, 'N/A'), IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales f ON a.agrupador_1 = f.id ";
      this.tituloBuscar = "Filtrar transporte";
      this.literalSingular = "una transporte";
      this.literalPlural = "transportes";
      this.literalSingularArticulo = "El transporte";
      this.mensajePadre = "";
    }
    else if (tabla == 2)
    {
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "VEHÍCULOS"
      this.iconoGeneral = "i_camion";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, IFNULL(d.nombre, 'N/A') AS nlinea, a.imagen FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes d ON a.linea = d.id ORDER BY " + this.ordenadoPor + ";";
      this.sentenciaR = "SELECT 'ID', 'Placas', 'Referencia', 'Notas', 'Ruta de la imagen asociada', 'Tipo de vehículo', " + (this.configuracion.adicionales == "S" ? "'Marca', 'Modelo', " : "") + "'Transporte asociado', 'ID del transporte asociado', 'Tipo de carga', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IFNULL(g.nombre, 'N/A'), " + (this.configuracion.adicionales == "S" ? "IFNULL(d.nombre, 'N/A'), IFNULL(e.nombre, 'N/A'), " : "") + "IFNULL(f.nombre, 'N/A'), a.linea, IFNULL(g.nombre, 'N/A'), IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.agrupador_1 = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.agrupador_2 = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales g ON a.tipo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.linea = f.id  LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.tipo = i.id ";
      this.tituloBuscar = "Filtrar vehículo";
      this.literalSingular = "un vehículo";
      this.literalPlural = "vehículos";
      this.literalSingularArticulo = "El vehículo";
      this.mensajePadre = "";
    }
    else if (tabla == 3)
    {
      this.catalogoImagen = true;
      this.nCatalogo = "CHOFERES"
      this.iconoGeneral = "i_chofer";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', 'activo', IF(a.estatus = 'S', 'suspendido', 'inactivo')) AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_choferes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre del chofer', 'Teléfonos', 'Drección', 'correo electronico', 'Ruta de la imagen asociada', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.correo, a.imagen, IF(a.estatus = 'A', 'activo', IF(a.estatus = 'S', 'suspendido', 'inactivo')), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_choferes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      this.tituloBuscar = "Filtrar choferes";
      this.literalSingular = "un chofer";
      this.literalPlural = "choferes";
      this.literalSingularArticulo = "El chofer";
      this.mensajePadre = "";
    }
    else if (tabla == 4)
    {
      this.validaInicial = false;
      this.validaFinal = false;
      this.validaEspera = false;
      
      this.catalogoImagen = true;
      this.nCatalogo = "DESTINOS"
      this.iconoGeneral = "i_localizacion";
      sentencia = "SELECT a.id, a.nombre, a.color, a.referencia, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_destinos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY 2;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Descripción', 'Persona responsable', 'Notas', 'Ruta de la imagen asociada', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, a.notas, a.imagen, IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_destinos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      this.tituloBuscar = "Filtrar destino";
      this.literalSingular = "un destino";
      this.literalPlural = "destinos";
      this.literalSingularArticulo = "El destino";
      this.mensajePadre = "";
    }
    else if (tabla == 5)
    {
      this.nCatalogo = "GENERALES"
      this.iconoGeneral = "i_general";
      sentencia = "SELECT a.id, a.nombre, d.nombre AS ntabla, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".tablas d ON a.tabla = d.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Descripcion', 'Tabla asociada', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, d.nombre, IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".tablas d ON a.tabla = d.id ";
      this.tituloBuscar = "Filtrar generales";
      this.literalSingular = "un registro general";
      this.literalPlural = "registros generales";
      this.literalSingularArticulo = "El registro general";
      this.mensajePadre = "";
    }
    else if (tabla == 6)
    {
      this.nCatalogo = "RECIPIENTES"
      this.iconoGeneral = "i_recipiente";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Descripcion', 'Referencia', 'Telefonos', 'Correos', 'MMCall', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, a.telefonos, a.correos, a.mmcall, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id  ";
      this.tituloBuscar = "Filtrar recipiente";
      this.literalSingular = "un recipiente";
      this.literalPlural = "recipientes";
      this.literalSingularArticulo = "El recipiente";
      this.mensajePadre = "";
    }
    else if (tabla == 7)
    {
      this.nCatalogo = "CORREOS/REPORTE"
      this.iconoGeneral = "i_correos";
      sentencia = "SELECT a.id, a.nombre, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_correos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_correos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ";
      this.tituloBuscar = "Filtrar reporte";
      this.literalSingular = "un reporte";
      this.literalPlural = "reportes";
      this.literalSingularArticulo = "El reporte";
      this.mensajePadre = "";
    }
    else if (tabla == 8)
    {
      this.bot9 = true
      this.nCatalogo = "ALERTAS"
      this.iconoGeneral = "i_alertas";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Descripcion', 'Referencia', 'Evento', 'Tiempo de espera (segundos)', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, IFNULL(d.nombre, 'N/A'), a.transcurrido, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".int_eventos d ON a.evento = d.alerta ";
      this.tituloBuscar = "Filtrar alertas";
      this.literalSingular = "una alerta";
      this.literalPlural = "alertas";
      this.literalSingularArticulo = "El alerta";
      this.mensajePadre = "";
    }
    else if (tabla == 9)
    {
      this.nCatalogo = "TURNOS"
      this.iconoGeneral = "i_turnos";
      sentencia = "SELECT a.id, a.nombre, a.inicia, a.termina, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Descripcion', 'Referencia', 'Desde', 'Hasta', 'Tiempo del turno', 'Tipo de turno', 'Turno entre dos días', 'Día de afectacion (reportes)', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, a.referencia, a.inicia, a.termina, a.telefonos, a.correos, a.mmcall, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id  ";
      this.tituloBuscar = "Filtrar turnos";
      this.literalSingular = "un turno";
      this.literalPlural = "turnos";
      this.literalSingularArticulo = "El turno";
      this.mensajePadre = "";
    }
    else if (tabla == 10)
    {
      this.nCatalogo = "FRASES"
      this.iconoGeneral = "i_traductor";
      sentencia = "SELECT a.id, a.literal, a.traduccion FROM " + this.servicio.rBD() + ".traduccion a ORDER BY a.literal;";
      this.sentenciaR = "SELECT 'ID', 'Literal', 'Traduccion' UNION SELECT a.id, a.literal, a.traduccion FROM " + this.servicio.rBD() + ".traduccion a ";
      this.tituloBuscar = "Filtrar frase";
      this.literalSingular = "una frase";
      this.literalPlural = "frases";
      this.literalSingularArticulo = "La frase";
      this.mensajePadre = "";
    }
    else if (tabla == 11)
    {
      this.catalogoImagen = true;
      this.nCatalogo = "RUTAS"
      this.iconoGeneral = "i_rutas";
      sentencia = "SELECT a.id, (a.tipo + a.carga + a.transporte) AS tEstimado, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, SEC_TO_TIME(a.tiempo) AS tiempo, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id ORDER BY dOrigen, dDestino";   
      this.sentenciaR = "SELECT 'ID', 'Origen', 'Destino', 'Transporte', 'Tipo de vehiculo', 'Tipo de carga', 'Tiempo estimado (seg)', 'Monitorear (S/N)', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, IFNULL(g.nombre, 'N/A'), IFNULL(h.nombre, 'N/A'), IFNULL(f.nombre, 'N/A'), IFNULL(e.nombre, 'N/A'), IFNULL(d.nombre, 'N/A'), a.tiempo, a.monitorear, IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.carga = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos g ON a.origen = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos h ON a.destino = h.id ";
      this.tituloBuscar = "Filtrar ruta";
      this.literalSingular = "una ruta";
      this.literalPlural = "rutas";
      this.literalSingularArticulo = "La ruta";
      this.mensajePadre = "";
    }
    else if (tabla == 17)
    {
      this.catalogoImagen = true;
      this.nCatalogo = "DESCARGAS"
      this.iconoGeneral = "i_programacion";
      sentencia = "SELECT a.id, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, SEC_TO_TIME(a.tiempo) AS tiempo, IFNULL(d.nombre, '(Cualquiera)') AS dTipo, IFNULL(g.nombre, '(Cualquiera)') AS dTransporte, IFNULL(e.nombre, '(Cualquiera)') AS dDestino, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio, IFNULL(f.nombre, '(Cualquiera)') AS dCarga FROM " + this.servicio.rBD() + ".cat_descargas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.tipo = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales f ON a.carga = f.id  LEFT JOIN " + this.servicio.rBD() + ".cat_transportes g ON a.transporte = g.id ORDER BY dDestino";   
      this.sentenciaR = "SELECT 'ID', 'Lugar de descarga', 'Transporte', 'Tipo de vehiculo', 'Tipo de carga', 'Tiempo estimado (seg)', 'Monitorear (S/N)', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, IFNULL(g.nombre, 'N/A'), IFNULL(f.nombre, 'N/A'), IFNULL(e.nombre, 'N/A'), IFNULL(d.nombre, 'N/A'), a.tiempo, a.monitorear, IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_descargas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.carga = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.tipo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos g ON a.destino = g.id  ";
      
      this.tituloBuscar = "Filtrar descarga";
      this.literalSingular = "una descarga";
      this.literalPlural = "desargas";
      this.literalSingularArticulo = "La descarga";
      this.mensajePadre = "";
    }
    else if (tabla == 12)
    {
      this.catalogoImagen = true;
      this.nCatalogo = "USUARIOS"
      this.iconoGeneral = "i_grupos";
      sentencia = "SELECT a.id, a.nombre, a.referencia, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio, a.imagen FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre del usuario', 'Politica de seguridad', 'Referencia', 'Notas', 'Ruta de la imagen asociada', 'Rol del usuario', 'Compania asociada', 'Departamento asociaodo', 'Planta', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, IFNULL(g.nombre, 'N/A'), a.referencia, a.notas, a.imagen, CASE WHEN a.rol ='*' THEN '(Todos los roles)' WHEN a.rol = 'A' THEN 'ADMINISTRADOR' WHEN a.rol = 'G' THEN 'Gestor de la aplicación' WHEN a.rol = 'S' THEN 'Supervisor' WHEN a.rol = 'T' THEN 'Tecnico' WHEN a.rol = 'O' THEN 'Operador' END, IFNULL(d.nombre, 'N/A'), IFNULL(e.nombre, 'N/A'), IFNULL(f.nombre, 'N/A'), IF(a.estatus = 'A', 'activo', 'inactivo'), a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON a.compania = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.departamento = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales f ON a.planta = f.id LEFT JOIN " + this.servicio.rBD() + ".politicas g ON a.politica = g.id    ";
      this.tituloBuscar = "Filtrar usuarios";
      this.literalSingular = "un usuario";
      this.literalPlural = "usuarios";
      this.literalSingularArticulo = "El usuario";
      this.mensajePadre = "";
    }
    else if (tabla == 14)
    {
      this.nCatalogo = "POLÍTICAS"
      this.iconoGeneral = "i_politicas";
      sentencia = "SELECT a.id, a.nombre, a.modificacion, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id ORDER BY a.nombre;";
      this.sentenciaR = "SELECT 'ID', 'Nombre/Descripcion', 'Un sólo uso', 'Contraseña requerida', 'La contraseña vence', 'Dias de vencimiento', 'Dias de aviso', 'Estatus', 'Fecha de creacion', 'Usuario que creo el registro', 'Fecha de ultimo cambio', 'Usuario que efectuo el ultimo cambio' UNION SELECT a.id, a.nombre, IF(a.deunsolouso = 'S', 'Si', 'No'), IF(a.obligatoria = 'S', 'Si', 'No'), IF(a.vence = 'S', 'Si', 'No'), a.diasvencimiento, a.aviso, IF(a.estatus = 'A', 'activo', 'inactivo') AS estatus, a.creacion, IFNULL(b.nombre, 'N/A'), a.modificacion, IFNULL(c.nombre, 'N/A') FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id  ";
      this.tituloBuscar = "Filtrar política";
      this.literalSingular = "una política";
      this.literalPlural = "políticas";
      this.literalSingularArticulo = "La política";
      this.mensajePadre = "";
    }
    else if (tabla == 34)
    {
      //En espera
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(b.estatus, 0) AS estatus, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, b.color, IFNULL(d.nombre, IF(b.pager = 0, 'DISPOSITIVO TEMPORAL', 'N/A')) AS narea, c.imagen, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, b.estado AS estadonro, b.preasignado, b.orden, b.fecha_recibo, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 10 ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID requester', 'Pager (MMCall)', 'Nombre/Descripción', 'Destino', 'Estado desde', 'Alarmado?', 'Transporte', 'Nombre del chofer', 'Placas', 'Estado', 'Tipo de carga' UNION SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 10";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    else if (tabla == 35)
    {
      //En espera
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, a.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, b.color, IFNULL(d.nombre, 'N/A') AS narea FROM mmcall.pagers a LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.pager = b.pager LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id " + (this.filtro35 ? "WHERE ISNULL(b.area)" : "") //+ " ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID LogistiCAR', 'ID MMCall', 'Nombre/Descripción', 'Color (HEX color)', 'Area asignada' UNION SELECT b.id AS idrequester, a.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, b.color, IFNULL(d.nombre, 'N/A') AS narea FROM mmcall.pagers a LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.pager = b.pager LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    else if (tabla == 31)
    {
      //tránsito
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(b.estatus, 0) AS estatus, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, b.color, IFNULL(d.nombre, IF(b.pager = 0, 'DISPOSITIVO TEMPORAL', 'N/A')) AS narea, c.imagen, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, b.estado AS estadonro, b.preasignado, b.fecha_recibo, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 20 ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID requester', 'Pager (MMCall)', 'Nombre/Descripción', 'Destino', 'Estado desde', 'Alarmado?', 'Transporte', 'Nombre del chofer', 'Placas', 'Estado', 'Tipo de carga' UNION SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 20";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    else if (tabla == 32)
    {
      //Disponibles
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(b.estatus, 0) AS estatus, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, b.color, IFNULL(d.nombre, IF(b.pager = 0, 'DISPOSITIVO TEMPORAL', 'N/A')) AS narea, c.imagen, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, b.estado AS estadonro, b.preasignado, b.fecha_recibo, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 0 ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID requester', 'Pager (MMCall)', 'Nombre/Descripción', 'Destino', 'Estado desde', 'Alarmado?', 'Transporte', 'Nombre del chofer', 'Placas', 'Estado', 'Tipo de carga' UNION SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 0";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    else if (tabla == 36)
    {
      //descargando
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(b.estatus, 0) AS estatus, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, b.color, IFNULL(d.nombre, IF(b.pager = 0, 'DISPOSITIVO TEMPORAL', 'N/A')) AS narea, c.imagen, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, b.estado AS estadonro, b.preasignado, b.fecha_recibo, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 30 ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID requester', 'Pager (MMCall)', 'Nombre/Descripción', 'Destino', 'Estado desde', 'Alarmado?', 'Transporte', 'Nombre del chofer', 'Placas', 'Estado', 'Tipo de carga' UNION SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 30";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    else if (tabla == 37)
    {
      //descargando
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(b.estatus, 0) AS estatus, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, b.color, IFNULL(d.nombre, IF(b.pager = 0, 'DISPOSITIVO TEMPORAL', 'N/A')) AS narea, c.imagen, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, b.estado AS estadonro, b.preasignado, b.fecha_recibo, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 40 ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID requester', 'Pager (MMCall)', 'Nombre/Descripción', 'Destino', 'Estado desde', 'Alarmado?', 'Transporte', 'Nombre del chofer', 'Placas', 'Estado', 'Tipo de carga' UNION SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 40";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    else if (tabla == 33)
    {
      //todos
      this.catalogoImagen = true;
      this.verFiltro = true;
      this.nCatalogo = "DISPOSITIVOS";
      this.iconoGeneral = "i_voz";
      sentencia = "SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(b.estatus, 0) AS estatus, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, b.color, IFNULL(d.nombre, IF(b.pager = 0, 'DISPOSITIVO TEMPORAL', 'N/A')) AS narea, c.imagen, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, b.estado AS estadonro, b.preasignado, b.fecha_recibo, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id ORDER BY " + this.ordenadoPor;
      this.sentenciaR = "SELECT 'ID requester', 'Pager (MMCall)', 'Nombre/Descripción', 'Destino', 'Estado desde', 'Alarmado?', 'Transporte', 'Nombre del chofer', 'Placas', 'Estado', 'Tipo de carga' UNION SELECT b.id AS idrequester, b.pager AS id, IFNULL(b.nombre, IF(b.pager = 0, b.movil, 'SIN USO')) AS nombre, IFNULL(c.nombre, 'N/A') AS ndestino, b.desde, b.alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(g.nombre, 'N/A') AS placa, CASE WHEN b.estado = 0 THEN 'DISPONIBLE' WHEN b.estado = 10 THEN 'EN ESPERA' WHEN b.estado = 20 THEN 'EN TRÁNSITO' WHEN b.estado = 30 THEN 'DESCARGANDO' WHEN b.estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, IFNULL(i.nombre, 'N/A') AS carga FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos c ON b.destino = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON b.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos g ON b.vehiculo = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id";
      this.tituloBuscar = "Filtrar dispositivo";
      this.literalSingular = "un dispositivo";
      this.literalPlural = "dispositivos";
      this.literalSingularArticulo = "El dispositivo";
      this.mensajePadre = "";
    }
    this.verSR = false;
    this.cadSQLActual = sentencia;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.arrFiltrado = resp; 
        
      if (this.textoBuscar.length > 0)
      {
        resp = this.aplicarFiltro(this.textoBuscar);
      }
      if (resp.length > 200)
      {
        
        this.menos200 = false;
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "400px", panelClass: 'dialogo_atencion', data: { titulo: "Demasiados registros", tiempo: 0, mensaje: "Esta intentando recuperar " + resp.length + " registros, por favor use la opción de filtrar para reducir el número de registros al menos a 200", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_falla" }
        })
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            this.buscar();
        
          }
        })
        this.servicio.activarSpinner.emit(false);  
        return;
      }
      else
      {
        this.menos200 = true;
      }
      if (this.miSeleccion==4 || this.miSeleccion>=31)
      {
        for (var i = 0; i < resp.length; i++)
        {
          resp[i].color = resp[i].color ? ("#" + resp[i].color) : ""
        }
      }
        
        this.registros = resp; 
          if (this.textoBuscar.length > 0)
        {
          this.registros = this.aplicarFiltro(this.textoBuscar);
        }
      
        if (this.miSeleccion>=31)
        {
          this.revisarTiempo();
        }
        this.arreTiempos.length = this.registros.length;
        this.cadTiempos.length = this.registros.length;
        
        setTimeout(() => {
          this.verSR = true;  
        }, 500);
        this.mostrarDetalle = true;  
        this.arreHover.length = resp.length;
        this.arreImagenes.length = resp.length;
        
      
        //
        this.mostrarImagenRegistro = "S";
        this.cancelarEdicion = false;
        //
        setTimeout(() => {
          this.contarRegs();
          this.servicio.activarSpinner.emit(false);  
          this.visualizarImagen = true;
     
          this.animando = true;       
        }, 100);
      this.buscar();
    }, 
    error => 
      {
        console.log(error)
      })
  }

  
  
  imagenError(event, id: number)
  {
    this.arreImagenes[id] = "N";
  }

  imagenBien(event, id: number)
  {
    this.arreImagenes[id] = "S";
    
  }

  
  filtrar()
  {
    //this.sondeo = 0;
    this.animando = false;
    this.registros = this.aplicarFiltro(this.textoBuscar);

    if (this.registros.length > 200)
    {
      this.menos200 = false;
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "400px", panelClass: 'dialogo_atencion', data: { titulo: "Demasiados registros", tiempo: 0, mensaje: "Esta intentando recuperar " + this.registros.length + " registros, por favor use la opción de filtrar para reducir el número de registros al menos a 200", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_falla" }
      })
    }
    else
    {
      this.menos200 = true;
    }

    this.arreTiempos.length = this.registros.length;
    this.cadTiempos.length = this.registros.length;
    
    setTimeout(() => {
      this.animando = true;  
    }, 200);
    
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
    if (this.router.url.substr(0, 10) != "/catalogos" || this.noLeer )
    {
      return;
    }
    let mensaje = "";
    
    let cadAdicional: string = (this.registros.length != this.arrFiltrado.length ? " (filtrado de un total de " + this.arrFiltrado.length + ") " : "");
    this.hayFiltro = this.registros.length != this.arrFiltrado.length;
    if (this.registros.length > 0)
    {
      mensaje = "Hay " + (this.registros.length == 1 ? " " + this.literalSingular : this.registros.length + " " + this.literalPlural) 
    }
    else
    {
      mensaje = "<span class='resaltar'>No hay " + this.literalPlural + "</span>"
    }
    let cadAlarmas: string = "";
    {
      this.alarmados = 0;
      for (var i = 0; i < this.arrFiltrado.length; i++)
      {
        if (this.miSeleccion < 30)
        {
          if (this.arrFiltrado[i].estatus == 'inactivo')
          {
            this.alarmados = this.alarmados + 1
          }
        }
        else
        {
          if (this.arrFiltrado[i].alarmado == 'S')
          {
            this.alarmados = this.alarmados + 1
          }
        }
      }
      if (this.alarmados > 0)
      {
        if (this.miSeleccion < 30)
        {
          cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? "un registro inactivo" : this.alarmados + " registros inactivos") + "</span>";  
        }
        else
        {
          cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? "un dispositivo alarmado" : this.alarmados + " dispositivos alarmados") + "</span>";
        }
        
      }
    }
    mensaje = mensaje + " " + cadAdicional + " " + this.mensajePadre + " " + cadAlarmas
    this.servicio.mensajeInferior.emit(mensaje);          
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

  cambiarVista(modo: number)
  {
    this.animando = false;
    //this.sondeo = 0;
    let vistaRecuadro: boolean = false;
    if (modo == 1)
    {
      vistaRecuadro = (this.modelo == 13 || this.modelo == 3) && modo == 1;
      this.servicio.guardarVista(this.miSeleccion + 10, (vistaRecuadro ? 1: 0))      
    }
    else
    {
      vistaRecuadro = this.servicio.rUsuario().preferencias_andon.substr(9 + this.miSeleccion, 1) == "1";
    }
    if (vistaRecuadro && !this.movil)
    {
      if (this.miSeleccion >= 30)
      {
        this.vistaResumen = 1;
        this.icoExpandir = this.vistaResumen == 1 ? "i_expandir" : "i_reducir";
      }
      else
      {
        this.vistaResumen = 0;
      }
      this.modelo = (modo == 2 ? 2 : 12);
      this.ayuda11 = "Cambiar a vista detalle"
      this.iconoVista = "i_vdetalle"
      this.literalVista = "Ver detalle"
      //this.verTabla = false;
      this.verTabla = this.movil;
      if (this.movil)
      {
        this.modelo = 3;
      }
    }
    else
    { 
      this.vistaResumen = 0;
      this.modelo = (modo == 2 ? 3 : 13);  
      this.ayuda11 = "Cambiar a vista recuadro"
      this.iconoVista = "i_vcuadro"
      this.literalVista = "Ver tarjetas"
      this.verTabla = true;
      if (this.movil)
      {
        this.modelo = 3;
      }
      
    }
    
    setTimeout(() => {
      this.animando = true;
      if (this.txtBuscar)
      {
        this.txtBuscar.nativeElement.focus();
      }
        
    }, 300);
  }

  leerBD()
  {
    if (this.noLeer || this.router.url.substr(0, 10) != "/catalogos")
    {
      return;
    }
    let campo: string = "lineas";
    if  (this.miSeleccion==2)
    {
      campo = "maquinas";
    }
    else if (this.miSeleccion==3)
    {
      campo = "areas";
    }
    else if (this.miSeleccion==5)
    {
      campo = "generales";
    }
    else if (this.miSeleccion==6)
    {
      campo = "distribucion";
    }
    else if (this.miSeleccion==7)
    {
      campo = "correos";
    }
    else if (this.miSeleccion==8)
    {
      campo = "alertas";
    }
    else if (this.miSeleccion==9)
    {
      campo = "turnos";
    }
    else if (this.miSeleccion==10)
    {
      campo = "traducciones";
    }
    else if (this.miSeleccion==12)
    {
      campo = "usuarios";
    }
    else if (this.miSeleccion==14)
    {
      campo = "politicas";
    }
    else if (this.modelo == 5)
    {
      this.refrescarTactos(this.reqActual);
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD()
        }, +this.elTiempo);
      }
      return;
    }
    else if (this.miSeleccion>=30)
    {
      campo = "dispositivos";
    }
    
    
    
    let sentencia = "SELECT " + campo + " FROM " + this.servicio.rBD() + ".actualizaciones";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let revisar: boolean = false;
      if (resp.length > 0)
      {
        if (resp[0][campo])
        {
          if (new Date(resp[0][campo]) > this.ultimaActualizacion)
          {
            revisar = true;
          }
        }
      }
      if (revisar)
      {
        campos = {accion: 100, sentencia: this.cadSQLActual};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
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
            else 
            {
              for (i = this.registros.length - 1; i >= 0; i--)
              {
                let hallado = false;
                for (var j = 0; j < arreTemp.length; j++)
                {
                  if (this.registros[i].id ==  arreTemp[j].id)
                  {
                    if (this.miSeleccion < 30)
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
                    else
                    {
                      if (this.registros[i].estado !=  arreTemp[j].estado || this.registros[i].estatus !=  arreTemp[j].estatus || this.registros[i].nombre !=  arreTemp[j].nombre || this.registros[i].alarmado !=  arreTemp[j].alarmado || this.registros[i].fecha_recibo !=  arreTemp[j].fecha_recibo || this.registros[i].fecha !=  arreTemp[j].fecha || this.registros[i].orden !=  arreTemp[j].orden)
                        {
                          this.registros[i] = arreTemp[j];
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
                }
                if (!hallado)
                {
                  this.ultimoRegistro(); 
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
                  //this.sondeo = arreTemp[i].id;
                }
              }
            }
            this.arreTiempos.length = this.registros.length;
            this.cadTiempos.length = this.registros.length;
            this.contarRegs()
          }
        });
      }
      this.ultimaActualizacion = new Date();
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 10) == "/catalogos")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD()
        }, +this.elTiempo);
      }
  
    })

    }

  refrescarTactos(id: number) 
  {
    this.animando = false;
    let sentencia = "SELECT a.id, a.viaje, a.estatus AS idest, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, CASE WHEN a.estatus = 0 THEN 'i_reloj' WHEN a.estatus = 1 THEN 'i_documento' WHEN a.estatus = 2 THEN 'in_seleccionado' WHEN a.estatus = 9 THEN 'i_eliminar' END AS icono, SEC_TO_TIME(a.estimado) AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.alarmado, a.des_alarmado, a.des_inicio, a.des_fin, TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio) AS tiempo, TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio) AS des_tiempo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE a.requester = " + id + " AND a.estado = 0 ORDER BY a.viaje DESC"; 
    this.sentenciaR = "SELECT 'Placas', 'ID', 'Tacto', 'Estatus del tacto', 'Origen', 'Destino', 'Inicio del traslado', 'Fin del traslado', 'Tiempo estimado de traslado (seg)', 'Tiempo real del traslado (seg)', 'Se alarmó el tiempo de traslado?', 'Inicio de la descarga', 'Fin de la  descarga', 'Tiempo estimado de la descarga (seg)', 'Tiempo real de la descarga (seg)', 'Se alarmo la descarga?', 'Transporte', 'Nombre del chofer', 'Tipo de Carga', 'Tipo de vehiculo' UNION ALL SELECT c.nombre, a.id, a.viaje, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio)) AS tiempo, a.alarmado, a.des_inicio, a.des_fin, a.des_estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio)) AS des_tiempo, a.des_alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(i.nombre, 'N/A') AS ncarga, IFNULL(j.nombre, 'N/A') AS ntipo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales j ON c.tipo = j.id WHERE a.requester = " + id + " AND a.estado = 0"; 
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {

      let actualizar: boolean = false; 
      actualizar = JSON.stringify(this.historias) != JSON.stringify(resp);
      if (actualizar)
      {
        if (resp.length == 0)
        {
          this.historias = [];
        }
        if (this.historias.length == 0 && resp.length > 0)
        {
          this.historias = resp;
        }
        else 
        {
          for (i = this.historias.length - 1; i >= 0; i--)
          {
            let hallado = false;
            for (var j = 0; j < resp.length; j++)
            {
              if (this.historias[i].id ==  resp[j].id)
              {
                if (this.historias[i].estatus !=  resp[j].estatus || this.historias[i].alarmado !=  resp[j].alarmado || this.historias[i].des_alarmado !=  resp[j].des_alarmado) 
                {
                  this.historias[i].estatus = resp[j].estatus;
                  this.historias[i].idest = resp[j].idest;
                  this.historias[i].alarmado = resp[j].alarmado;
                  this.historias[i].des_alarmado = resp[j].des_alarmado;
                  
                }
                hallado = true;
                break;
              }
            }
            if (!hallado)
            {
              this.historias.splice(i, 1);
            }
          }
          for (var i = 0; i < resp.length; i++)
          {
            let agregar = true;
            for (var j = 0; j < this.historias.length; j++)
            {
              if (this.historias[j].id == resp[i].id)
              {
                agregar = false
                break;              
              }
            }
            if (agregar)
            {
              this.historias.splice(i, 0, resp[i])
              //this.sondeo = resp[i].id;
            }
          }
        }
        this.arreTiempos2.length = resp.length;
        this.arreTiempos3.length = resp.length;
        if (resp.length > 0)
        {
          this.datostransporte = resp[0];
        }
        else
        {
          this.datostransporte = {nombre: '', ntransporte: '', nchofer: '', ncarga: ''};
        }
        let cadAlarmas: string = "";
        {
          this.alarmados = 0;
          for (var i = 0; i < this.historias.length; i++)
          {
            if (this.historias[i].alarmado == 'S')
            {
              this.alarmados = this.alarmados + 1
            }
          }
          if (this.alarmados > 0)
          {
              cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? "uno alarmado" : this.alarmados + " alarmados") + "</span>";  
          }
        }

        let mensaje = this.historias.length + " tacto(s) " + cadAlarmas
        this.servicio.mensajeInferior.emit(mensaje);          


        setTimeout(() => {
          this.animando = true;
        }, 100);
      }
    })
  }

  trabajarRadio(id: number)
  {
    //Asignación
    if (id > 0)
    {
      //if (this.transfiriendo)
      //{
      //  this.asignando = false;
      //}
      this.procesoGuardar = 0;
      if (this.liberando)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "400px", panelClass: 'dialogo_atencion', data: { titulo: "Asignar un destino", tiempo: 0, mensaje: "El dispositivo actual está listo para emprender un tacto. Seleccione origen y destino y guarde los cambios", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_falla" }
        });
      }
    }
    this.servicio.mensajeInferior.emit("Edición de dispositivo");           
    this.bot3 = false;
    this.bot4 = false;
    this.editando = false;
    this.faltaMensaje = "";
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    this.error05 = false;
    this.error06 = false;
    this.servicio.activarSpinner.emit(true);
    this.modelo = 14;   
    //this.verTabla = false;   
    this.verTabla = this.movil;
    this.botonera1 = 3;
    id = !id ? 0 : id;
    let sentencia = "SELECT a.*, a.transporte AS linea, b.linea AS linea_vehiculo, a.chofer AS nchofer, b.chofer AS chofer_vehiculo, d.nombre AS ntransporte, d.nombre AS nlinea, b.agrupador_1, b.agrupador_2, b.tipo, b.nombre AS placa, b.carga AS bcarga, c.nombre AS ncarga, e.nombre AS chofer, e.referencia FROM " + this.servicio.rBD() + ".requesters a LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos AS b ON a.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales AS c ON b.tipo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes AS d ON a.transporte = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes AS e ON a.chofer = e.id WHERE a.id = " + id ;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.servicio.activarSpinner.emit(false); 
        if (this.asignando)
        {
          if (this.txtNombre)
          {
            this.txtNombre.nativeElement.focus();
          }
          else if (this.txtT1)
          {
            this.txtT1.nativeElement.focus();
          }

        }
        else if (this.transfiriendo)
        {
          if (this.lstC0)
          {
            this.lstC0.focus();
          }
        }
        else
        {
          if (this.txtNombre)
          {
            this.txtNombre.nativeElement.focus();
          }
        }
        
      }, 200);
      
      if (resp.length > 0 && !this.asignando)
      {
        let miFecha = "N/A";
        if (this.detalle.desde)
        {
          miFecha =this.servicio.fecha(2, this.detalle.desde, "EEE, dd/MMM/yyyy HH:mm:ss")
        } 
        if (+resp[0].nchofer == 0)
        {
          resp[0].nchofer = resp[0].chofer_vehiculo;
        }
        if (+resp[0].linea == 0)
        {
          resp[0].linea = resp[0].linea_vehiculo;
        }
        resp[0].color = resp[0].color ? ("#" + resp[0].color) : "";
        resp[0].carga = resp[0].bcarga; 
        this.detalle = resp[0];

        this.bot3 = this.detalle.preasignado=='S' && (this.miSeleccion==34 || this.miSeleccion==33);
        this.detalle.pager_req = this.pagerActual
        this.detalle.area = !this.detalle.area ? 0 : this.detalle.area;
        this.cadAsignando = "Placas: <strong>" + this.detalle.placa + "</strong> " + (this.pagerActual == 0 ? " Móvil: <strong>" + this.detalle.referencia : "Pager: <strong>" + this.pagerActual + "</strong> / " + resp[0].nombre) + "</strong><br>Chofer: <strong>" + (this.detalle.chofer ? this.detalle.chofer : "N/A") + "</strong><br>Transporte: <strong>" + (this.detalle.ntransporte ? this.detalle.ntransporte : "N/A") + "</strong><br>Fecha de llegada: <strong>" + miFecha + "</strong>";
        if (this.configuracion.asignar_automatico == "S")
        {
          this.buscarDestinos(2);
        }
      }
      else
      {
        this.cadAsignando = "";
        this.detalle.pager_req = 0;
        this.detalle.nombre = "";
        this.detalle.color = "#FFFFFF";
        this.detalle.destino = "0";
        this.detalle.origen = "0";
        this.detalle.linea = "0";
        this.detalle.chofer = "";
        this.detalle.nlinea = "";
        this.detalle.nchofer = "0";
        this.detalle.carga = "0";
        this.detalle.tipo = "0";
        this.detalle.referencia = "";
        this.detalle.telefono = "";
        this.detalle.ncarga = "";
        this.detalle.mensaje = "";
        this.detalle.mensaje_mmcall = "";
        if (this.configuracion.asignar_automatico == "S")
        {
          this.buscarDestinos(1);
        }
         
        
      }
      this.validarRutas3();
      if (this.miSeleccion != 35)
      {
        
        this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 25 ");
      }
      this.llenarListas(3, this.servicio.rBD() + ".cat_transportes", "");
      this.llenarListas(8, this.servicio.rBD() + ".cat_vehiculos", "");
      this.llenarListas(15, this.servicio.rBD() + ".cat_choferes", "");
      this.llenarListas(17, this.servicio.rBD() + ".cat_destinos", "");
      this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
      this.llenarListas(1, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 20 ");
      this.llenarListas(90, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 65 ");
      this.llenarListas(21, this.servicio.rBD() + ".cat_choferes", " WHERE (referencia <> '' AND NOT ISNULL(referencia)) ");
    })
  }
  
  editar(id: number)
  {
    this.error01 = false;
      this.error02 = false;
      this.error03 = false;
      this.error04 = false;
      this.error05 = false;
      this.error06 = false;
      this.error07 = false;
      this.error08 = false;
      this.error09 = false;
      this.error10 = false;
      this.error20 = false;
      this.error21 = false;
      this.error22 = false;
      this.error23 = false;
      this.error24 = false;
      this.error25 = false;
      this.error30 = false;
      this.error31 = false;
      this.error32 = false;
      this.error33 = false;
      this.error34 = false;
      this.error35 = false;
      
    if (this.miSeleccion >= 30)
    {
      if (this.miSeleccion == 37)

      {
        if (id >= 0)
        {
          this.asignando = false; 
          this.liberando = false; 
          this.editandoD = false; 
          this.transfiriendo = false;
          this.indiceActual = id;
          this.pagerActual = this.registros[id].id;
          this.reqActual = this.registros[id].idrequester;
          this.reanudar(this.registros[id].idrequester)
          return;
        }
      }
      
      else if (this.miSeleccion == 31)
      {
        if (id >= 0)
        {
          this.asignando = false; 
          this.liberando = false; 
          this.editandoD = false; 
          this.transfiriendo = false;
          this.indiceActual = id;
          this.pagerActual = this.registros[id].id;
          this.reqActual = this.registros[id].idrequester;
          this.cambiar(this.registros[id].idrequester)
          return;
        }
      }
      if (this.miSeleccion == 33)
      {
        if (id >= 0)
        {
          if (this.registros[id].estadonro==0)
          {
            this.asignando = true; 
            this.liberando = false; 
            this.editandoD = false; 
            this.transfiriendo = true;
            this.pagerActual = this.registros[id].id;
            this.reqActual = this.registros[id].idrequester;
            this.trabajarRadio(this.registros[id].idrequester);
            
            return;
          }
          else if (this.registros[id].estadonro==10)
          {
            this.validarTiempoRuta = false;
            this.validarTiempoDescarga = false;
            this.validarRuta = false;
            this.validarDescarga = false;
          
            this.liberando = false; 
            this.asignando = false;
            this.editandoD = false; 
            this.transfiriendo = true;
            this.pagerActual = this.registros[id].id;
            this.reqActual = this.registros[id].idrequester;
            this.trabajarRadio(this.registros[id].idrequester);
            
            return;
          }
          else if (this.registros[id].estadonro==20)
          {
            this.asignando = false; 
            this.liberando = false; 
            this.editandoD = false; 
            this.transfiriendo = false;
            this.pagerActual = this.registros[id].id;
            this.reqActual = this.registros[id].idrequester;
            this.cambiar(this.registros[id].idrequester)
            return;
          }
          else if (this.registros[id].estadonro==30)
          {
            this.asignando = false; 
            this.liberando = false; 
            this.editandoD = false; 
            this.transfiriendo = false;
            this.pagerActual = this.registros[id].id;
            this.reqActual = this.registros[id].idrequester;
            this.finalizar(this.registros[id].idrequester)
            return;
          }
          else if (this.registros[id].estadonro==40)
          {
            this.asignando = false; 
            this.liberando = false; 
            this.editandoD = false; 
            this.transfiriendo = false;
            this.indiceActual = id;
            this.pagerActual = this.registros[id].id;
            this.reqActual = this.registros[id].idrequester;
            this.reanudar(this.registros[id].idrequester);
            return;
          }
        }
      }
      else if (this.miSeleccion == 36)
      {
        if (id >= 0)
        {
          this.asignando = false; 
          this.liberando = false; 
          this.editandoD = false; 
          this.transfiriendo = false;
          this.indiceActual = id;
          this.pagerActual = this.registros[id].id;
          this.reqActual = this.registros[id].idrequester;
          this.finalizar(this.registros[id].idrequester)
          return;

        }
      }
      else if (this.miSeleccion == 35)
      {
        if (id >= 0)
        {
          this.asignando = false; 
          this.liberando = false; 
          this.editandoD = true; 
          this.transfiriendo = false;
          this.reqActual = this.registros[id].idrequester;
          this.pagerActual = this.registros[id].id;
          this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 30 " );
        }
      }
      else if (this.miSeleccion == 32)
      {
        if (id >= 0)
        {
          this.asignando = true; 
          this.liberando = false; 
          this.editandoD = false; 
          this.transfiriendo = this.configuracion.asignar_caseta == "S";
          this.pagerActual = this.registros[id].id;
          this.reqActual = this.registros[id].idrequester;
          this.nombreBeeper = this.registros[id].nombre;
        }
      }
      else if (this.miSeleccion == 34)
      {
        if (id >= 0)
        {
          this.pagerActual = this.registros[id].id;
          this.reqActual = this.registros[id].idrequester;
          if (!this.valTactos)
          {
            let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".movimientos_det WHERE requester = " + this.reqActual + " AND estado = 0";
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe(resp =>
            {
              if (resp.length > 0)
              {
                
                this.asignacion(id)
              }
              else
              {
                this.valTactos = true;
                this.editar(id);
              }
              
              
            })
            return
          }
          this.validarTiempoRuta = false;
          this.validarTiempoDescarga = false;
          this.validarRuta = false;
          this.validarDescarga = false;
          this.liberando = false; 
          this.asignando = false;
          this.editandoD = false; 
          this.transfiriendo = true;
          this.indiceActual = id;
          
          this.valTactos = false;
          
        }
        else
        {

        }
      }
      if (id==-1)
      {
        this.trabajarRadio(this.detalle.id);
      }
      else
      {
        this.trabajarRadio(this.registros[id].idrequester);
      }
      return;
    }
    let miID: number = 0;
    if (id == -1)
    {
      miID = this.detalle.id;
      
    }
    else
    {
      miID = this.registros[id].id;
      this.idRates = id; 
      this.arreHover[id] = false
    }
    //this.yaValidado = miID;
    this.botonera1 = 2;
    let sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    if (this.miSeleccion == 1)
    {
      this.iconoGeneral = "i_transporte";
      this.literalSingularArticulo = "El transporte";
      this.servicio.mensajeInferior.emit("Edición de transportes");   
      this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", ""); 
    }
    else if (this.miSeleccion == 2)
    {
      this.iconoGeneral = "i_camion";
      this.literalSingularArticulo = "El vehículo";
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID;   
      this.llenarListas(3, this.servicio.rBD() + ".cat_transportes", "");
      this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
      this.servicio.mensajeInferior.emit("Edición de vehículos");           
    }
    else if (this.miSeleccion == 3)
    {
      this.iconoGeneral = "i_chofer";
      this.literalSingularArticulo = "El chofer";
      this.servicio.mensajeInferior.emit("Edición de choferes");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_choferes a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    }
    else if (this.miSeleccion == 4)
    {
      this.iconoGeneral = "i_localizacion";
      this.literalSingularArticulo = "El destino";
      this.servicio.mensajeInferior.emit("Edición de destinos");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_destinos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", ""); 
      this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 30 ");
    }
    else if (this.miSeleccion == 5)
    {
      this.iconoGeneral = "i_general";
      this.literalSingularArticulo = "El registro general";
      this.servicio.mensajeInferior.emit("Edición de registros generales");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(7, this.servicio.rBD() + ".tablas", "");
      this.llenarListas(101, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 20 ");
      
    }
    else if (this.miSeleccion == 6)
    {
      this.iconoGeneral = "i_recipiente";
      this.literalSingularArticulo = "El recipiente";
      this.servicio.mensajeInferior.emit("Edición de recipientes");           
        sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_distribucion a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    }

    else if (this.miSeleccion == 7)
    {
      this.iconoGeneral = "i_correos";
      this.literalSingularArticulo = "El correo/reporte";
      this.servicio.mensajeInferior.emit("Edición de correos/reportes");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_correos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.listarListados(miID)
    }

    else if (this.miSeleccion == 8)
    {
      this.iconoGeneral = "i_alertas";
      this.literalSingularArticulo = "La alerta";
      this.servicio.mensajeInferior.emit("Edición de alertas");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_alertas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.llenarListas(31, this.servicio.rBD() + ".int_eventos", " WHERE estatus = 'A'");
      this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", "");
      this.asociarOperaciones(1, miID);
      
    }
    else if (this.miSeleccion == 9)
    {
      this.iconoGeneral = "i_turnos";
      this.literalSingularArticulo = "El turno";
      this.servicio.mensajeInferior.emit("Edición de turnos");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_turnos a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
    }
    else if (this.miSeleccion == 10)
    {
      this.iconoGeneral = "i_traductor";
      this.literalSingularArticulo = "La frase";
      this.servicio.mensajeInferior.emit("Edición de frases a traducir");           
      sentencia = "SELECT a.* FROM " + this.servicio.rBD() + ".traduccion a WHERE a.id = " + miID; 
    }
    else if (this.miSeleccion == 11)
    {
      this.iconoGeneral = "i_rutas";
      this.literalSingularArticulo = "La ruta";
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_rutas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID;   
      this.llenarListas(117, this.servicio.rBD() + ".cat_destinos", "");
      this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
      this.llenarListas(90, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 65 ");
      this.llenarListas(103, this.servicio.rBD() + ".cat_transportes", "");
      this.asociarTablas(miID);
      this.servicio.mensajeInferior.emit("Edición de rutas"); 
      this.validarRuta = false;     
      this.validarTiempoRuta = false
      this.rutaConfirmada = false;
      this.descargaConfirmada = false;
      this.choferSuspendidoConfirmado = false;
    }
    else if (this.miSeleccion == 17)
    {
      this.iconoGeneral = "i_programacion";
      this.literalSingularArticulo = "La descarga";
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_descargas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID;   
      this.llenarListas(117, this.servicio.rBD() + ".cat_destinos", "");
      this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
      this.llenarListas(90, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 65 ");
      this.llenarListas(103, this.servicio.rBD() + ".cat_transportes", "");
      this.asociarTablas(miID);
      this.servicio.mensajeInferior.emit("Edición de descargas"); 
      this.validarDescarga = false;     
      this.descargaConfirmada = false;
      this.validarTiempoDescarga = false
    }
    else if (this.miSeleccion == 12)
    {
      this.iconoGeneral = "i_grupos";
      this.literalSingularArticulo = "El usuario";
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".cat_usuarios a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID;   
      this.llenarListas(10, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 " );
      this.llenarListas(11, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 80 " );
      this.llenarListas(12, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 90 " );
      this.llenarListas(14, this.servicio.rBD() + ".cat_turnos", "");
      this.llenarListas(13, this.servicio.rBD() + ".politicas", "" );
      this.asociarTablas(miID);
      this.servicio.mensajeInferior.emit("Edición de usuarios"); 
      this.validarUSER = false;          
    }
    else if (this.miSeleccion == 14)
    {
      this.iconoGeneral = "i_politicas";
      this.literalSingularArticulo = "La política";
      this.servicio.mensajeInferior.emit("Edición de políticas");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.listarListados(miID)
    }
    else if (this.miSeleccion == 15)
    {
      this.iconoGeneral = "i_licencia";
      this.literalSingularArticulo = "La licencia";
      this.servicio.mensajeInferior.emit("Edición de licencias");           
      sentencia = "SELECT a.*, IFNULL(b.nombre, 'N/A') AS ucreo, IFNULL(c.nombre, 'N/A') AS ucambio FROM " + this.servicio.rBD() + ".politicas a LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios b ON a.creado = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios c ON a.modificado = c.id WHERE a.id = " + miID; 
      this.listarListados(miID)
    }
    this.adecuar();
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {

        this.faltaMensaje = "";
        this.error01 = false;
        this.error02 = false;
        this.error03 = false;
        this.error04 = false;
        this.error05 = false;
        this.error06 = false;
        this.error07 = false;
        this.error08 = false;
        this.error09 = false;
        this.error10 = false;
        this.error20 = false;
        this.error21 = false;
        this.error22 = false;
        this.error23 = false;
        this.error24 = false; 
        this.error25 = false;
        this.error30 = false;
        this.error31 = false;
        this.error32 = false;
        this.error33 = false;
        this.error34 = false;
        this.error35 = false;
        this.error36 = false;
        if (this.miSeleccion == 4)
        {
          resp[0].color = resp[0].color ? ("#" + resp[0].color) : "";
          resp[0].agrupador_2 = resp[0].agrupador_2 ? resp[0].agrupador_2 : "0";
          if (resp[0].audios_ruta)
          {
            resp[0].audios_ruta = resp[0].audios_ruta.replace(/\//g, '\\');
          }
          if (resp[0].audios_prefijo)
          {
            resp[0].audios_prefijo = resp[0].audios_prefijo.replace(/\//g, '\\');
          }
        }

        this.detalle = resp[0];
        
        this.mostrarImagenRegistro = "S"
        this.mensajeImagen = "Campo opcional"
        this.mostrarDetalle = true;  
        this.editando = false;
        this.modelo = this.modelo !=4 ? 14 : 4;
        this.noLeer = true;
        this.bot5 = true;
        this.bot6 = this.detalle.estatus == "A";
        this.bot7 = true;
        this.faltaMensaje = "";
        this.selListadoT = "S";
        ///
        if (this.detalle.sms == "S")
        this.seleccionMensaje.push("S");
        if (this.detalle.llamada == "S")
        this.seleccionMensaje.push("L");
        if (this.detalle.correo == "S")
        this.seleccionMensaje.push("C");
        if (this.detalle.mmcall == "S")
        this.seleccionMensaje.push("M");
        if (this.detalle.log == "S")
        this.seleccionMensaje.push("G")

        if (this.detalle.sms1 == "S")
        this.seleccionescalar1.push("S");
        if (this.detalle.llamada1 == "S")
        this.seleccionescalar1.push("L");
        if (this.detalle.correo1 == "S")
        this.seleccionescalar1.push("C");
        if (this.detalle.mmcall1 == "S")
        this.seleccionescalar1.push("M");
        if (this.detalle.log1 == "S")
        this.seleccionescalar1.push("G")

        if (this.detalle.sms2 == "S")
        this.seleccionescalar2.push("S");
        if (this.detalle.llamada2 == "S")
        this.seleccionescalar2.push("L");
        if (this.detalle.correo2 == "S")
        this.seleccionescalar2.push("C");
        if (this.detalle.mmcall2 == "S")
        this.seleccionescalar2.push("M");
        if (this.detalle.log2 == "S")
        this.seleccionescalar2.push("G")

        if (this.detalle.sms3 == "S")
        this.seleccionescalar3.push("S");
        if (this.detalle.llamada3 == "S")
        this.seleccionescalar3.push("L");
        if (this.detalle.correo3 == "S")
        this.seleccionescalar3.push("C");
        if (this.detalle.mmcall3 == "S")
        this.seleccionescalar3.push("M");
        if (this.detalle.log3 == "S")
        this.seleccionescalar3.push("G")

        if (this.detalle.sms4 == "S")
        this.seleccionescalar4.push("S");
        if (this.detalle.llamada4 == "S")
        this.seleccionescalar4.push("L");
        if (this.detalle.correo4 == "S")
        this.seleccionescalar4.push("C");
        if (this.detalle.mmcall4 == "S")
        this.seleccionescalar4.push("M");
        if (this.detalle.log4 == "S")
        this.seleccionescalar4.push("G")

        if (this.detalle.sms5 == "S")
        this.seleccionescalar5.push("S");
        if (this.detalle.llamada5 == "S")
        this.seleccionescalar5.push("L");
        if (this.detalle.correo5 == "S")
        this.seleccionescalar5.push("C");
        if (this.detalle.mmcall5 == "S")
        this.seleccionescalar5.push("M");
        if (this.detalle.log5 == "S")
        this.seleccionescalar5.push("G")
        this.detalle.url_mmcall = this.detalle.url_mmcall ? this.detalle.url_mmcall : "0";

        if (this.miSeleccion==1)
        {
          this.detalle.agrupador_1 = this.detalle.agrupador_1 ? this.detalle.agrupador_1 : "0";
        }
        else if (this.miSeleccion==2)
        {
          this.detalle.agrupador_1 = this.detalle.agrupador_1 ? this.detalle.agrupador_1 : "0";
          this.detalle.agrupador_2 = this.detalle.agrupador_2 ? this.detalle.agrupador_2 : "0";
          this.detalle.tipo = this.detalle.tipo ? this.detalle.tipo : "0";
        }
        else if (this.miSeleccion==12)
        {
          this.detalle.planta = !this.detalle.planta ? 0 : this.detalle.planta;
          this.detalle.departamento = !this.detalle.departamento ? 0 : this.detalle.departamento;
          this.detalle.compania = !this.detalle.compania ? 0 : this.detalle.compania;
        }
        else if (this.miSeleccion==11)
        {
          this.detalle.tipo = !this.detalle.tipo ? 0 : this.detalle.tipo;
          this.detalle.transporte = !this.detalle.transporte ? 0 : this.detalle.transporte;
          this.detalle.carga = !this.detalle.carga ? 0 : this.detalle.carga;
        }
        else if (this.miSeleccion==17)
        {
          this.detalle.tipo = !this.detalle.tipo ? 0 : this.detalle.tipo;
          this.detalle.transporte = !this.detalle.transporte ? 0 : this.detalle.transporte;
          this.detalle.carga = !this.detalle.carga ? 0 : this.detalle.carga;
        }
        else if (this.miSeleccion==7)
        {
          let mensajes = this.detalle.extraccion.split(";");
          this.nExtraccion = mensajes[0];
          this.nLapso = mensajes[1];
          this.nFrecuencia = mensajes[2];
          this.nHorario = mensajes[3];
        }
        else if (this.miSeleccion == 5)
        {
          this.detalle.id_relacionado = !this.detalle.id_relacionado ? 0 : this.detalle.id_relacionado;
        }
        
        if (this.miSeleccion==14)
        {
          let mensajes = this.detalle.complejidad.split(";");
          this.detalle.largo = mensajes[0];
          this.detalle.especial = mensajes[1];
          this.detalle.numeros = mensajes[2];
          this.detalle.mayusculas = mensajes[3];
        }
        
        ///
        if (this.despuesBusqueda == 1)
        {
          this.copiandoDesde = this.detalle.id;
          this.detalle.id = 0;
          this.piezasAntes = 0;
          this.equipoAntes = -1;
          this.mostrarImagenRegistro = "S";
          this.detalle.estatus = "A"
          this.bot3 = true;
          this.bot4 = true;
          if (this.detalle.id==0)
          {
            this.bot5 = false;
            this.bot6 = false;
            this.bot7 = false;
          }
          this.editando = true;
          this.faltaMensaje = "No se han guardado los cambios..."
          this.detalle.creado = "";
          this.detalle.modificado = "";
          this.detalle.modificacion = null;
          this.detalle.creacion = null;
        }
        else
        {
          this.editando = false;
          this.bot3 = false;
          this.bot4 = false;;
        }
        if (this.miSeleccion==12)
        {
          this.bot6 = this.detalle.admin != "S" && this.detalle.estatus=="A" && this.detalle.id>0;
          this.bot7 = this.detalle.admin != "S"  && this.detalle.id>0;
        }
        this.iniBot()
        if (this.miSeleccion != 5)
        {
          this.llenarListas(1, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + this.miSeleccion * 10);
        
        }
        if (this.miSeleccion != 2)
        {
          if  (this.miSeleccion != 4)
          {
            this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + (this.miSeleccion * 10 + 5));
          }
        }
        else
        {
          this.buscarMarca(this.detalle.agrupador_1)
        }
        
        setTimeout(() => {
          if (this.txtNombre)
          {
            this.txtNombre.nativeElement.focus();
          }
          else if (this.lstC0)
          {
            this.lstC0.focus();
          }
          this.animando = true;       
        }, 400);
        this.buscar();
      }
    },
    error => 
    {
      console.log(error)
    })
}

iniBot()
{
  this.bot = [ false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false ];
}


validarUsuario()
{
  
  let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_usuarios WHERE referencia = '" + this.detalle.referencia +"' AND id <> " + this.detalle.id;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length > 0)
    {
      this.validarUSER = false;
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "380px", panelClass: 'dialogo_atencion', data: { titulo: "Registro no guardado", tiempo: 0, mensaje: "Ya existe un usuario con este perfil de usuario:<br><br>Nombre: <strong>" + resp[0].nombre + "</strong><br>ID: <strong>" + resp[0].id + "</strong><br><br>Cambie la referencia del registro e intente de nuevo", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_falla" }
      });
    }
    else
    {
      this.validarUSER = true;
      this.guardar();
    }
    
  })
}

validarRutas()
{
  
  let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_rutas WHERE origen = " + this.detalle.origen + " AND destino = " + this.detalle.destino + " AND transporte = " + this.detalle.transporte + " AND carga = " + this.detalle.carga + " AND tipo = " + this.detalle.tipo;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    this.validarRuta = true;
    if (resp.length > 0)
    {
      this.rutaHallada = resp[0].id;
    }
    else
    {
      this.rutaHallada = -1;
    }
    this.guardar();
  })
}

validarInicial()
{
  
  let sentencia = "SELECT nombre FROM " + this.servicio.rBD() + ".cat_destinos WHERE inicial = 'S' AND id <> " + this.detalle.id + " AND estatus = 'A'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    
    if (resp.length > 0)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "360px", panelClass: 'dialogo_atencion', data: { titulo: "Ya hay un punto inicial", tiempo: 0, mensaje: "Ya hay un destino configurado como punto inicial por defecto<br><br><strong>" + resp[0].nombre + "</strong><br><br>Por favor modifique este destino y quitelo como punto inicial e intente de nuevo" , alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_inactivar" }
      });
    }
    else
    {
      this.validaInicial = true;
      this.guardar();
    }
    
  })
}

validarFinal()
{
  
  let sentencia = "SELECT nombre FROM " + this.servicio.rBD() + ".cat_destinos WHERE final = 'S' AND id <> " + this.detalle.id + " AND estatus = 'A'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    
    if (resp.length > 0)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "360px", panelClass: 'dialogo_atencion', data: { titulo: "Ya hay un punto final", tiempo: 0, mensaje: "Ya hay un destino configurado como punto final por defecto<br><br><strong>" + resp[0].nombre + "</strong><br><br>Por favor modifique este destino y quitelo como punto final e intente de nuevo" , alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_inactivar" }
      });
    }
    else
    {
      this.validaFinal = true;
      this.guardar();
    }
    
  })
}

validarPatio()
{
  
  let sentencia = "SELECT nombre FROM " + this.servicio.rBD() + ".cat_destinos WHERE patio_espera = 'S' AND id <> " + this.detalle.id + " AND estatus = 'A'";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    
    if (resp.length > 0)
    {
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "360px", panelClass: 'dialogo_atencion', data: { titulo: "Ya hay un patio de espera", tiempo: 0, mensaje: "Ya hay un destino configurado como patio de espera por defecto <br><br><strong>" + resp[0].nombre + "</strong><br><br>Por favor modifique este destino y quitelo como punto final e intente de nuevo" , alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_inactivar" }
      });
    }
    else
    {
      this.validaEspera = true;
      this.guardar();
    }
    
  })
}


validarRutas2()
{
  
  let sentencia = "SELECT SEC_TO_TIME(tiempo) AS tiempo, monitorear, tiempo AS tiemposeg, id FROM " + this.servicio.rBD() + ".cat_rutas WHERE origen = " + this.detalle.origen + " AND destino = " + this.detalle.destino + " AND (transporte = 0 OR transporte = " + this.detalle.transporte + ") AND (carga = 0 OR carga = " + this.detalle.carga + ") AND (tipo = 0 OR tipo = " + this.detalle.tipo + ") AND estatus = 'A' ORDER BY transporte DESC, carga DESC LIMIT 1";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    this.validarTiempoRuta = true;
    if (resp.length > 0)
    {
      this.tiempoRuta = resp[0].tiempo;
      this.tiempoRutaSeg = resp[0].tiemposeg;
      this.monitorear = resp[0].monitorear;
      
    }
    else
    {
      this.tiempoRutaSeg = 0;
      this.tiempoRuta = "";
      this.monitorear = "N"
    }
    this.validarDescargas2();
    
  })
}

validarRutas3()
{
  
  let sentencia = "SELECT SEC_TO_TIME(tiempo) AS tiempo, tiempo AS tiemposeg, id FROM " + this.servicio.rBD() + ".cat_rutas WHERE origen = " + this.detalle.origen + " AND destino = " + this.detalle.destino + " AND (transporte = 0 OR transporte = " + this.detalle.transporte + ") AND (carga = 0 OR carga = " + this.detalle.carga + ") AND (tipo = 0 OR tipo = " + this.detalle.tipo + ") AND estatus = 'A' ORDER BY transporte DESC, tipo DESC, carga DESC LIMIT 1";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length > 0)
    {
      this.tiempoRuta = resp[0].tiempo;
      this.tiempoRutaSeg = resp[0].tiemposeg;
      
    }
    else
    {
      this.tiempoRutaSeg = 0;
      this.tiempoRuta = "";
    }
  })
}



validarDescargas()
{
  
  let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_descargas WHERE destino = " + this.detalle.destino + " AND transporte = " + this.detalle.transporte + " AND carga = " + this.detalle.carga + " AND tipo = " + this.detalle.tipo;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    this.validarDescarga = true;
    if (resp.length > 0)
    {
      this.descargaHallada = resp[0].id;
    }
    else
    {
      this.descargaHallada = -1;
    }
    this.guardar();
  })
}

validarDescargas2()
{
  
  let sentencia = "SELECT SEC_TO_TIME(tiempo) AS tiempo, monitorear, tiempo AS tiemposeg, id FROM " + this.servicio.rBD() + ".cat_descargas WHERE destino = " + this.detalle.destino + " AND (transporte = 0 OR transporte = " + this.detalle.transporte + ") AND (carga = 0 OR carga = " + this.detalle.tipo + ") AND (tipo = 0 OR tipo = " + this.detalle.tipo + ") AND estatus = 'A' ORDER BY transporte DESC, carga DESC, tipo DESC LIMIT 1";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    this.validarTiempoDescarga = true;
    if (resp.length > 0)
    {
      this.tiempoDescarga = resp[0].tiempo;
      this.tiempoDescargaSeg = resp[0].tiemposeg;
      this.des_monitorear = resp[0].monitorear;
    }
    else
    {
      this.tiempoDescargaSeg = 0;
      this.tiempoDescarga = "";
      this.des_monitorear = "N";
    }
    this.guardar();
  })
}


validarMaquina()
{
  
  let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_vehiculos WHERE linea = " + this.detalle.linea + " AND id = " + this.detalle.maquina;
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe(resp =>
  {
    if (resp.length == 0)
    {
      this.validarM = false;
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "480px", panelClass: 'dialogo_atencion', data: { titulo: "Registro no guardado", tiempo: 0, mensaje: "El transporte y chofer que esta especificando no se corresponden", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_falla" }
      });
    }
    else
    {
      this.validarM = true;
      this.guardar();
    }
    
  })
}

   guardar()
  {
    let errores = 0;
    if (this.miSeleccion==12 && !this.validarUSER)
    {
      this.validarUsuario()
      return;
    }
    
    this.faltaMensaje = "";
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    this.error05 = false;
    this.error06 = false;
    this.error07 = false;
    this.error08 = false;
    this.error09 = false;
    this.error10 = false;
    this.error20 = false;
    this.error21 = false;
    this.error22 = false;
    this.error23 = false;
    this.error24 = false; 
    this.error25 = false;
    this.error30 = false;
    this.error31 = false;
    this.error32 = false;
    this.error33 = false;
    this.error34 = false;
    this.error35 = false;
    this.error36 = false;
    this.detalle.nombre = (this.detalle.nombre ? this.detalle.nombre : "");
    
    if (this.miSeleccion == 8)
    {
      this.detalle.tipo = (!this.detalle.tipo ? "0" : this.detalle.tipo);
      this.detalle.linea = (!this.detalle.linea ? "S" : this.detalle.linea);
      this.detalle.maquina = (!this.detalle.maquina ? "0" : this.detalle.maquina);
      this.detalle.area = (!this.detalle.area ? "0" : this.detalle.area);
      this.detalle.falla = (!this.detalle.falla ? "0" : this.detalle.falla);
      this.detalle.tiempo0 = (!this.detalle.tiempo0 ? "0" : this.detalle.tiempo0);
      this.detalle.proceso = (!this.detalle.proceso ? "0" : this.detalle.proceso);
      this.detalle.acumular_veces = (!this.detalle.acumular_veces ? "0" : this.detalle.acumular_veces);
      this.detalle.acumular_tiempo = (!this.detalle.acumular_tiempo ? "0" : this.detalle.acumular_tiempo);
      this.detalle.transcurrido = (!this.detalle.transcurrido ? "0" : this.detalle.transcurrido);
      this.detalle.lista = (!this.detalle.lista ? "0" : this.detalle.lista);
      this.detalle.tiempo1 = (!this.detalle.tiempo1 ? "0" : this.detalle.tiempo1);
      this.detalle.lista1 = (!this.detalle.lista1 ? "0" : this.detalle.lista1);
      this.detalle.veces1 = (!this.detalle.veces1 ? "0" : this.detalle.veces1);
      this.detalle.tiempo2 = (!this.detalle.tiempo2 ? "0" : this.detalle.tiempo2);
      this.detalle.lista2 = (!this.detalle.lista2 ? "0" : this.detalle.lista2);
      this.detalle.veces2 = (!this.detalle.veces2 ? "0" : this.detalle.veces2);
      this.detalle.tiempo3 = (!this.detalle.tiempo3 ? "0" : this.detalle.tiempo3);
      this.detalle.lista3 = (!this.detalle.lista3 ? "0" : this.detalle.lista3);
      this.detalle.veces3 = (!this.detalle.veces3 ? "0" : this.detalle.veces3);
      this.detalle.tiempo4 = (!this.detalle.tiempo4 ? "0" : this.detalle.tiempo4);
      this.detalle.lista4 = (!this.detalle.lista4 ? "0" : this.detalle.lista4);
      this.detalle.veces4 = (!this.detalle.veces4 ? "0" : this.detalle.veces4);
      this.detalle.tiempo5 = (!this.detalle.tiempo5 ? "0" : this.detalle.tiempo5);
      this.detalle.lista5 = (!this.detalle.lista5 ? "0" : this.detalle.lista5);
      this.detalle.veces5 = (!this.detalle.veces5 ? "0" : this.detalle.veces5);
      this.detalle.repetir_veces = (!this.detalle.repetir_veces ? "0" : this.detalle.repetir_veces);
      this.detalle.repetir_veces = (!this.detalle.repetir_veces ? "0" : this.detalle.repetir_veces);
      this.detalle.repetir_tiempo = (!this.detalle.repetir_tiempo ? "0" : this.detalle.repetir_tiempo);

      this.nLapso = (!this.nLapso ? "0" : this.nLapso);
      
    }
    if (this.miSeleccion != 10 && this.miSeleccion < 17 && this.miSeleccion != 11)
    {
      if (!this.detalle.nombre)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el Nombre/Descripción del registro";      
      }
    }
    if (this.miSeleccion == 32)
    {
      
      if (!this.detalle.referencia && this.configuracion.agregar_movil == "S")
      {
          errores = errores + 1;
          this.error31 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el número de móvil";      
      }
      if (!this.detalle.placa)
      {
          errores = errores + 1;
          this.error32 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar las placas del vehículo";      
      }
      if (!this.detalle.chofer)
      {
          errores = errores + 1;
          this.error33 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el chofer del vehículo";      
      }

      if (this.configuracion.asignar_caseta == "S")
      {
        if (this.detalle.destino!=0 || this.detalle.origen!=0)
        {
          if (this.detalle.origen==0)
          {
            errores = errores + 1;
            this.error01 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el origen de la ruta";      
          }
          if (this.detalle.destino==0)
          {
            errores = errores + 1;
            this.error02 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el destino de la ruta";      
          }
          if (this.detalle.origen > 0 && this.detalle.origen == this.detalle.destino)
          {
            errores = errores + 1;
            this.error04 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El origen debe ser diferente del destino";      
          }
          if (errores==0 && (!this.validarTiempoRuta))
          {
            this.detalle.tipo = !this.detalle.tipo ? "" : this.detalle.tipo;
            this.detalle.carga = !this.detalle.carga ? "" : this.detalle.carga;
            this.detalle.transporte = !this.detalle.transporte ? "0" : this.detalle.transporte;
            this.validarRutas2()
            return;
          }
          else if (errores==0 && this.tiempoRuta)
          {
            
          } 
          else if (errores==0 && this.tiempoRuta.length==0 && !this.rutaConfirmada)
          {
            const respuesta = this.dialogo.open(DialogoComponent, {
              width: "380px", panelClass: 'dialogo', data: { titulo: "Ruta no encontrada", tiempo: 0, mensaje: "La ruta que esta asignando a este dispositivo NO existe.<br>Si continua no se podrá monitorear el tiempo del traslado.<br><br><strong>¿Desea continuar sin monitorear?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Continuar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "in_pregunta" }
            });
            respuesta.afterClosed().subscribe(result => {
              if (result.accion == 1) 
              {
                this.rutaConfirmada = true;
                this.guardar();
              }
              else
              {
                this.rutaConfirmada = false;
                this.validarTiempoRuta = false;
                setTimeout(() => {
                  this.txtNombre.nativeElement.focus();
                }, 50);
              }
            })
            return;
          } 
        }
      }

      if (errores==0 && this.cadChofer==2 && !this.choferSuspendidoConfirmado)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "380px", panelClass: 'dialogo_atencion', data: { titulo: "Atención", tiempo: 0, mensaje: "El chofer <strong>" + this.detalle.chofer + "</strong> actualmente está <strong>SUSPENDIDO</strong><br><br>¿Desea continuar de todas maneras con la identificación?", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Continuar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_inactivar" }
        });
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
              {
                this.choferSuspendidoConfirmado = true;
                this.guardar();
              }
              else
              {
                this.choferSuspendidoConfirmado = false;
                setTimeout(() => {
                  this.txtT2.nativeElement.focus();
                }, 50);
              }
        });
        return;
      } 
    }
    //if (this.miSeleccion == 4)
    //{
      //if (this.detalle.inicial== 'S' && this.detalle.patio_espera== 'S')
      //{
      //    errores = errores + 1;
      //    this.error20 = true;
      //    this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El punto inicial no puede ser el mismo patio de espera";      
      //}
      //if (this.detalle.final == 'S' &&  this.detalle.patio_espera == 'S')
      //{
      //    errores = errores + 1;
      //    this.error21 = true;
      //    this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El patio final no puede ser el mismo patio de espera";      
      //}
    //}
    if (this.miSeleccion == 10)
    {
      this.detalle.literal = (this.detalle.literal ? this.detalle.literal : "");
      this.detalle.traduccion = (this.detalle.traduccion ? this.detalle.traduccion : "");
      if (!this.detalle.literal)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el literal a traducir";      
      }
      if (!this.detalle.traduccion)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar la traducción";      
      }
    }
    
    if (this.miSeleccion == 6)
    {
      this.detalle.telefonos = this.detalle.telefonos ? this.detalle.telefonos : ""; 
      this.detalle.correos = this.detalle.correos ? this.detalle.correos : "";
      this.detalle.mmcall = this.detalle.mmcall ? this.detalle.mmcall : "";
      if (this.detalle.mmcall == "" && this.detalle.telefonos == "" && this.detalle.correos == "")
      {
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para el recipiente";      
      }
    }
    if (this.miSeleccion == 7)
    {
      if (!this.detalle.para)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El reporte debe tener al menos un correo a quien enviar";      
      }
      if (this.nExtraccion <= "6" && this.nLapso == "0")
      {
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique los períodos a considerar";      
      }
      if (this.listaListad.selectedOptions.selected.length == 0)
      {
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un reporte";      
      }
      else if (this.listaListad.selectedOptions.selected.length > 10)
      {
        errores = errores + 1;
        this.error05 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") No es posible agregar más de 10 reportes a un reporte de correo";      
      }
    }
    if (this.miSeleccion == 12)
    {
      if (!this.detalle.referencia)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Indique el perfil para el inicio de sesión";      
      }
      if (this.lista4.selectedOptions.selected.length==0)
      {
          errores = errores + 1;
          this.error10 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El usuario debe tener al menos una opción/funcionalidad";      
      }
    }
    if (this.miSeleccion == 5 && this.detalle.tabla == 25)
    {
      if (!this.detalle.id_relacionado || this.detalle.id_relacionado==0)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Indique la marca asociada a este modelo";      
      }
    }
    if (this.miSeleccion == 8)
    {
      if (this.detalle.transcurrido == 0)
      {
          if (this.detalle.evento == 101)
          {
            errores = errores + 1;
            this.error03 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para generar la alerta";      
          }
          
      }
      
      if (this.detalle.acumular == 'S' && this.detalle.acumular_veces == 0)
      {
          errores = errores + 1;
          this.error04 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el número de veces que se debe acumular la alerta para generar la alarma";      
      }
      if (this.seleccionMensaje.length == 0)
      {
          errores = errores + 1;
          this.error20 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para la alerta";      
      }
      if (this.detalle.lista == 0)
      {
          errores = errores + 1;
          this.error30 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el recipiente";      
      }
      if (this.detalle.repetir != "N" && this.detalle.repetir_tiempo == 0)
      {
          errores = errores + 1;
          this.error05 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para la repetición";      
      }
      if (this.detalle.escalar1 != "N")
      {
        if (this.detalle.tiempo1 == 0)
        {
            errores = errores + 1;
            this.error06 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para el escalamiento";      
        }
        if (this.seleccionescalar1.length == 0)
        {
            errores = errores + 1;
            this.error21 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para el escalamiento";      
        }
        if (this.detalle.lista1 == 0)
        {
            errores = errores + 1;
            this.error31 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el recipiente para el escalamiento";      
        }
      }
      if (this.detalle.escalar2 != "N")
      {
        if (this.detalle.tiempo2 == 0)
        {
            errores = errores + 1;
            this.error07 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para el escalamiento";      
        }
        if (this.seleccionescalar2.length == 0)
        {
            errores = errores + 1;
            this.error22 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para el escalamiento";      
        }
        if (this.detalle.lista2 == 0)
        {
            errores = errores + 1;
            this.error32 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el recipiente para el escalamiento";      
        }
      }
      if (this.detalle.escalar3 != "N")
      {
        if (this.detalle.tiempo3 == 0)
        {
            errores = errores + 1;
            this.error08 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para el escalamiento";      
        }
        if (this.seleccionescalar3.length == 0)
        {
            errores = errores + 1;
            this.error23 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para el escalamiento";      
        }
        if (this.detalle.lista3 == 0)
        {
            errores = errores + 1;
            this.error33 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el recipiente para el escalamiento";      
        }
      }
      if (this.detalle.escalar4 != "N")
      {
        if (this.detalle.tiempo4 == 0)
        {
            errores = errores + 1;
            this.error09 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para el escalamiento";      
        }
        if (this.seleccionescalar4.length == 0)
        {
            errores = errores + 1;
            this.error24 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para el escalamiento";      
        }
        if (this.detalle.lista4 == 0)
        {
            errores = errores + 1;
            this.error34 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el recipiente para el escalamiento";      
        }
      }
      if (this.detalle.escalar5 != "N")
      {
        if (this.detalle.tiempo5 == 0)
        {
            errores = errores + 1;
            this.error10 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo de espera para el escalamiento";      
        }
        if (this.seleccionescalar5.length == 0)
        {
            errores = errores + 1;
            this.error25 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal de salida para el escalamiento";      
        }
        if (this.detalle.lista5 == 0)
        {
            errores = errores + 1;
            this.error35 = true;
            this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el recipiente para el escalamiento";      
        }
      }
    }
    if (this.miSeleccion == 6)
    {
      this.detalle.hora_desde = !this.detalle.hora_desde ? "00:00:00" : this.detalle.hora_desde;
      this.detalle.hora_hasta = !this.detalle.hora_hasta ? "23:59:59" : this.detalle.hora_hasta;
      
      if (this.detalle.nombre.telefonos == 0 && this.detalle.nombre.mmcall == 0 && this.detalle.nombre.correos == 0)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique al menos un canal para el recipiente";      
      }
      if (this.detalle.hora_desde && this.detalle.hora_hasta) 
      {
        if (this.detalle.hora_desde > this.detalle.hora_hasta)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") La hora inicial no puede ser mayor a la hora final";      
        }
      }
    }
    else if (this.miSeleccion == 14)
    {
      if (this.detalle.vence=="S")
      {
        if (this.detalle.diasvencimiento==0)
        {   
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique los días de vencimiento";      
        }
        else if (!this.detalle.diasvencimiento)
        {   
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique los días de vencimiento";      
        }
      }
    }
    else if (this.miSeleccion == 11)
    {
      if (this.detalle.origen==0)
      {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el origen de la ruta";      
      }
      if (this.detalle.destino==0)
      {
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el destino de la ruta";      
      }
      if (!this.detalle.tiempo || this.detalle.tiempo==0)
      {
        errores = errores + 1;
        this.error03 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el tiempo entre el origen y el destino";      
      }
      if (this.detalle.origen > 0 && this.detalle.origen == this.detalle.destino)
      {
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El origen debe ser diferente del destino";      
      }
    }
    else if (this.miSeleccion == 34)
    {
      if (this.detalle.origen==0)
      {
        errores = errores + 1;
        this.error01 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el origen de la ruta";      
      }
      if (this.detalle.destino==0)
      {
        errores = errores + 1;
        this.error02 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Especifique el destino de la ruta";      
      }
      if (this.detalle.origen > 0 && this.detalle.origen == this.detalle.destino)
      {
        errores = errores + 1;
        this.error04 = true;
        this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") El origen debe ser diferente del destino";      
      }
      if (errores==0 && (!this.validarTiempoRuta))
      {
        this.detalle.tipo = !this.detalle.tipo ? "" : this.detalle.tipo;
        this.detalle.carga = !this.detalle.carga ? "" : this.detalle.carga;
        this.detalle.transporte = !this.detalle.transporte ? "0" : this.detalle.transporte;
        this.validarRutas2()
        return;
      }
      else if (errores==0 && this.tiempoRuta)
      {
        
      } 
      else if (errores==0 && this.tiempoRuta.length==0 && !this.rutaConfirmada)
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "380px", panelClass: 'dialogo', data: { titulo: "Ruta no encontrada", tiempo: 0, mensaje: "La ruta que esta asignando a este dispositivo NO existe.<br>Si continua no se podrá monitorear el tiempo del traslado.<br><br><strong>¿Desea continuar sin monitorear?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Continuar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            this.rutaConfirmada = true;
            this.guardar();
          }
          else
          {
            this.rutaConfirmada = false;
            this.validarTiempoRuta = false;
            setTimeout(() => {
              this.txtNombre.nativeElement.focus();
            }, 50);
          }
        })
        return;
      }
    }
    if (errores > 0)
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = "El registro no se ha guardado por falta de información";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.faltaMensaje = "<strong>No se ha guardado el registro por el siguiente mensaje:</strong> " + this.faltaMensaje
      setTimeout(() => {
    if (this.error01 && this.miSeleccion!=11 && this.miSeleccion!=34)
        {
          this.txtNombre.nativeElement.focus();
        }
        else if (this.error02 && this.miSeleccion==5)
        {
          this.lstC0.focus();
        }
        else if (this.error31 && this.miSeleccion==32)
        {
          this.txtNombre.nativeElement.focus();
        }
        else if (this.error32 && this.miSeleccion==32)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error33 && this.miSeleccion==32)
        {
          this.txtT2.nativeElement.focus();
        }
        else if (this.error01 && this.miSeleccion==32)
        {
          this.lstC0.focus();
        }
        else if (this.error02 && this.miSeleccion==32)
        {
          this.lstC1.focus();
        }
        else if (this.error04 && this.miSeleccion==32)
        {
          this.lstC0.focus();
        }
        else if (this.error20 && this.miSeleccion==4)
        {
          this.lstC0.focus();
        }
        else if (this.error21 && this.miSeleccion==4)
        {
          this.lstC1.focus();
        }
        else if (this.error01 && this.miSeleccion==11)
        {
          this.lstC0.focus();
        }
        else if (this.error02 && this.miSeleccion==11)
        {
          this.lstC1.focus();
        }
        else if (this.error03 && this.miSeleccion==11)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error04 && this.miSeleccion==11)
        {
          this.lstC0.focus();
        }

        else if (this.error01 && this.miSeleccion==34)
        {
          this.lstC0.focus();
        }
        else if (this.error02 && this.miSeleccion==34)
        {
          this.lstC1.focus();
        }
        else if (this.error04 && this.miSeleccion==34)
        {
          this.lstC0.focus();
        }


        else if (this.error03 && this.miSeleccion>=17)
        {
          this.lstC0.focus();
        }
        else if (this.error03 && this.miSeleccion>=17)
        {
          this.lstC0.focus();
        }
        else if (this.error04 && this.miSeleccion>=17)
        {
          this.lstC1.focus();
        }
        else if (this.error02 && this.miSeleccion==12)
        {
          this.txtT1.nativeElement.focus();
        }        
        else if (this.error02 && this.miSeleccion==10)
        {
          this.txtTelefonos.nativeElement.focus();
        }
        else if (this.error02 && this.miSeleccion==14)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error02)
        {
          this.txtTelefonos.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion == 8)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error36 && this.miSeleccion == 8)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion == 6)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error03 && this.miSeleccion == 7)
        {
          this.listaListad.focus();
        }
        else if (this.error04 && this.miSeleccion == 7)
        {
          this.txtT1.nativeElement.focus();
        }
        else if (this.error10 && this.miSeleccion == 12)
        {
          const respuesta = this.dialogo.open(DialogoComponent, {
            width: "360px", panelClass: 'dialogo_atencion', data: { titulo: "Registro no guardado", tiempo: 0, mensaje: "El usuario no tiene ninguna opción o funcionalidad. Por favor agregue al menos una opción al usuario", alto: "60", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_grupos" }
          });
          
          this.lista4.focus();
        }
        else if (this.error04)
        {
          this.txtT2.nativeElement.focus();
        }
        else if (this.error20)
        {
          this.lstC0.focus();
        }
        else if (this.error30)
        {
          this.lstC10.focus();
        }
        else if (this.error05)
        {
          this.txtT3.nativeElement.focus();
        }
        else if (this.error06)
        {
          this.txtT4.nativeElement.focus();
        }
        else if (this.error21)
        {
          this.lstC1.focus();
        }
        else if (this.error31)
        {
          this.lstC11.focus();
        }
        else if (this.error07)
        {
          this.txtT5.nativeElement.focus();
        }
        else if (this.error22)
        {
          this.lstC2.focus();
        }
        else if (this.error32)
        {
          this.lstC12.focus();
        }
        else if (this.error08)
        {
          this.txtT6.nativeElement.focus();
        }
        else if (this.error23)
        {
          this.lstC3.focus();
        }
        else if (this.error33)
        {
          this.lstC13.focus();
        }
        else if (this.error09)
        {
          this.txtT7.nativeElement.focus();
        }
        else if (this.error24)
        {
          this.lstC4.focus();
        }
        else if (this.error34)
        {
          this.lstC14.focus();
        }
        else if (this.error10)
        {
          this.txtT8.nativeElement.focus();
        }
        else if (this.error25)
        {
          this.lstC5.focus();
        }
        else if (this.error35)
        {
          this.lstC15.focus();
        }
        
      }, 300);
      return;
    }
    this.validarUSER = false;
    this.validarCU = false;
    this.validarM = false;
    this.editando = false;
    this.faltaMensaje = "";
    this.detalle.imagen = !this.detalle.imagen ? "" : this.detalle.imagen;
    this.detalle.url_mmcall = !this.detalle.url_mmcall ? 0 : this.detalle.url_mmcall;
    this.detalle.referencia = !this.detalle.referencia ? "" : this.detalle.referencia;
    this.detalle.notas = !this.detalle.notas ? "" : this.detalle.notas; 
    this.detalle.agrupador_1 = !this.detalle.agrupador_1 ? "0" : this.detalle.agrupador_1; 
    this.detalle.agrupador_2 = !this.detalle.agrupador_2 ? "0" : this.detalle.agrupador_2; 
    this.detalle.carga = !this.detalle.carga ? "0" : this.detalle.carga; 
    this.detalle.tipo = !this.detalle.tipo ? "0" : this.detalle.tipo; 
    this.detalle.maquina = !this.detalle.maquina ? "0" : this.detalle.maquina; 
    this.detalle.area = !this.detalle.area ? "0" : this.detalle.area; 
    this.detalle.extraccion = this.nExtraccion + ";" + this.nLapso + ";" + this.nFrecuencia + ";" + this.nHorario 
    let sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_transportes (nombre, referencia, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, agrupador_1, agrupador_2) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', " + +this.detalle.url_mmcall + ", '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + this.detalle.agrupador_1 + ", "  + this.detalle.agrupador_2 + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();"
    if (this.detalle.id > 0)
    {
      sentencia = "UPDATE " + this.servicio.rBD() + ".cat_transportes SET nombre = '" + this.detalle.nombre + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = " + +this.detalle.url_mmcall + ", imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
    }
    if (this.miSeleccion == 2)
    {
      this.detalle.linea = !this.detalle.linea ? "0" : this.detalle.linea; 
       
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_vehiculos (nombre, referencia, notas, imagen, creado, modificado, creacion, modificacion, linea, agrupador_1, agrupador_2, tipo) VALUES ('" + this.detalle.nombre.toUpperCase() + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), " + +this.detalle.linea + ", " + this.detalle.agrupador_1 + ", "  + this.detalle.agrupador_2  + ", "  + this.detalle.tipo + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_vehiculos SET nombre = '" + this.detalle.nombre.toUpperCase() + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = " + +this.detalle.url_mmcall + ", imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), linea = " + +this.detalle.linea + ", agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + ", tipo = " + this.detalle.tipo + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();";
      }
    }
    else if (this.miSeleccion == 3)
    {
      let audios_ruta = ""
      if (this.detalle.audios_ruta)
      {
        audios_ruta = this.detalle.audios_ruta.replace(/\\/g, '/')
      }
      let audios_prefijo = ""
      if (this.detalle.audios_prefijo)
      {
        audios_prefijo = this.detalle.audios_prefijo.replace(/\\/g, '/')
      }
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_choferes (nombre, referencia, notas, correo, imagen, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre.toUpperCase() + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.correo + "', '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_choferes SET nombre = '" + this.detalle.nombre.toUpperCase() + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', correo = '" + this.detalle.correo + "', imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
      }
    }
    if (this.miSeleccion == 4)
    {
      if (!this.validaInicial && this.detalle.inicial=='S')
      {
        this.validarInicial()
        return;
      }
      if (!this.validaFinal && this.detalle.final=='S')
      {
        this.validarFinal()
        return;
      }
      //if (!this.validaEspera && this.detalle.patio_espera=='S')
      //{
      //  this.validarPatio()
      //  return;
      //}
      this.validaInicial = false;
      this.validaFinal = false;
      this.validaEspera = false;
      let audios_ruta = ""
      if (this.detalle.audios_ruta)
      {
        audios_ruta = this.detalle.audios_ruta.replace(/\\/g, '/')
      }
      let audios_prefijo = ""
      if (this.detalle.audios_prefijo)
      {
        audios_prefijo = this.detalle.audios_prefijo.replace(/\\/g, '/')
      }
      
      let elColor = this.detalle.color ? this.detalle.color.substr(1) : "";
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_destinos (nombre, audios_ruta, audios_activar, audios_prefijo, audios_general, referencia, notas, url_mmcall, imagen, creado, modificado, creacion, modificacion, color, agrupador_2, inicial, final, patio_espera) VALUES ('" + this.detalle.nombre + "', '" + audios_ruta + "', '" + this.detalle.audios_activar + "', '" + audios_prefijo + "', '" + this.detalle.audios_general + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', " + +this.detalle.url_mmcall + ", '" + this.detalle.imagen + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW(), '" + elColor + "', " + +this.detalle.agrupador_2 + ", '" + this.detalle.inicial + "', '" + this.detalle.final + "', '" + this.detalle.patio_espera + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_destinos SET nombre = '" + this.detalle.nombre + "', audios_ruta = '" + audios_ruta + "', audios_activar = '" + this.detalle.audios_activar + "', audios_prefijo = '" + audios_prefijo + "', audios_general = '" + this.detalle.audios_general + "', estatus = '" + this.detalle.estatus + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', url_mmcall = " + +this.detalle.url_mmcall + ", imagen = '" + this.detalle.imagen + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW(), color = '" + elColor + "', agrupador_2 = " + +this.detalle.agrupador_2 + ", inicial = '" + this.detalle.inicial + "', final = '" + this.detalle.final + "', patio_espera = '" + this.detalle.patio_espera + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
      }
    }

    else if (this.miSeleccion == 5)
    {
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_generales (nombre, tabla, id_relacionado, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', " + this.detalle.tabla + ", '" + this.detalle.id_relacionado + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_generales SET nombre = '" + this.detalle.nombre + "', id_relacionado = '" + this.detalle.id_relacionado + "', tabla = " + this.detalle.tabla + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
      }
    }
    else if (this.miSeleccion == 6)
    {
      
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_distribucion (nombre, referencia, telefonos, hora_desde, hora_hasta, correos, mmcall, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.telefonos + "', '" + this.detalle.hora_desde + "', '" + this.detalle.hora_hasta + "', '" + this.detalle.correos + "', '" + this.detalle.mmcall + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_distribucion SET nombre = '" + this.detalle.nombre + "', telefonos = '" + this.detalle.telefonos + "', referencia = '" + this.detalle.referencia + "', hora_desde = '" + this.detalle.hora_desde + "', hora_hasta = '" + this.detalle.hora_hasta + "', correos = '" + this.detalle.correos + "', mmcall = '" + this.detalle.mmcall + "', estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();";
      }
    }
    else if (this.miSeleccion == 7)
    {
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_correos (nombre, para, copia, oculta, titulo, cuerpo, extraccion, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.para + "', '" + this.detalle.copia + "', '" + this.detalle.oculta + "', '" + this.detalle.titulo + "', '" + this.detalle.cuerpo + "', '" + this.detalle.extraccion + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_correos SET nombre = '" + this.detalle.nombre + "', para = '" + this.detalle.para + "', copia = '" + this.detalle.copia + "', oculta = '" + this.detalle.oculta + "', titulo = '" + this.detalle.titulo + "', cuerpo = '" + this.detalle.cuerpo + "', extraccion = '" + this.detalle.extraccion + "', estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
      }
    }
    else if (this.miSeleccion == 8)
    {
      this.detalle.linea = !this.detalle.linea ? "S" : this.detalle.linea; 
    
      if (this.seleccionMensaje)
      {
        this.detalle.sms = this.seleccionMensaje.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall = this.seleccionMensaje.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada = this.seleccionMensaje.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo = this.seleccionMensaje.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log = this.seleccionMensaje.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar1)
      {
        this.detalle.sms1 = this.seleccionescalar1.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall1 = this.seleccionescalar1.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada1 = this.seleccionescalar1.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo1 = this.seleccionescalar1.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log1 = this.seleccionescalar1.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar2)
      {
        this.detalle.sms2 = this.seleccionescalar2.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall2 = this.seleccionescalar2.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada2 = this.seleccionescalar2.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo2 = this.seleccionescalar2.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log2 = this.seleccionescalar2.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar3)
      {
        this.detalle.sms3 = this.seleccionescalar3.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall3 = this.seleccionescalar3.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada3 = this.seleccionescalar3.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo3 = this.seleccionescalar3.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log3 = this.seleccionescalar3.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar4)
      {
        this.detalle.sms4 = this.seleccionescalar4.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall4 = this.seleccionescalar4.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada4 = this.seleccionescalar4.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo4 = this.seleccionescalar4.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log4 = this.seleccionescalar4.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      if (this.seleccionescalar5)
      {
        this.detalle.sms5 = this.seleccionescalar5.findIndex(c => c=="S") > -1 ? "S" : "N";
        this.detalle.mmcall5 = this.seleccionescalar5.findIndex(c => c=="M") > -1 ? "S" : "N";
        this.detalle.llamada5 = this.seleccionescalar5.findIndex(c => c=="L") > -1 ? "S" : "N";
        this.detalle.correo5 = this.seleccionescalar5.findIndex(c => c=="C") > -1 ? "S" : "N";
        this.detalle.log5 = this.seleccionescalar5.findIndex(c => c=="G") > -1 ? "S" : "N";
      }
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_alertas (proceso, evento, referencia, nombre, solapar, tipo, notas, linea, transcurrido, acumular, acumular_veces, acumular_tiempo, acumular_inicializar, log, sms, correo, llamada, mmcall, lista, escalar1, tiempo1, lista1, log1, sms1, correo1, llamada1, mmcall1, repetir1, veces1, escalar2, tiempo2, lista2, log2, sms2, correo2, llamada2, mmcall2, repetir2, veces2, escalar3, tiempo3, lista3, log3, sms3, correo3, llamada3, mmcall3, repetir3, veces3, escalar4, tiempo4, lista4, log4, sms4, correo4, llamada4, mmcall4, repetir4, veces4, escalar5, tiempo5, lista5, log5, sms5, correo5, llamada5, mmcall5, repetir5, veces5, repetir, repetir_tiempo, repetir_veces, informar_resolucion, resolucion_mensaje, cancelacion_mensaje, tiempo0, mensaje, titulo, mensaje_mmcall, creado, modificado, creacion, modificacion) VALUES (" + this.detalle.proceso + ", " + this.detalle.evento + ", '" + this.detalle.referencia + "', '" + this.detalle.nombre + "', '" + this.detalle.solapar + "', " + this.detalle.tipo + ", '" + this.detalle.notas + "', '" + this.detalle.linea + "', " + this.detalle.transcurrido + ", '" + this.detalle.acumular + "', " + this.detalle.acumular_veces + ", " + this.detalle.acumular_tiempo + ", '" + this.detalle.acumular_inicializar + "', '" + this.detalle.log + "', '" + this.detalle.sms + "', '" + this.detalle.correo + "', '" + this.detalle.llamada + "', '" + this.detalle.mmcall + "', " + this.detalle.lista + ", '" + this.detalle.escalar1 + "', " + this.detalle.tiempo1 + ", " + this.detalle.lista1 + ", '" + this.detalle.log1 + "', '" + this.detalle.sms1 + "', '" + this.detalle.correo1 + "', '" + this.detalle.llamada1 + "', '" + this.detalle.mmcall1 + "', '" + this.detalle.repetir1 + "', " + this.detalle.veces1 + ", '" + this.detalle.escalar2 + "', " + this.detalle.tiempo2 + ", " + this.detalle.lista2 + ", '" + this.detalle.log2 + "', '" + this.detalle.sms2 + "', '" + this.detalle.correo2 + "', '" + this.detalle.llamada2 + "', '" + this.detalle.mmcall2 + "', '" + this.detalle.repetir2 + "', " + this.detalle.veces2 + ", '" + this.detalle.escalar3 + "', " + this.detalle.tiempo3 + ", " + this.detalle.lista3 + ", '" + this.detalle.log3 + "', '" + this.detalle.sms3 + "', '" + this.detalle.correo3 + "', '" + this.detalle.llamada3 + "', '" + this.detalle.mmcall3 + "', '" + this.detalle.repetir3 + "', " + this.detalle.veces3 + ", '" + this.detalle.escalar4 + "', " + this.detalle.tiempo4 + ", " + this.detalle.lista4 + ", '" + this.detalle.log4 + "', '" + this.detalle.sms4 + "', '" + this.detalle.correo4 + "', '" + this.detalle.llamada4 + "', '" + this.detalle.mmcall4 + "', '" + this.detalle.repetir4 + "', " + this.detalle.veces4 + ", '" + this.detalle.escalar5 + "', " + this.detalle.tiempo5 + ", " + this.detalle.lista5 + ", '" + this.detalle.log5 + "', '" + this.detalle.sms5 + "', '" + this.detalle.correo5 + "', '" + this.detalle.llamada5 + "', '" + this.detalle.mmcall5 + "', '" + this.detalle.repetir5 + "', " + this.detalle.veces5 + ", '" + this.detalle.repetir + "', " + this.detalle.repetir_tiempo + ", " + this.detalle.repetir_veces + ", '" + this.detalle.informar_resolucion + "', '" + this.detalle.resolucion_mensaje + "', '" + this.detalle.cancelacion_mensaje + "', " + this.detalle.tiempo0 + ", '" + this.detalle.mensaje + "', '" + this.detalle.titulo + "', '" + this.detalle.mensaje_mmcall + "',  " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_alertas SET estatus = '" + this.detalle.estatus + "', evento = " + this.detalle.evento + ", tiempo0 = " + this.detalle.tiempo0 + ", proceso = " + this.detalle.proceso + ", referencia = '" + this.detalle.referencia + "', nombre = '" + this.detalle.nombre + "', solapar = '" + this.detalle.solapar + "', tipo = " + this.detalle.tipo + ", notas = '" + this.detalle.notas + "', linea = '" + this.detalle.linea + "', transcurrido = " + this.detalle.transcurrido + ", acumular = '" + this.detalle.acumular + "', acumular_veces = " + this.detalle.acumular_veces + ", acumular_tiempo = " + this.detalle.acumular_tiempo + ", acumular_inicializar = '" + this.detalle.acumular_inicializar + "', log = '" + this.detalle.log + "', sms = '" + this.detalle.sms + "', correo = '" + this.detalle.correo + "', llamada = '" + this.detalle.llamada + "', mmcall = '" + this.detalle.mmcall + "', lista = " + this.detalle.lista + ", escalar1 = '" + this.detalle.escalar1 + "', tiempo1 = " + this.detalle.tiempo1 + ", lista1 = " + this.detalle.lista1 + ", log1 = '" + this.detalle.log1 + "', sms1 = '" + this.detalle.sms1 + "', correo1 = '" + this.detalle.correo1 + "', llamada1 = '" + this.detalle.llamada1 + "', mmcall1 = '" + this.detalle.mmcall1 + "', repetir1 = '" + this.detalle.repetir1 + "', veces1 = " + this.detalle.veces1 + ", escalar2 = '" + this.detalle.escalar2 + "', tiempo2 = " + this.detalle.tiempo2 + ", lista2 = " + this.detalle.lista2 + ", log2 = '" + this.detalle.log2 + "', sms2 = '" + this.detalle.sms2 + "', correo2 = '" + this.detalle.correo2 + "', llamada2 = '" + this.detalle.llamada2 + "', mmcall2 = '" + this.detalle.mmcall2 + "', repetir2 = '" + this.detalle.repetir2 + "', veces2 = " + this.detalle.veces2 + ", escalar3 = '" + this.detalle.escalar3 + "', tiempo3 = " + this.detalle.tiempo3 + ", lista3 = " + this.detalle.lista3 + ", log3 = '" + this.detalle.log3 + "', sms3 = '" + this.detalle.sms3 + "', correo3 = '" + this.detalle.correo3 + "', llamada3 = '" + this.detalle.llamada3 + "', mmcall3 = '" + this.detalle.mmcall3 + "', repetir3 = '" + this.detalle.repetir3 + "', veces3 = " + this.detalle.veces3 + ", escalar4 = '" + this.detalle.escalar4 + "', tiempo4 = " + this.detalle.tiempo4 + ", lista4 = " + this.detalle.lista4 + ", log4 = '" + this.detalle.log4 + "', sms4 = '" + this.detalle.sms4 + "', correo4 = '" + this.detalle.correo4 + "', llamada4 = '" + this.detalle.llamada4 + "', mmcall4 = '" + this.detalle.mmcall4 + "', repetir4 = '" + this.detalle.repetir4 + "', veces4 = " + this.detalle.veces4 + ", escalar5 = '" + this.detalle.escalar5 + "', tiempo5 = " + this.detalle.tiempo5 + ", lista5 = " + this.detalle.lista5 + ", log5 = '" + this.detalle.log5 + "', sms5 = '" + this.detalle.sms5 + "', correo5 = '" + this.detalle.correo5 + "', llamada5 = '" + this.detalle.llamada5 + "', mmcall5 = '" + this.detalle.mmcall5 + "', repetir5 = '" + this.detalle.repetir5 + "', veces5 = " + this.detalle.veces5 + ", repetir = '" + this.detalle.repetir + "', repetir_tiempo = " + this.detalle.repetir_tiempo + ", repetir_veces = " + this.detalle.repetir_veces + ", informar_resolucion = '" + this.detalle.informar_resolucion + "', resolucion_mensaje = '" + this.detalle.resolucion_mensaje + "', cancelacion_mensaje = '" + this.detalle.cancelacion_mensaje + "', mensaje = '" + this.detalle.mensaje + "', titulo = '" + this.detalle.titulo + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();"; 
      }
    }
    else if (this.miSeleccion == 9)
    {
      this.detalle.inicia = !this.detalle.inicia ? this.servicio.fecha(1, "", "HH") + ":00:00" : this.detalle.inicia;
      this.detalle.termina = !this.detalle.termina ? this.servicio.fecha(1, "", "HH") + ":00:00" : this.detalle.termina;
      this.detalle.secuencia = !this.detalle.secuencia ? "1" : this.detalle.secuencia;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_turnos (nombre, referencia, inicia, termina, cambiodia, especial, tipo, mover, secuencia, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.inicia + "', '" + this.detalle.termina + "', '" + this.detalle.cambiodia + "', '" + this.detalle.especial + "', " + +this.detalle.tipo + ", " + +this.detalle.mover + ", " + this.detalle.secuencia + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_turnos SET nombre = '" + this.detalle.nombre + "', secuencia = " + this.detalle.secuencia + ", referencia = '" + this.detalle.referencia + "', inicia = '" + this.detalle.inicia + "', termina = '" + this.detalle.termina + "', cambiodia = '" + this.detalle.cambiodia + "', especial = '" + this.detalle.especial + "', tipo = " + +this.detalle.tipo + ", mover = " + +this.detalle.mover + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
      }
    }
    else if (this.miSeleccion == 10)
    {
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".traduccion (literal, traduccion) VALUES ('" + this.detalle.literal + "', '" + this.detalle.traduccion + "');"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".traduccion SET literal = '" + this.detalle.literal + "', traduccion = '" + this.detalle.traduccion + "' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET traducciones = NOW();";
      }
    }
    else if (this.miSeleccion == 11)
    {
      if (!this.validarRuta)
      {
        this.validarRutas()
        return;
      }
      if (this.rutaHallada != -1)
      {
        this.detalle.id = this.rutaHallada
      }
      this.validarRuta = false;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_rutas (origen, destino, transporte, tipo, carga, tiempo, monitorear, creado, modificado, creacion, modificacion) VALUES (" + +this.detalle.origen + ", " + +this.detalle.destino + ", " + this.detalle.transporte + ", " + this.detalle.tipo + ", " + +this.detalle.carga + ", "+ +this.detalle.tiempo + ", '" + this.detalle.monitorear + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_rutas SET origen = " + +this.detalle.origen + ", destino = " + +this.detalle.destino + ", transporte = " + +this.detalle.transporte + ", carga = " + +this.detalle.carga + ", tipo = " + +this.detalle.tipo + ", monitorear = '" + this.detalle.monitorear + "', estatus = '" + this.detalle.estatus + "', tiempo = " + +this.detalle.tiempo + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET traducciones = NOW();";
      }
    }
    else if (this.miSeleccion == 17)
    {
      if (!this.validarDescarga)
      {
        this.validarDescargas()
        return;
      }
      if (this.descargaHallada != -1)
      {
        this.detalle.id = this.descargaHallada
      }
      
      this.validarDescarga = false;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_descargas (destino, transporte, tipo, carga, tiempo, monitorear, creado, modificado, creacion, modificacion) VALUES (" + +this.detalle.destino + ", " + this.detalle.transporte + ", " + this.detalle.tipo + ", " + +this.detalle.carga + ", "+ +this.detalle.tiempo + ", '" + this.detalle.monitorear + "', " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_descargas SET destino = " + +this.detalle.destino + ", transporte = " + +this.detalle.transporte + ", carga = " + +this.detalle.carga + ", tipo = " + +this.detalle.tipo + ", monitorear = '" + this.detalle.monitorear + "', estatus = '" + this.detalle.estatus + "', tiempo = " + +this.detalle.tiempo + " WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET traducciones = NOW();";
      }
    }

    else if (this.miSeleccion == 12)
    {
      this.detalle.inicia = !this.detalle.inicia ? this.servicio.fecha(1, "", "HH") + ":00:00" : this.detalle.inicia;
      this.detalle.planta = !this.detalle.planta ? 0 : this.detalle.planta;
      this.detalle.departamento = !this.detalle.departamento ? 0 : this.detalle.departamento;
      this.detalle.compania = !this.detalle.compania ? 0 : this.detalle.compania;
      this.detalle.politica  = !this.detalle.politica ? 0 : this.detalle.politica;
      this.detalle.turno  = !this.detalle.turno ? 0 : this.detalle.turno;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_usuarios (nombre, referencia, notas, rol, politica, linea, maquina, area, operacion, imagen, planta, departamento, compania, turno, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.referencia + "', '" + this.detalle.notas + "', '" + this.detalle.rol + "', " + this.detalle.politica + ", '" + this.detalle.linea + "', '" + this.detalle.maquina + "', '" + this.detalle.area + "', '" + this.detalle.operacion + "', '" + this.detalle.imagen + "', " + this.detalle.planta + ", " + this.detalle.departamento + ", " + this.detalle.compania + ", " + this.detalle.turno + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET nombre = '" + this.detalle.nombre + "', referencia = '" + this.detalle.referencia + "', notas = '" + this.detalle.notas + "', rol = '" + this.detalle.rol + "', politica = " + this.detalle.politica + ", linea = '" + this.detalle.linea + "', maquina = '" + this.detalle.maquina + "', area = '" + this.detalle.area + "', operacion = '" + this.detalle.operacion + "', imagen = '" + this.detalle.imagen + "', planta = " + this.detalle.planta + ", departamento = " + this.detalle.departamento + ", compania = " + this.detalle.compania + ", turno = " + this.detalle.turno + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
      }
    }
    
    else if (this.miSeleccion == 14)
    {
      this.detalle.diasvencimiento = !this.detalle.diasvencimiento ? 0 : this.detalle.diasvencimiento;
      this.detalle.aviso = !this.detalle.aviso ? 0 : this.detalle.aviso;
      this.detalle.largo = !this.detalle.largo ? 0 : this.detalle.largo;

      this.detalle.largo = this.detalle.largo < 0 ? 0 : this.detalle.largo > 50 ? 50 : this.detalle.largo;
      this.detalle.diasvencimiento = this.detalle.diasvencimiento < 0 ? 0 : this.detalle.diasvencimiento > 365 ? 365 : this.detalle.diasvencimiento;
      this.detalle.aviso = this.detalle.aviso < 0 ? 0 : this.detalle.aviso > 30 ? 30 : this.detalle.aviso;
      
      this.detalle.especial = "N";
      this.detalle.numeros = "N";
      this.detalle.mayusculas = "N";
      for (var i = 0; i < this.listaComplejidad.selectedOptions.selected.length; i++) 
      {
        if (this.listaComplejidad.selectedOptions.selected[i].value==0)
        {
          this.detalle.especial = "S";
        }
        else if (this.listaComplejidad.selectedOptions.selected[i].value==1)
        {
          this.detalle.numeros = "S";
        }
        else if (this.listaComplejidad.selectedOptions.selected[i].value==2)
        {
          this.detalle.mayusculas = "S";
        }
      }
      this.detalle.complejidad = this.detalle.largo + ";" + this.detalle.especial + ";" + this.detalle.numeros + ";" + this.detalle.mayusculas
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".politicas (nombre, deunsolouso, obligatoria, vence, diasvencimiento, aviso, complejidad, usadas, creado, modificado, creacion, modificacion) VALUES ('" + this.detalle.nombre + "', '" + this.detalle.deunsolouso + "', '" + this.detalle.obligatoria + "', '" + this.detalle.vence + "', " + this.detalle.diasvencimiento + ", " + this.detalle.aviso + ", '" + this.detalle.complejidad + "', " + this.detalle.usadas + ", " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", NOW(), NOW());UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();"
      if (this.detalle.id > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".politicas SET nombre = '" + this.detalle.nombre + "', deunsolouso = '" + this.detalle.deunsolouso + "', obligatoria = '" + this.detalle.obligatoria + "', vence = '" + this.detalle.vence + "', diasvencimiento = " + this.detalle.diasvencimiento + ", aviso = " + this.detalle.aviso + ", complejidad = '" + this.detalle.complejidad + "', usadas = " + this.detalle.usadas + ", estatus = '" + this.detalle.estatus + "', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();";
      }
    }
    else if (this.miSeleccion == 32)
    {
      if (this.procesoGuardar == 0)
      {
        this.actualizarChofer()
        return;
      }
      else if (this.procesoGuardar == 1)
      {
        this.actualizarTransporte()
        return;
      }
      else if (this.procesoGuardar == 2)
      {
        this.actualizarVehiculo()
        return;
      }
      else if (this.procesoGuardar == 3 && this.pagerActual==0)
      {
        this.validarPager()
        return;
      }
      
      
      let asignado = "N"
      if (this.configuracion.asignar_caseta == "S" && (this.detalle.origen!=0 && this.detalle.destino!=0))
      {
        asignado = "S"
      }

      this.procesoGuardar = 0;
      this.cadPlaca = 0;
      this.cadChofer = 0;
      this.cadTransporte = 0;
      
      this.cadReferencia = 0;
      let cadAdic = "";
      this.detalle.pager_act = !this.detalle.pager_act ? 0 : this.detalle.pager_act;
      this.detalle.carga = !this.detalle.carga ? "" : this.detalle.carga;
      this.detalle.linea = !this.detalle.linea ? "0" : this.detalle.linea;
      this.detalle.tipo = !this.detalle.linea ? "0" : this.detalle.tipo;
      this.detalle.agrupador_1 = !this.detalle.agrupador_1 ? "0" : this.detalle.agrupador_1;
      this.detalle.agrupador_2 = !this.detalle.agrupador_2 ? "0" : this.detalle.agrupador_2;
      if (!this.detalle.chofer)
      {
        this.detalle.nchofer = 0;
      }
      else if (this.detalle.chofer == "")
      {
        this.detalle.nchofer = 0
      }
      if (!this.detalle.placa)
      {
        this.detalle.vehiculo = 0;
      }
      else if (this.detalle.placa == "")
      {
        this.detalle.vehiculo = 0
      }

      if (!this.detalle.nlinea)
      {
        this.detalle.linea = 0;
      }
      else if (this.detalle.nlinea == "")
      {
        this.detalle.linea = 0
      }

      let preAsignacion = "";
      if (this.configuracion.asignar_caseta == "S")
      {
        preAsignacion = ", origen = " + this.detalle.origen + ", destino = " + this.detalle.destino + ", des_estimado = " + +this.tiempoDescargaSeg + ", des_monitorear = '" + this.des_monitorear + "', estimado = " + +this.tiempoRutaSeg + ", monitorear = '" + this.monitorear + "', fecha_asignacion = NOW() "
      }
      sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET carga = " + this.detalle.carga + ", usuario_asigna = " + this.servicio.rUsuario().id + ", chofer = " + this.detalle.nchofer + ", vehiculo = " + this.detalle.vehiculo + ", transporte = " + this.detalle.linea + ", estado = 10, desde = NOW(), movil = '" + this.detalle.referencia + "', preasignado = '" + asignado + "'" + preAsignacion + " WHERE id = " + this.reqActual + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW()" + cadAdic;
    }
    else if (this.miSeleccion == 34)
    {
      if (this.asignando)
      {
        if (this.procesoGuardar == 0)
        {
          this.actualizarChofer()
          return;
        }
        if (this.procesoGuardar == 1)
        {
          this.actualizarTransporte()
          return;
        }
        else if (this.procesoGuardar == 2)
        {
          this.actualizarVehiculo()
          return;
        }
        
        this.cadPlaca = 0;
        this.cadChofer = 0;
        this.cadTransporte = 0;
        
        this.cadReferencia = 0;
        this.detalle.carga = !this.detalle.carga ? "" : this.detalle.carga;
        this.detalle.linea = !this.detalle.linea ? "0" : this.detalle.linea;
        this.detalle.tipo = !this.detalle.linea ? "0" : this.detalle.tipo;
        this.detalle.agrupador_1 = !this.detalle.agrupador_1 ? "0" : this.detalle.agrupador_1;
        this.detalle.agrupador_2 = !this.detalle.agrupador_2 ? "0" : this.detalle.agrupador_2;
        if (!this.detalle.chofer)
        {
          this.detalle.nchofer = 0;
        }
        else if (this.detalle.chofer == "")
        {
          this.detalle.nchofer = 0
        }
        
        if (!this.detalle.placa)
        {
          this.detalle.vehiculo = 0;
        }
        else if (this.detalle.placa == "")
        {
          this.detalle.vehiculo = 0
        }

        if (!this.detalle.nlinea)
        {
          this.detalle.linea = 0;
        }
        else if (this.detalle.nlinea == "")
        {
          this.detalle.linea = 0
        }
      }
      if (this.configuracion.mensaje_mmcall || this.configuracion.mensaje)
      {
        this.detalle.mensaje_mmcall = this.configuracion.mensaje_mmcall;
        this.detalle.mensaje = this.configuracion.mensaje;
        if (!this.detalle.placa || this.detalle.placa=="")
        {
          this.detalle.placa = "NO ESPECIFICADA";
        }
        if (!this.detalle.chofer || this.detalle.chofer=="")
        {
          this.detalle.chofer = "NO ESPECIFICADO";
        }
        
        if (this.detalle.linea > 0)
        {
          this.detalle.transporte_id = this.detalle.linea;
          this.detalle.transporte_nombre = this.detalle.nlinea;
          if (!this.detalle.transporte_nombre || this.detalle.transporte_nombre=="")
          {
            this.detalle.transporte_nombre = "NO ESPECIFICADO"
          }
        }
        if (this.detalle.destino > 0)
        {
          this.detalle.destino_id = 0;
          for (var i = 0; i < this.lotes.length; i ++)
          {
            if (this.lotes[i].id == this.detalle.destino)
            {
              this.detalle.destino_nombre = this.lotes[i].nombre;
              break
            }
          }
          if (!this.detalle.destino_nombre || this.detalle.destino_nombre=="")
          {
            this.detalle.destino_nombre = "AREA NO ESPECIFICADA" ;
          } 
        
          if (this.detalle.mensaje_mmcall)
          {
            this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall.replace(/[1]/gi, this.detalle.chofer);
            this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall.replace(/[2]/gi, this.detalle.transporte_nombre);;  
            this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall.replace(/[3]/gi, this.detalle.placa);  
            this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall.replace(/[4]/gi, this.detalle.destino_nombre);  
            this.detalle.mensaje_mmcall = this.detalle.mensaje_mmcall.replace(/\[/g, '').replace(/]/g, '');;  
          
          }
          if (this.detalle.mensaje)
          {
            this.detalle.mensaje = this.detalle.mensaje.replace(/[1]/gi, this.detalle.chofer);  
            this.detalle.mensaje = this.detalle.mensaje.replace(/[2]/gi, this.detalle.transporte_nombre);;  
            this.detalle.mensaje = this.detalle.mensaje.replace(/[3]/gi, this.detalle.placa);;  
            this.detalle.mensaje = this.detalle.mensaje.replace(/[4]/gi, this.detalle.destino_nombre);  
            this.detalle.mensaje = this.detalle.mensaje.replace(/\[/g, '').replace(/]/g, '');;  
          }
        }
      }
      //AQUI
      this.detalle.destino = !this.detalle.destino ? "0" : this.detalle.destino;
      this.detalle.origen = !this.detalle.origen ? "0" : this.detalle.origen;
      this.procesoGuardar = 0;
      this.configuracion.andon_repeticiones = !this.configuracion.andon_repeticiones ? 1 : this.configuracion.andon_repeticiones;
      let cadAdic = "";
      this.detalle.pager_act = !this.detalle.pager_act ? 0 : this.detalle.pager_act;
      sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET espera_temporal = TIME_TO_SEC(TIMEDIFF(NOW(), desde)), usuario_asigna = " + +this.detalle.usuario_asigna + ", movil = '" + this.detalle.referencia + "', mensaje = '" + (this.detalle.mensaje ? this.detalle.mensaje : "") + "', mensaje_mmcall = '" + (this.detalle.mensaje_mmcall ? this.detalle.mensaje_mmcall : "") + "', repeticiones = " + (+this.configuracion.andon_repeticiones + 1) + ", repeticiones_audio = " + (+this.configuracion.andon_repeticiones + 1) + ", carga = " + this.detalle.carga + ", chofer = " + this.detalle.nchofer + ", vehiculo = " + this.detalle.vehiculo + ", transporte = " + this.detalle.linea + ", destino = " + this.detalle.destino + ", origen = " + this.detalle.origen + ", estado = 20, orden = 0, estimado = " + +this.tiempoRutaSeg + ", monitorear = '" + this.monitorear + "', des_estimado = " + +this.tiempoDescargaSeg + ", des_monitorear = '" + this.des_monitorear + "', alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, fecha_asignacion = NULL, espera_temporal = 0, desde = NOW(), hasta = NULL, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE pager = " + this.pagerActual + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW()" + cadAdic;
    }
    else if (this.miSeleccion >= 30 && this.miSeleccion < 35)
    {
      let estatus = 0;
      let cadAdic = "";
      let cadAdic2 = "";
      let cadAdic3 = "";
      this.detalle.nombre = !this.detalle.nombre ? "" : this.detalle.nombre;
      this.detalle.mensaje = !this.detalle.mensaje ? "" : this.detalle.mensaje;
      this.detalle.mensaje_mmcall = !this.detalle.mensaje_mmcall ? "" : this.detalle.mensaje_mmcall;
      this.detalle.pager_act = !this.detalle.pager_act ? 0 : this.detalle.pager_act;
      this.detalle.carga = !this.detalle.carga ? "" : this.detalle.carga;
      this.detalle.destino = !this.detalle.destino ? "0" : this.detalle.destino;
      this.detalle.origen = !this.detalle.origen ? "0" : this.detalle.origen;
      this.detalle.linea = !this.detalle.linea ? "0" : this.detalle.linea;
      this.detalle.tipo = !this.detalle.tipo ? "0" : this.detalle.tipo;
      this.detalle.agrupador_1 = !this.detalle.agrupador_1 ? "0" : this.detalle.agrupador_1;
      this.detalle.agrupador_2 = !this.detalle.agrupador_2 ? "0" : this.detalle.agrupador_2;
      if (!this.detalle.chofer)
      {
        this.detalle.nchofer = 0;
      }
      else if (this.detalle.chofer == "")
      {
        this.detalle.nchofer = 0
      }
      if (!this.detalle.placa)
      {
        this.detalle.vehiculo = 0;
      }
      else if (this.detalle.placa == "")
      {
        this.detalle.vehiculo = 0
      }
      this.detalle.area = !this.detalle.area ? "0" : this.detalle.area;
      let iColor = this.detalle.color ? this.detalle.color.substr(1) : "";
      
      if (this.detalle.destino > 0)
      {
        //No asignado
        estatus = 2;
        cadAdic = ", estado = 20, desde = NOW(), alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, "
        cadAdic2 = ", desde, estado"
        cadAdic3 = ", NOW(), 20"
      }
      else if (this.detalle.nchofer > 0)
      {
        //No asignado
        estatus = 1;
        cadAdic = ", estado = 10, desde = NOW(), alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, "
        cadAdic2 = ", desde, estado"
        cadAdic3 = ", NOW(), 10"
      }
      else
      {
        cadAdic = ", estado = 0, desde = NULL"
      }
      sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET nombre = '" + this.detalle.nombre.toUpperCase() + "', carga = " + this.detalle.carga + ", area = " + this.detalle.area + ", chofer = " + this.detalle.nchofer + ", vehiculo = " + this.detalle.vehiculo + ", transporte = " + this.detalle.transporte + ", color = '" + iColor + "', origen = " + this.detalle.origen + ", destino = " + this.detalle.destino + ", mensaje = '" + this.detalle.mensaje + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', estatus = " + estatus + cadAdic + " WHERE pager = " + this.pagerActual + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
    }
    else if (this.miSeleccion == 35)
    {
      this.detalle.nombre = !this.detalle.nombre ? "" : this.detalle.nombre;
      this.detalle.pager_act = !this.detalle.pager_act ? 0 : this.detalle.pager_act;
      this.detalle.area = !this.detalle.area ? "0" : this.detalle.area;
      let iColor = this.detalle.color ? this.detalle.color.substr(1) : "";

      sentencia = "INSERT INTO " + this.servicio.rBD() + ".requesters (pager, nombre, area, color) VALUES (" + this.pagerActual + ", '" + this.detalle.nombre.toUpperCase() + "', " + this.detalle.area + ", '" + iColor + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();"
      if (this.detalle.pager_req > 0)
      {
        sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET nombre = '" + this.detalle.nombre.toUpperCase() + "', area = " + this.detalle.area + ", color = '" + iColor + "' WHERE pager = " + this.pagerActual + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
      }
    }
    let campos = {accion: 200, sentencia: sentencia}  
      this.servicio.consultasBD(campos).subscribe( resp =>
    {

      if (this.miSeleccion == 35)
      {
        this.volver();
      }
      if (this.miSeleccion == 32)
      {
        //Y asignado
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "El dispositivo " + this.nombreBeeper + " se mueve al estatus EN ESPERA";
        mensajeCompleto.tiempo = 4000;
        this.servicio.mensajeToast.emit(mensajeCompleto);        
        this.volver();
      }
      else if (this.detalle.destino > 0 && this.miSeleccion == 34)
      {
        //Y asignado
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "Esta ruta tiene una duración estimada de " + this.tiempoRuta + " Se ha enviado un mensaje al dispositivo ";
        mensajeCompleto.tiempo = 4000;
        this.servicio.mensajeToast.emit(mensajeCompleto);        
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "El registro se ha guardado satisfactoriamente";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
      if (this.detalle.id == 0)
      {
        sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_transportes;";
        if (this.miSeleccion == 2)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_vehiculos;";
        }
        else if (this.miSeleccion == 3)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_choferes;";
        }
        else if (this.miSeleccion == 5)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_generales;";
        }
        else if (this.miSeleccion == 6)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_distribucion;";
        }
        else if (this.miSeleccion == 7)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_correos;";
        }
        else if (this.miSeleccion == 8)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_alertas;";
        }
        else if (this.miSeleccion == 9)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_turnos;";
        }
        else if (this.miSeleccion == 10)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".traduccion;";
        }
        else if (this.miSeleccion == 12)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".cat_usuarios;";
        }
        else if (this.miSeleccion == 14)
        {
          sentencia = "SELECT MAX(id) AS nuevoid FROM " + this.servicio.rBD() + ".politicas;";
        }
        
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          this.detalle.id = resp[0].nuevoid
          this.detalle.creacion = new Date();
          this.detalle.creado = this.servicio.rUsuario().nombre;
          this.guardar_2();
        })
      }
      else
      {
        this.guardar_2();
      }
      this.detalle.modificado = this.servicio.rUsuario().nombre;
      this.detalle.modificacion = new Date();
      this.bot3 = false;
      this.bot4 = false;
      this.bot5 = true;
      this.bot6 = this.detalle.estatus == "A";
      this.bot7 = true;

      this.iniBot()
      

      
      
      setTimeout(() => {
        this.txtNombre.nativeElement.focus();
      }, 400);
      
    })
  
  }

  guardar_2()
  {
    let seleccionados
    let seleccionados1
    let seleccionados2
    let seleccionados3
    let seleccionados4
    let seleccionados5
    if (this.miSeleccion == 7)
    {
      seleccionados = this.listaListad.selectedOptions.selected;
    }
    else if (this.miSeleccion == 12)
    {
      //seleccionados1 = this.lista1.selectedOptions.selected;
      //seleccionados2 = this.lista2.selectedOptions.selected;
      //seleccionados3 = this.lista3.selectedOptions.selected;
      seleccionados4 = this.lista4.selectedOptions.selected;
      //seleccionados5 = this.lista5.selectedOptions.selected;
    }
    else if (this.miSeleccion == 8 && this.lista1)
    {
      seleccionados1 = this.lista1.selectedOptions.selected;
    }
    if (this.miSeleccion==7)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".det_correo WHERE correo = " + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".det_correo (correo, reporte) VALUES";
        for (var i = 0; i < seleccionados.length; i++) 
        {
          cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados[i].value + "),";
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion==8 && seleccionados1)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relaciones WHERE operacion = 1 AND indice = " + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".relaciones (operacion, indice, detalle) VALUES";
        for (var i = 0; i < seleccionados1.length; i++) 
        {
          cadTablas = cadTablas +  "(1, " + this.detalle.id + ", " + seleccionados1[i].value + "),";
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });
      }
      else if (this.miSeleccion==12)
      {
        let cadTablas = "DELETE FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".relacion_usuarios_opciones (usuario, opcion) VALUES";
        for (var i = 0; i < seleccionados4.length; i++) 
        {
          cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados4[i].value + "),";
        }
        cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        //if (seleccionados1.length > 0 || seleccionados2.length || seleccionados3.length)
        //{
        //  cadTablas = cadTablas + ";DELETE FROM " + this.servicio.rBD() + ".relacion_usuarios_operaciones WHERE usuario = " + +this.detalle.id + ";INSERT INTO " + this.servicio.rBD() + ".relacion_usuarios_operaciones (usuario, proceso, tipo) VALUES";
          //if (this.detalle.linea!="S")
          
          //for (var i = 0; i < seleccionados1.length; i++) 
          //{
          //  cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados1[i].value + ", 1),";
          //}
          //for (var i = 0; i < seleccionados2.length; i++) 
          //{
          //  cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados2[i].value + ", 2),";
          //}
          //for (var i = 0; i < seleccionados3.length; i++) 
          //{
          //  cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados3[i].value + ", 3),";
          //}
          //for (var i = 0; i < seleccionados5.length; i++) 
          //{
          //  cadTablas = cadTablas +  "(" + this.detalle.id + ", " + seleccionados5[i].value + ", 0),";
          //}
          ////cadTablas = cadTablas.substr(0, cadTablas.length - 1);
        //}
        let campos = {accion: 200, sentencia: cadTablas};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
        });

      }
      if (this.miSeleccion == 34)
      {
        this.detalle.usuario_asigna = !this.detalle.usuario_asigna ? 0 : this.detalle.usuario_asigna;
        //Se calcula el tiempo de espera
        let sentencia = "INSERT INTO " + this.servicio.rBD() + ".movimientos_det (requester, origen, destino, inicio, estimado, des_estimado, transporte, vehiculo, area, carga, chofer, espera, usuario_asigna, usuario_envia_transito) VALUES(" + this.detalle.id + ", " + this.detalle.origen + ", " + this.detalle.destino + ", NOW(), " + +this.tiempoRutaSeg + ", " + +this.tiempoDescargaSeg + ", " + +this.detalle.transporte + ", " + +this.detalle.vehiculo +  ", " + +this.detalle.area + ", " + +this.detalle.carga + ", " + this.detalle.nchofer + ", (SELECT espera_temporal FROM " + this.servicio.rBD() + ".requesters WHERE id = "  + this.detalle.id + "), " + +this.detalle.usuario_asigna + ", " + this.servicio.rUsuario().id + ") ";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          sentencia = "SELECT MAX(ID) AS id, COUNT(*) AS viajes FROM " + this.servicio.rBD() + ".movimientos_det WHERE requester = " + this.detalle.id + " AND estado = 0;";
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              let cadTablas = "UPDATE " + this.servicio.rBD() + ".movimientos_det SET viaje = " + +resp[0].viajes + " WHERE id = " + resp[0].id;
              let campos = {accion: 200, sentencia: cadTablas};  
              this.servicio.consultasBD(campos).subscribe( resp =>
              {
                this.volver();
              })
            }
            
          })
        });
        
      }
    }

  actualizarRate(parte: number, ultimo: boolean, accion: number)
  {
    let sentencia = "";
    if (accion == 1)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE equipo = " + this.detalle.equipo + " AND parte = " + parte + ";";
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.actualizarRate(parte, ultimo, resp.length == 0 ? 2 : 3);
      })
    }
    else
    {
      if (accion == 2)
      {
        this.sentenciaRate = this.sentenciaRate + "INSERT INTO " + this.servicio.rBD() + ".relacion_partes_equipos (parte, equipo, piezas, unidad, tiempo, bajo, alto) VALUES (" + parte + ", " + this.detalle.equipo + ", " + this.detalle.piezas + ", '" + this.detalle.unidad + "', " + this.detalle.tiempo + ", " + this.detalle.bajo + ", " + this.detalle.alto + ");"
      }
      else
      {
        this.sentenciaRate = this.sentenciaRate + "UPDATE " + this.servicio.rBD() + ".relacion_partes_equipos SET sesion = 'N', equipo = " + this.detalle.equipo + ", piezas = " + this.detalle.piezas + ", unidad = '" + this.detalle.unidad + "', tiempo = " + this.detalle.tiempo + ", bajo = " + this.detalle.bajo + ", alto = " + this.detalle.alto + " WHERE parte = " + parte + " AND equipo = " + this.equipoAntes + ";";
      }
      if (ultimo)
      {
        this.sentenciaRate = this.sentenciaRate + "UPDATE " + this.servicio.rBD() + ".actualizaciones SET rates = NOW();DELETE FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE sesion = 'S' AND piezas = " + this.piezasAntes +  " AND equipo = " + this.equipoAntes + ";";
        let campos = {accion: 200, sentencia: this.sentenciaRate};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          
        })
      }
    }
  }

  validarSiExiste(tabla: number)
  {
    this.yaValidado = 0;
    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".relacion_partes_equipos WHERE parte = " + this.detalle.parte + " AND equipo = " + this.detalle.equipo;
    if (tabla == 2)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".equipos_objetivo WHERE parte = " + this.detalle.parte + " AND lote = " + this.detalle.lote + " AND turno = " + this.detalle.turno + " AND equipo = " + this.detalle.equipo;
      if (this.detalle.fijo == 'S')
      {
        sentencia = sentencia + " AND fijo = 'S'"
      }
      else
      {
        sentencia = sentencia + " AND fijo = 'N' AND desde = '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "' AND hasta = " + this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "'";
      }
    }
    else if (tabla == 3)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".estimados WHERE linea = " + this.detalle.linea + " AND equipo = " + this.detalle.equipo;
      if (this.detalle.fijo == 'S')
      {
        sentencia = sentencia + " AND fijo = 'S'"
      }
      else
      {
        sentencia = sentencia + " AND fijo = 'N' AND desde = '" + this.servicio.fecha(2, this.detalle.desde, "yyyy/MM/dd") + "' AND hasta = " + this.servicio.fecha(2, this.detalle.hasta, "yyyy/MM/dd") + "'";
      }
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.yaValidado = resp[0].id;
      }
      this.guardar();
    })

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

  regresar()
  {
    if (this.editando && !this.cancelarEdicion)
    {
      this.deshacerEdicion(0, 99)
      return;
    }
    this.volver()
  }

  volver()
  {
    this.iniBot()
    this.botonera1 = 1;
    this.noLeer = false,
    this.detalle.nchofer = 0;
    this.detalle.chofer = "";
    this.detalle.carga = "";
    this.detalle.linea = "0";
    this.detalle.agrupador_1 = "0";
    this.detalle.tipo = 0;
    this.detalle.agrupador_2 = "0";
    this.detalle.placa = "";
    this.detalle.vehiculo = 0;
    this.placasFiltradas = [];
    this.choferesFiltradas = [];
    this.referenciasFiltradas = [];
    this.transportesFiltradas = [];
    this.cadReferencia=0
    this.cadPlaca=0
    this.cadChofer=0
    this.cadTransporte=0
    this.rRegistros(this.miSeleccion);
    this.cambiarVista(0);
    this.contarRegs();
  }

  imagenErrorRegistro()
  {
    //if (this.accion == "in")
    {
      this.mostrarImagenRegistro = "N";
      if (this.detalle.imagen)
      {
        this.mensajeImagen = "Imagen no encontrada...";
      }
      else
      {
        this.mensajeImagen = "Campo opcional";
      }
      
    }
  }

  onFileSelected(event)
  {
    this.bot3 = true;
    this.bot4 = true;
    this.bot5 = false;
    this.bot6 = false;
    this.bot7 = false;
    const fd = new FormData();
    fd.append('imagen', event.target.files[0], event.target.files[0].name);
    this.editando = true;
    this.faltaMensaje = "No se han guardado los cambios..."
    this.detalle.modificacion = null;
    this.detalle.modificado = "";
    this.cancelarEdicion = false;
    this.mensajeImagen = "Campo opcional"
    this.detalle.imagen = this.URL_IMAGENES + event.target.files[0].name;
    this.editando = true;
    
    /** In Angular 5, including the header Content-Type can invalidate your request */
    this.http.post<any>(this.URL_BASE, fd)
    .subscribe((res) => {
        this.editando = true;
        this.faltaMensaje = "No se han guardado los cambios..."
        this.detalle.modificacion = null;
        this.detalle.modificado = "";
        this.cancelarEdicion = false;
        this.mostrarImagenRegistro = "S";
        this.mensajeImagen = "Campo opcional"
        this.detalle.imagen = this.URL_IMAGENES + event.target.files[0].name;

        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "La imagen fue guardada satisfactoriamente en su servidor";
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      });
  }

cambiando(evento: any)
  {
    this.faltaMensaje = "";
    if (this.miSeleccion>=30)
    {
      this.bot3 = true;
      this.bot4 = true;
      this.editando = true;
      this.faltaMensaje = "No se han guardado los cambios..."
    }
    if (!this.editando)
    {
      this.bot3 = true;
      this.bot4 = true;
      this.bot5 = false;
      this.bot6 = false;
      this.bot7 = false;
      this.editando = true;
      this.faltaMensaje = "No se han guardado los cambios..."
      this.detalle.modificacion = null;
      this.detalle.modificado = "";
      this.cancelarEdicion = false;
      this.validarUSER = false;
      this.validarRuta = false;
      this.validarTiempoRuta = true;
      
    }
    if (evento.target)
    {
      if (evento.target.name)
      {
        if (evento.target.name == "imagen")
        {
          this.mostrarImagenRegistro = "S";
          this.mensajeImagen = "Campo opcional"
        }
      }
    }
  }

  buscarMarca(id: number)
  {
    this.servicio.activarSpinnerSmall.emit(true);
    this.agrupadores2 = [];    
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".cat_generales WHERE id_relacionado = " + id + " AND tabla = 25 ORDER BY nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);  
      }, 200);
      
      resp.splice(0, 0, {id: "0", nombre: "(NO ASOCIADA)"});  
      this.agrupadores2 = resp;
      
    })
  }
  
  nuevo(modo: number)
  {
    if (this.miSeleccion >= 30)
    {
      this.asignando = true; 
      this.liberando = false; 
      this.editandoD = false; 
      this.transfiriendo = false;
      this.pagerActual = 0;
      this.trabajarRadio(0);
      return;
    }
    if (modo == 1)
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(0, 2)
        return;
      } 
      if (this.asignando && this.miSeleccion>=30)
      {
        this.deshacerEdicion(0, 99)
        return;
      }
    } 
    else
    {
      this.modelo = 14;
    }
    this.nuevo_siguiente()
  }
  
  calcularHR(segundos: number)
  {
    let cadHora = "";
    if (!segundos)
    {
      cadHora = "";
    }
    else if (segundos == 0)
    {
      cadHora = "0min";
    }
    else if (segundos > 0 && segundos <= 60)
    {
      cadHora = "1min";
    }
    else if ((segundos / 3600) < 1)
    {
      cadHora = (segundos / 60).toFixed(1) + "min" 
    }
    else
    {
      cadHora = (segundos / 3600).toFixed(2) + "hr" 
    }
    return cadHora
  }
  
  nuevo_siguiente()
  {
      this.copiandoDesde = 0;
      this.yaValidado = -1;
      this.error01 = false;
      this.error02 = false;
      this.error03 = false;
      this.error04 = false;
      this.error05 = false;
      this.error06 = false;
      this.error07 = false;
      this.error08 = false;
      this.error09 = false;
      this.error10 = false;
      this.error20 = false;
      this.error21 = false;
      this.error22 = false;
      this.error23 = false;
      this.error24 = false;
      this.error25 = false;
      this.error30 = false;
      this.error31 = false;
      this.error32 = false;
      this.error33 = false;
      this.error34 = false;
      this.error35 = false;
      this.despuesBusqueda = 0;
      this.error01 = false;
      this.error02 = false;
      //this.verTabla = false;
      this.verTabla = this.movil;
      this.nExtraccion = "0";
      this.adecuar();
      this.botonera1 = 2;
      this.detalle.referencia = "";
      this.detalle.notas = "";
      this.detalle.literal = "";
      this.detalle.traduccion = "";
      this.detalle.imagen = "";
      this.detalle.nombre = "";
      this.detalle.inicia = this.servicio.fecha(1, "", "HH") + ":00:00";
      this.detalle.termina = this.servicio.fecha(1, "", "HH") + ":59:00";
      this.detalle.hora_desde = "00:00:00";
      this.detalle.hora_hasta = "23:59:00";
      this.detalle.cambiodia = "N";
      this.detalle.especial = "N";
      this.detalle.tipo = "0";
      this.detalle.mover = "0";
      //
      
      this.detalle.telefonos = "";
      this.detalle.mmcall = "";
      this.detalle.correos = "";
      //
      this.detalle.agrupador_1 = "0";
      this.detalle.oee = "N";
      this.detalle.agrupador_2 = "0";
      this.detalle.tipo = "0";
      this.mostrarImagenRegistro = "S";
      this.mensajeImagen = "Campo opcional"
      this.detalle.imagen = "";
      this.detalle.url_mmcall = "0";
      this.detalle.estatus = "A";
      this.detalle.id = 0;
      this.detalle.creado = "";
      this.detalle.modificado = "";
      this.detalle.modificacion = null;
      this.detalle.creacion = null;

      ///
      this.seleccionMensaje = ["M", "C"];
      this.seleccionescalar1 = ["C"];
      this.seleccionescalar2 = ["C"];
      this.seleccionescalar3 = ["C"];
      this.seleccionescalar4 = ["C"];
      this.seleccionescalar5 = ["C"];
      this.detalle.evento = "1";
      this.detalle.tiempo = 0;
      this.detalle.solapar = "S";
      this.detalle.tipo = "1";
      this.detalle.falla = "0";
      this.detalle.acumular = "N";
      this.detalle.repetir_veces = 0;
      this.detalle.repetir_tiempo = 0;
      this.detalle.transcurrido = 0;
      this.detalle.repetir = "N";
      this.detalle.escalar1 = "N";
      this.detalle.escalar2 = "N";
      this.detalle.escalar3 = "N";
      this.detalle.escalar4 = "N";
      this.detalle.escalar5 = "N";
      this.detalle.lista = "0";
      this.detalle.lista1 = "0";
      this.detalle.lista2 = "0";
      this.detalle.lista3 = "0";
      this.detalle.lista4 = "0";
      this.detalle.lista5 = "0";
      this.detalle.mensaje = "";
      this.detalle.mensaje_mmcall = "";
      this.detalle.acumular_veces = 0;
      this.detalle.titulo = "";
      this.detalle.tiempo1 = 0;
      this.detalle.repetir1 = "N";
      this.detalle.veces1 = 0;
      this.detalle.veces2 = 0;
      this.detalle.tiempo2 = 0;
      this.detalle.repetir2 = "N";
      this.detalle.veces3 = 0;
      this.detalle.tiempo3 = 0;
      this.detalle.repetir3 = "N";
      this.detalle.veces4 = 0;
      this.detalle.tiempo4 = 0;
      this.detalle.repetir4 = "N";
      this.detalle.veces5 = 0;
      this.detalle.tiempo5 = 0;
      this.detalle.repetir5 = "N";
      this.detalle.informar_resolucion = "N";
      this.detalle.resolucion_mensaje = "";
      this.detalle.cancelacion_mensaje = "";
      this.detalle.acumular_inicializar = "N";
      this.selListadoT = "S";
      this.detalle.titulo = "";
      this.detalle.cuerpo = "";
      this.detalle.para = "";
      this.detalle.copia = "";
      this.detalle.oculta = "";
      this.nFrecuencia = "T";
      this.nLapso = "0";
      this.nExtraccion = "0";
      this.nHorario = "T";
      this.opciones = "S";
      ///
      this.listarListados(0);
      this.llenarListas(1, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + this.miSeleccion * 10);
      if (this.miSeleccion != 2)
      {
        this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = " + (this.miSeleccion * 10 + 5));
      }
      
      ///
      if (this.miSeleccion == 4) 
      {
        this.llenarListas(2, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 30 ");
        this.detalle.inicial = "N";
        this.detalle.final = "N";
        this.detalle.patio_espera = "N";
      }
      
      if (this.miSeleccion == 1 || this.miSeleccion == 4) 
      {
        this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", ""); 
        
        if (this.miSeleccion == 4)
        {
          this.detalle.audios_activar = "N";
          this.detalle.audios_prefijo = "";
          this.detalle.audios_ruta = "";
          this.detalle.audios_general = "N";
        }
      }
      else if (this.miSeleccion == 2) 
      {
        this.llenarListas(3, this.servicio.rBD() + ".cat_transportes", "");
        this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
      }
      else if (this.miSeleccion == 5) 
      {
        this.llenarListas(101, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 20 ");
        this.llenarListas(7, this.servicio.rBD() + ".tablas", "");
        this.detalle.id_relacionado = 0;

      }
      else if (this.miSeleccion == 8) 
      {
        this.detalle.linea = "S";
        this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", "");
        this.llenarListas(31, this.servicio.rBD() + ".int_eventos", " WHERE estatus = 'A'");
        this.asociarOperaciones(1, 0);
      }
      else if (this.miSeleccion == 12) 
      {
        this.detalle.admin = 'N';
        this.detalle.rol = "O";
        this.colocarOpciones()
        this.llenarListas(10, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 70 " );
        this.llenarListas(11, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 80 " );
        this.llenarListas(12, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 90 " );
        this.llenarListas(14, this.servicio.rBD() + ".cat_turnos", "");
        this.llenarListas(13, this.servicio.rBD() + ".politicas", "" );
        this.detalle.linea = "S";
        this.detalle.maquina = "S";
        this.detalle.operacion = "S";
        this.detalle.area = "S";     
        this.detalle.compania = "0";     
        this.detalle.planta = "0";
        this.detalle.politica = "0";     
        this.detalle.departamento = "0";     
        this.detalle.turno = "0";     
        this.detalle.inicializada=='S';   
        this.asociarTablas(0);
      
      }
      else if (this.miSeleccion==14)
      {
        this.detalle.deunsolouso = "N";
        this.detalle.obligatoria = "S";
        this.detalle.vence = "S";     
        this.detalle.diasvencimiento = 365;   
        this.detalle.aviso = 7;   
        this.detalle.largo = 10;
        this.detalle.especial = "S";
        this.detalle.numeros = "S";
        this.detalle.mayusculas = "S";
        this.detalle.usadas = "5";
      }
      else if (this.miSeleccion == 11)
      {
        this.detalle.monitorear = "S";
        this.detalle.carga = "0";
        this.detalle.transporte = "0";
        this.detalle.origen = "0";
        this.detalle.destino = "0";
        this.detalle.tipo = "0";
        this.detalle.tiempo = "0";
        
        this.llenarListas(117, this.servicio.rBD() + ".cat_destinos", "");
        this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
        this.llenarListas(90, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 65 ");
        this.llenarListas(103, this.servicio.rBD() + ".cat_transportes", "");
      }
      else if (this.miSeleccion == 17)
      {
        this.detalle.monitorear = "S";
        this.detalle.carga = "0";
        this.detalle.transporte = "0";
        this.detalle.destino = "0";
        this.detalle.tiempo = "0";
        
        this.llenarListas(117, this.servicio.rBD() + ".cat_destinos", "");
        this.llenarListas(6, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 50 " );
        this.llenarListas(90, this.servicio.rBD() + ".cat_generales", " WHERE tabla = 65 ");
        this.llenarListas(103, this.servicio.rBD() + ".cat_transportes", "");
      }
      else
      {
        this.detalle.linea = "0";
        this.detalle.maquina = "0";
        this.detalle.area = "0";
      }
      
      this.iniBot()
      this.bot3 = true;
      this.bot4 = true;
      this.bot5 = false;
      this.bot6 = false;
      this.bot7 = false;
      this.editando = true;
      this.faltaMensaje = "No se han guardado los cambios..."
      setTimeout(() => {
        if (this.miSeleccion < 17 && this.miSeleccion != 11)
        {
          if (this.txtNombre)
          {
            this.txtNombre.nativeElement.focus();
          }  
        }
        else
        {
          if (this.lstC0)
          {
            this.lstC0.focus();
          }
        }
        
        this.animando = true;       
      }, 400);
}


  edicionCancelada()
  {
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = "La edición ha sido cancelado por el usuario";
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
  }

  cancelar()
  {
    if (this.bot4 && this.modelo == 4)
    {
      this.iniBot()
      this.edicionCancelada();              
      this.despuesBusqueda = 0;
      if (this.detalle.id == 0)
      {
        this.inicializarPantalla();
        return;
      }
      else if (!this.detalle.id)
      {
        this.inicializarPantalla();
        return;
      }
      else
      {
        this.editar(-1)
      }
    }
  }

  inicializarPantalla()
  {
    this.editando = false;
    this.detalle = [];
    this.detalle.admin = 'N';
    this.detalle.id = 0;
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    this.error05 = false;
    this.error06 = false;
    this.error07 = false;
    this.error08 = false;
    this.error09 = false;
    this.error10 = false;
    this.error20 = false;
    this.error21 = false;
    this.error22 = false;
    this.error23 = false;
    this.error24 = false;
    this.error25 = false;
    this.error30 = false;
    this.error31 = false;
    this.error32 = false;
    this.error33 = false;
    this.error34 = false;
    this.error35 = false;
    this.faltaMensaje = "";
    //
      
      this.detalle.referencia = "";
      this.detalle.notas = "";
      this.detalle.imagen = "";
      this.detalle.nombre = "";
      //
      this.detalle.linea = "0";
      this.detalle.maquina = "0";
      this.detalle.area = "0";
      this.detalle.telefonos = "";
      this.detalle.mmcall = "";
      this.detalle.correos = "";
      //
      this.detalle.agrupador_1 = "0";
      this.detalle.agrupador_2 = "0";
      this.detalle.tipo = "0";
      this.mostrarImagenRegistro = "S";
      this.mensajeImagen = "Campo opcional"
      this.detalle.imagen = "";
      this.detalle.url_mmcall = 0;
      this.detalle.estatus = "A";
      this.detalle.id = 0;
      this.detalle.creado = "";
      this.detalle.modificado = "";
      this.detalle.modificacion = null;
      this.detalle.creacion = null;
    //
    this.detalle.referencia = "";
    this.detalle.nombre = "";
    this.detalle.inicia = this.servicio.fecha(1, "", "HH") + ":00:00";
    this.detalle.termina = this.servicio.fecha(1, "", "HH") + ":59:00";
    this.detalle.cambiodia = "N";
    this.detalle.especial = "N";
    this.detalle.tipo = "0";
    this.detalle.mover = "0";
      
    this.cancelarEdicion = false;
    this.mostrarImagenRegistro = "S";
    this.editando = false;
    this.detalle.estatus = "A"
    this.iniBot()
    this.bot3 = false;
    this.bot4 = false;
    this.bot5 = false;
    this.bot6 = false;
    this.bot7 = false;
    if (this.miSeleccion==12)
    {
      this.detalle.area = "S";
      this.detalle.maquina = "S";
      this.detalle.operacion = "S";
      this.detalle.linea = "S";
      this.asociarTablas(0);
    
    }
    if (this.miSeleccion==12)
    {
      this.detalle.area = "S";
      this.detalle.maquina = "S";
      this.detalle.operacion = "S";
      this.detalle.linea = "S";
      this.asociarTablas(0);
    
    }
    else if (this.miSeleccion==8)
    {
      this.detalle.linea = "S";
      this.asociarOperaciones(1, 0);
    }
    
    setTimeout(() => {
        this.txtNombre.nativeElement.focus();
    }, 300);
  }

  copiar()
  {
    if (this.bot5)
    {
      if (this.editando && !this.cancelarEdicion)
      {
        this.deshacerEdicion(0, 3)
        return;
      } 
      
      this.despuesBusqueda = 1;
      this.editar(-1);
      this.yaValidado = -1;
      
    } 
  }

  deshacerEdicion(parametro: number, desde: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo', data: { titulo: "Registro no guardado", tiempo: 0, mensaje: "Ha efectuado cambios en el registro que no se han guardado. <br><br><strong>¿Qué desea hacer?</strong>", alto: "60", id: 0, accion: 0, botones: 3, boton1STR: "Guardar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "in_pregunta" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        this.cancelarEdicion = true;
        this.guardar();     
        if (desde == 99)
        {
          this.volver()
          //this.procesarPantalla(parametro)
        }
        else if (desde == 2)
        {
          this.nuevo_siguiente();
        }
        else if (desde == 3)
        {
          this.despuesBusqueda = 1;
          this.editar(-1);
        }
      }
      else if (result.accion == 2) 
      {
        this.cancelarEdicion = true;
        this.edicionCancelada();      
        if (desde == 99)
        {
          this.volver()
          //this.procesarPantalla(parametro)
        }
        else if (desde == 2)
        {
          this.nuevo_siguiente();
        }
        else if (desde == 3)
        {
          this.despuesBusqueda = 1;
          this.editar(-1);
        }
      }
    });
  }

  llenarListas(arreglo: number, nTabla: string, cadWhere: string)
  {
    let sentencia = "SELECT id, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY nombre";
    if (arreglo == 15)
    {
      sentencia = "SELECT id, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY nombre";
    }
    else if (arreglo == 31)
    {
      sentencia = "SELECT alerta, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY alerta";
    }
    else if (arreglo == 21)
    {
      sentencia = "SELECT referencia FROM " + nTabla + " " + cadWhere + " ORDER BY referencia";
    }
    else if (arreglo == 8)
    {
      sentencia = "SELECT nombre FROM " + nTabla + " " + cadWhere + " ORDER BY 1";
    }
    else if (arreglo == 16 || arreglo == 4 || arreglo == 20 || arreglo == 22)
    {
      sentencia = "SELECT a.id, CONCAT(a.nombre, ' (', b.nombre, ')') AS nombre FROM " + nTabla + " a LEFT JOIN " + this.servicio.rBD() + ".cat_transportes b ON a.linea = b.id " + cadWhere + " ORDER BY nombre";
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if ((arreglo != 7 && arreglo != 8 && arreglo!= 9 && arreglo < 15 && arreglo != 101))
      {
        resp.splice(0, 0, {id: "0", nombre: "(NO ASOCIADA)"});  
      }
      else if (arreglo == 9)
      {
        resp.splice(0, 0, {id: "0", nombre: "(NO ASOCIADO)"});  
      }
      else if (arreglo == 16 || arreglo == 19 || arreglo==103)
      {
        resp.splice(0, 0, {id: "0", nombre: "(CUALQUIERA)"});  
      }
      else if (arreglo >= 17 && arreglo <= 19 || arreglo==90)
      {
        resp.splice(0, 0, {id: "0", nombre: "(NO ASIGNAR)"});  
      }
      if (arreglo == 1 || arreglo == 101)
      {
        this.agrupadores1 = resp
      }
      else if (arreglo == 2)
      {
        this.agrupadores2 = resp
      }
      else if (arreglo == 3 || arreglo == 103 || arreglo == 19)
      {
        this.lineas = resp
      }
      else if (arreglo == 4 || arreglo == 16 || arreglo == 20 || arreglo == 22)
      {
        this.maquinas = resp
      }
      else if (arreglo == 5 || arreglo == 23)
      {
        this.areas = resp
      }
      else if (arreglo == 6)
      {
        this.tipos = resp
      }
      else if (arreglo == 7)
      {
        this.tablas = resp
      }
      else if (arreglo == 8)
      {
        this.placas = resp
      }
      else if (arreglo == 9)
      {
        this.listas = resp
      }
      else if (arreglo == 10)
      {
        this.listas = resp
      }
      else if (arreglo == 11)
      {
        this.placas = resp
      }
      else if (arreglo == 12)
      {
        this.tipos = resp
      }
      else if (arreglo == 13)
      {
        this.tablas = resp
      }
      else if (arreglo == 14 || arreglo == 18)
      {
        this.turnos = resp
      }
      else if (arreglo == 15)
      {
        this.partes = resp
      }
      else if (arreglo == 17 || arreglo == 117)
      {
        this.lotes = resp
      }
      else if (arreglo == 90)
      {
        this.cargas = resp
      }
      else if (arreglo == 21)
      {
        this.paros = resp
      }
      else if (arreglo == 31)
      {
        this.eventos = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  actualizar()
  {
    this.textoBuscar = "";
    
    if (this.modelo != 5)
    {
      this.modelo = this.modelo == 3 ? 13 : 12;
      this.rRegistros(this.miSeleccion);
    }
    else
    {
      this.modelo = 15;
      this.rTactos(this.reqActual)
    }
    
  }

  adecuar()
  {
    //this.verTabla = false;
    this.verTabla = this.movil;
    if (this.miSeleccion == 1)
    {
      this.titulos = ["", "1. Nombre del transporte", "2 Referencia", "2. Recipiente asociado", "3. Notas explicativas", "4. Foto asociada a al transporte", "6. Estatus del registro", "7. Fecha de creación", "8. Fecha de la última actualización", "9. Usuario que creó el registro", "10. Usuario que modificó el registro", "11. ID del registro", "1.12", "5. Tipo de transporte", "" ];
      this.ayudas = ["", "Especifique el nombre o la razón social del transporte", "Referencia para otros sistemas", "Recipiente asociado a este transporte", "Notas explicativas del registro", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el tipo de transporte", "Especifique el agrupador para la línea (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique la línea asociada" ];
    }
    else if (this.miSeleccion == 2)
    {
      this.titulos = ["", "1. Placas del vehículo", "3. Referencia", "1.4. Recipiente asociado", "4. Notas explicativas", "5. Foto asociada al vehículo", "7 Estatus del registro", "8. Fecha de creación", "9. Fecha de la última actualización", "10. Usuario que creó el registro", "11. Usuario que modificó el registro", "12. ID del registro", "1.13", "7. Marca", "8. Modelo", "6. Tipo de vehículo", "1.16", "1.17", "1.18", "1.19", "2. Transporte asociado" ];
      
      if (this.configuracion.adicionales=="S")
      {
        this.titulos = ["", "1. Placas del vehículo", "3. Referencia", "1.4. Recipiente asociado", "4. Notas explicativas", "5. Foto asociada al vehículo", "9 Estatus del registro", "10. Fecha de creación", "11. Fecha de la última actualización", "12. Usuario que creó el registro", "13. Usuario que modificó el registro", "14. ID del registro", "1.13", "7. Marca", "8. Modelo", "6. Tipo de vehículo", "1.16", "1.17", "1.18", "1.19", "2. Transporte asociado" ];
      
      }
      this.ayudas = ["", "Especifique las placas del vehículo", "Referencia para otros sistemas", "Dirección(es) para el web-service de MMCall. Separe con punto y coma en caso de haber más de una", "Notas explicativas del registro", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Indique la marca del vehículo", "Indique el modelo del vehículo", "Especifique el tipo de vehículo", "16", "17", "18", "19", "Especifique el transporte asociado" ];
    }
    else if (this.miSeleccion == 3)
    {
      if (this.configuracion.agregar_movil == 'S')
      {
        this.titulos = ["", "1. Nombre del chofer", "1.3. Dirección(es) para el web-service de MMCall.", "3. Dirección", "4. Foto asociada al chofer", "5. Teléfono", "5. Estatus del registro", "6. Fecha de creación", "7. Fecha de la última actualización", "8. Usuario que creó el registro", "9. Usuario que modificó el registro", "10. ID del registro", "12", "1.6. Agrupador de áreas (1)", "1.7. Agrupador de áreas (2)" ];
        this.ayudas = ["", "Especifique el nombre del chofer", "Número de teléfono", "Dirección(es) para el web-service de MMCall. Separe con punto y coma en caso de haber más de una", "Especifique la dirección de habitación", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para el área (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para el área (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique la línea asociada" ];
      }
      else
      {
        this.titulos = ["", "1. Nombre del chofer", "2. Teléfono", "1.3. Dirección(es) para el web-service de MMCall.", "3. Dirección", "5. Foto asociada al chofer", "6. Estatus del registro", "7. Fecha de creación", "8. Fecha de la última actualización", "9. Usuario que creó el registro", "10. Usuario que modificó el registro", "11. ID del registro", "12", "1.6. Agrupador de áreas (1)", "1.7. Agrupador de áreas (2)" ];
      this.ayudas = ["", "Especifique el nombre del chofer", "Número de teléfono", "Dirección(es) para el web-service de MMCall. Separe con punto y coma en caso de haber más de una", "Especifique la dirección de habitación", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para el área (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para el área (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique la línea asociada" ];
      }
      
    }
    else if (this.miSeleccion == 4)
    {
      this.titulos = ["", "1.1. Nombre del destino", "1.2. Persona responsable", "1.3. Recipiente asociado.", "1.3. Notas explicativas", "1.4. Foto asociada al destino", "1.7. Estatus del registro", "1.8. Fecha de creación", "1.9. Fecha de la última actualización", "1.10. Usuario que creó el registro", "1.11. Usuario que modificó el registro", "1.12. ID del registro", "1.. Código único para ANDON directo", "1.6. Agrupador de fallas (1)", "1.5. Destino inicial por defecto", "1.6. Destino final por defecto", "1.7. Destino de espera por defecto", "17", "18", "19", "2. Línea asociada", "3. Máquina asociada", "4. Área asociada",  ];
      this.ayudas = ["", "Especifique el nombre o la descripción del área", "Indique el nombre de la persona responsable", "Recipiente asociado a esta área", "Notas explicativas del registro", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","Especifique el código quse usará para el ANDON directo", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "Indique si es el destino inicial por defecto", "Indique si es el destino final por defecto", "Indique si es el destino de espera por defecto", "17", "18", "19", "Especifique si la falla sólo se ocupa en una línea", "Especifique si la falla sólo se ocupa en una máquina", "Especifique si la falla sólo se atiende por un área" ];
    }
    else if (this.miSeleccion == 5)
    {
      this.titulos = ["", "1. Descripción del registro", "2. Tabla asociada", "3. URL de MMCall", "4", "85", "3. Estatus del registro", "4. Fecha de creación", "5. Fecha de la última actualización", "6. Usuario que creó el registro", "7. Usuario que modificó el registro", "8. ID del registro", "12", "9. Agrupador de fallas (1)", "10. Agrupador de fallas (2)", "15", "16", "17", "18", "19", "2. Línea asociada", "3. Máquina asociada", "4. Área asociada", "2. Tabla asociada", "3. Dirección(es) para el web-service de MMCall.",  ];
      this.ayudas = ["", "Especifique la descripción del registro", "Tabla asociada al registro", "", "", "", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique si la falla sólo se ocupa en una línea", "Especifique si la falla sólo se ocupa en una máquina", "Especifique si la falla sólo se atiende por un área", "Indique la tabla asociada a este registro", "Dirección(es) para el web-service de MMCall. Separe con punto y coma en caso de haber más de una" ];
    }
    else if (this.miSeleccion == 6)
    {
      this.titulos = ["", "1. Nombre del recipiente", "6. Referencia", "3", "4", "85", "7. Estatus del registro", "8. Fecha de creación", "9. Fecha de la última actualización", "10. Usuario que creó el registro", "11. Usuario que modificó el registro", "12. ID del registro", "12", "9. Agrupador de fallas (1)", "10. Agrupador de fallas (2)", "15", "16", "17", "18", "19", "2. Línea asociada", "3. Máquina asociada", "4. Área asociada", "2. Tabla asociada", "2. Número(s) de Teléfono", "4. Dirección(es) de correo", "5. Web services de MMCall " ];
      this.ayudas = ["", "Especifique el nombre del recipiente", "Referencia para otros sistemas", "", "", "", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique si la falla sólo se ocupa en una línea", "Especifique si la falla sólo se ocupa en una máquina", "Especifique si la falla sólo se atiende por un área", "Indique la tabla asociada a este registro", "Especifique los números de teléfono a los cuales se llamará o se enviarán SMS. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de correo a los cuales se les enviará un correo. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de web service a los cuales se les enviará un mensaje de MMCall. Separe con punto y coma en caso de haber más de uno." ];
    }
    else if (this.miSeleccion == 7)
    {
      this.titulos = ["", "1. Nombre del correo/reporte", "5. Referencia", "3", "4", "85", "12. Estatus del registro", "13. Fecha de creación", "14. Fecha de la última actualización", "15. Usuario que creó el registro", "16. Usuario que modificó el registro", "17. ID del registro", "12", "9. Agrupador de fallas (1)", "10. Agrupador de fallas (2)", "15", "16", "17", "18", "19", "2. Línea asociada", "3. Máquina asociada", "4. Área asociada", "2. Tabla asociada", "2. Número(s) de Teléfono", "3. Dirección(es) de correo", "4. Web services de MMCall ", "2. Lista de direcciones de correo a donde se enviará el reporte", "3. Lista de direcciones de correo a quienes se les copiará el reporte", "4. Lista de direcciones de correo a quiene se les copiará de forma oculta el reporte", "5. Título que llevará el correo", "6. Texto que se escribirá en el cuerpo del correo ", "7. Marque el reporte o los reportes que se enviarán en este correo", "8. Período a recorrer para la extracción de los datos", "9. Frecuencia de envío del reporte", "10. Hora de envío", "11. Fecha del último envío"   ];
      this.ayudas = ["", "Especifique el nombre del correo/reporte", "Referencia para otros sistemas", "", "", "", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique si la falla sólo se ocupa en una línea", "Especifique si la falla sólo se ocupa en una máquina", "Especifique si la falla sólo se atiende por un área", "Indique la tabla asociada a este registro", "Especifique los números de teléfono a los cuales se llamará o se enviarán SMS. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de correo a los cuales se les enviará un correo. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de web service a los cuales se les enviará un mensaje de MMCall. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de correo electrónico a quienes llegará el reporte. Separe con punto y coma en caso de haber más de una.", "Separe con punto y coma en caso de haber más de una.", "Separe con punto y coma en caso de haber más de una.", "Especifique el texto que aparecerá como título del correo", "Especifique el texto que aparecerá como cuerpo del correo", "Seleccione el o los reportes que serán adjuntados al correo", "Período de tiempo que la aplicación consultará para producir el reporte", "Frecuencia de envío del reporte", "Hora del día en que se enviará el reporte"    ];
    }
    else if (this.miSeleccion == 8)
    {
      this.titulos = ["", "1. Nombre del recipiente", "5. Referencia", "3", "4", "85", "23. Estatus del registro", "12. Fecha de creación", "13. Fecha de la última actualización", "14. Usuario que creó el registro", "15. Usuario que modificó el registro", "16. ID del registro", "12", "9. Agrupador de fallas (1)", "10. Agrupador de fallas (2)", "15", "16", "17", "18", "19", "2. Línea asociada", "3. Máquina asociada", "4. Área asociada", "2. Tabla asociada", "2. Número(s) de Teléfono", "3. Dirección(es) de correo", "4. Web services de MMCall " ];
      this.ayudas = ["", "Especifique el nombre del recipiente", "Referencia para otros sistemas", "", "", "", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique si la falla sólo se ocupa en una línea", "Especifique si la falla sólo se ocupa en una máquina", "Especifique si la falla sólo se atiende por un área", "Indique la tabla asociada a este registro", "Especifique los números de teléfono a los cuales se llamará o se enviarán SMS. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de correo a los cuales se les enviará un correo. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de web service a los cuales se les enviará un mensaje de MMCall. Separe con punto y coma en caso de haber más de uno." ];
    }
    else if (this.miSeleccion == 9)
    {
      this.titulos = ["", "1. Nombre del turno", "8. Referencia", "3", "4", "85", "9. Estatus del registro", "10. Fecha de creación", "11. Fecha de la última actualización", "12. Usuario que creó el registro", "13. Usuario que modificó el registro", "14. ID del registro", "12", "9. Agrupador de fallas (1)", "10. Agrupador de fallas (2)", "15", "16", "17", "18", "19", "2. Línea asociada", "3. Máquina asociada", "4. Área asociada", "2. Tabla asociada", "2. Número(s) de Teléfono", "3. Dirección(es) de correo", "4. Web services de MMCall " ];
      this.ayudas = ["", "Especifique el nombre del turno", "Referencia para otros sistemas", "", "", "", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "Especifique el agrupador para la falla (esto servirá para consultas, reportes y gráficas)", "15", "16", "17", "18", "19", "Especifique si la falla sólo se ocupa en una línea", "Especifique si la falla sólo se ocupa en una máquina", "Especifique si la falla sólo se atiende por un área", "Indique la tabla asociada a este registro", "Especifique los números de teléfono a los cuales se llamará o se enviarán SMS. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de correo a los cuales se les enviará un correo. Separe con punto y coma en caso de haber más de uno.", "Especifique las dirección(es) de web service a los cuales se les enviará un mensaje de MMCall. Separe con punto y coma en caso de haber más de uno." ];
    }
    else if (this.miSeleccion == 12)
    {
      this.titulos = ["", "1.1. Nombre del usuario", "1.2. Perfil de usuario", "1.3. Rol del usuario dentro de la aplicación.", "1.4. Notas explicativas", "1.4. Foto asociada al usuario", "1.9 Estatus del registro", "1.10. Fecha de creación", "1.11 Fecha de la última actualización", "1.12 Usuario que creó el registro", "1.13 Usuario que modificó el registro", "1.14 ID del registro", "1.13", "1.5. Política de seguridad", "3.1 Líneas/Células", "3.2 Máquinas", "3.3 Áreas", "1.17", "1.6 Compañía a la que pertenece el usuario", "1.7 Departamento", "1.8 Planta asociada", "1.10 Turno FIJO asociado" ];
      this.ayudas = ["", "Especifique el nombre del usuario", "Perfil de usuario para iniciar sesión", "Dirección(es) para el web-service de MMCall. Separe con punto y coma en caso de haber más de una", "Notas explicativas del registro", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Política de contraseña asociada al usuario", "Especifique la línea/célula que el usuario podrá acceder en la aplicación", "Especifique la máquina que el usuario podrá acceder en la aplicación", "Especifique el área que el usuario podrá acceder en la aplicación", "16", "Compañía a la que pertenece el usuario", "Departamento a la que pertenece el usuario", "Planta a la que pertenece el usuario", "Especifique el turno para FIJO para este usuario" ];
    }

    else if (this.miSeleccion == 14)
    {
      this.titulos = ["", "1. Nombre de la política", "1.2. Referencia", "1.3. Rol del usuario dentro de la aplicación.", "1.4. Notas explicativas", "1.5. Foto asociada al usuario", "10. Estatus del registro", "11. Fecha de creación", "12. Fecha de la última actualización", "13. Usuario que creó el registro", "14. Usuario que modificó el registro", "15. ID del registro", "1.13", "1.6. Política de seguridad", "3.1 Líneas/Células", "3.2 Máquinas", "3.3 Áreas", "1.17", "1.7 Compañía a la que pertenece el usuario", "1.8 Departamento", "1.9 Planta asociada" ];
      this.ayudas = ["", "Especifique el nombre de la política", "Referencia para otros sistemas", "Dirección(es) para el web-service de MMCall. Separe con punto y coma en caso de haber más de una", "Notas explicativas del registro", "Foto asociada al registro", "Al inactivar el registro ya no estará disponible en el sistema", "7", "8", "9", "10", "11","12", "Política de contraseña asociada al usuario", "Especifique la línea/célula que el usuario podrá acceder en la aplicación", "Especifique la máquina que el usuario podrá acceder en la aplicación", "Especifique el área que el usuario podrá acceder en la aplicaciónEspecifique el tipo de máquina, si aplica", "16", "Compañía a la que pertenece el usuario", "Departamento a la que pertenece el usuario", "Planta a la que pertenece el usuario", "Especifique la línea asociada" ];
    }


    //

  }

  inactivar()
  {
    let adicional: string = "";
    let mensajeEliminar = "Esta acción inactivará el registro seleccionado y no estará disponible en el sistema<br><br><strong>¿Desea continuar con la operación?</strong>";
    if (this.miSeleccion == 21)
    {
      mensajeEliminar = "Esta acción inactivará el paro seleccionado y su efecto en los gráficos de OEE<br><br><strong>¿Desea continuar con la operación?</strong>";
    }
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo_atencion', data: { titulo: "INACTIVAR REGISTRO", mensaje: mensajeEliminar, id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Inactivar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_inactivar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_transportes SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
            if (this.miSeleccion == 2)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_vehiculos SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();";
            }
            else if (this.miSeleccion == 3)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_choferes SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
            }
            else if (this.miSeleccion == 5)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_generales SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
            }
            else if (this.miSeleccion == 6)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_distribucion SET estatus = 'I', modificado = " + this.servicio.rUsuario().id + ", modificacion = NOW() WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();";
            }
            else if (this.miSeleccion == 7)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_correos SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
            }
            else if (this.miSeleccion == 8)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_alertas SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();";
            }
            else if (this.miSeleccion == 9)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_turnos SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET turnos = NOW();";
            }
            else if (this.miSeleccion == 11)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_rutas SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 17)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_descargas SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 12)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 14)
            {
              sentencia = "UPDATE " + this.servicio.rBD() + ".politicas SET estatus = 'I' WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();";
            }
            
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              this.detalle.estatus = "I";
              this.bot6 = false;
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = "El registro ha sido inactivado satisactoriamente";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
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


  inactivarD(id: number)
  {
    if (id == 1)
    {
      let sentencia = "SELECT CASE WHEN estado = 0 THEN 'DISPONIBLE' WHEN estado = 10 THEN 'EN ESPERA' WHEN estado = 20 THEN 'EN TRÁNSITO' WHEN estado = 30 THEN 'DESCARGANDO' WHEN estado = 40 THEN 'FINALIZADO' ELSE 'N/A' END AS estado, desde FROM " + this.servicio.rBD() + ".requesters WHERE id = " + this.reqActual + " AND estado > 0"
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          const respuesta = this.dialogo.open(DialogoComponent, {
            width: "360px", panelClass: 'dialogo_atencion', data: { titulo: "INICIALIZAR DISPOSITIVO", mensaje: "El dispositivo está en estado <strong>" + resp[0].estado + "</strong> desde el " + this.servicio.fecha(2, resp[0].desde, "EEE, dd/MMM/yyyy HH:mm:ss") + "</strong><br><br>Espere a que esté disponible para poderlo inicializarlo", id: 0, accion: 0, tiempo: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_inactivar" 
          }});
          return;
        }
        else
        {
          this.inactivarD(2);
        }
              
      });
    }
    else
    {
      let mensajeEliminar = "Esta acción inicializará el dispositivo y ya no estará disponible en el sistema hasta que se identifique de nuevo<br><br><strong>¿Desea continuar con la operación?</strong>";
      const respuesta = this.dialogo.open(DialogoComponent, {
        width: "420px", panelClass: 'dialogo_atencion', data: { titulo: "INICIALIZAR DISPOSITIVO", mensaje: mensajeEliminar, id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Inactivar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_inactivar" }
      });
      respuesta.afterClosed().subscribe(result => 
      {
        if (result)
          {
            if (result.accion == 1) 
            {
              let sentencia = "DELETE FROM " + this.servicio.rBD() + ".requesters WHERE id = " + this.reqActual
              let campos = {accion: 200, sentencia: sentencia};  
              this.servicio.consultasBD(campos).subscribe( resp =>
              {
                this.detalle.estatus = "I";
                this.bot6 = false;
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = "El disposito ha sido desasignado";
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
                this.volver();
              })
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
    
  }




  eliminar()
  {
    let adicional: string = "";
    let mensajeEliminar = "Esta acción ELIMINARÁ PERMANENTEMENTE el registro seleccionado y no estará disponible<br><br><strong>¿Desea continuar con la operación?</strong>";
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo_atencion', data: { titulo: "ELIMINAR REGISTRO", mensaje: mensajeEliminar, id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Eliminar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_eliminar" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            let sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_transportes WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
            if (this.miSeleccion == 2)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_vehiculos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET maquinas = NOW();";
            }
            else if (this.miSeleccion == 3)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_choferes WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET areas = NOW();";
            }
            else if (this.miSeleccion == 5)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_generales WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
            }
            else if (this.miSeleccion == 4)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_destinos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET generales = NOW();";
            }
            else if (this.miSeleccion == 6)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_distribucion WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET distribucion = NOW();";
            }
            else if (this.miSeleccion == 7)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".det_correo WHERE correo = " + +this.detalle.id + ";DELETE FROM " + this.servicio.rBD() + ".cat_correos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
            }
            else if (this.miSeleccion == 8)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_alertas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET alertas = NOW();";
            }
            else if (this.miSeleccion == 9)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_turnos WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET turnos = NOW();";
            }
            else if (this.miSeleccion == 10)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".traduccion WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET traducciones = NOW();";
            }
            else if (this.miSeleccion == 11)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_rutas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 17)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_descargas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 12)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET usuarios = NOW();";
            }
            else if (this.miSeleccion == 14)
            {
              sentencia = "DELETE FROM " + this.servicio.rBD() + ".politicas WHERE id = " + +this.detalle.id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET politicas = NOW();";
            }
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              this.detalle.estatus = "I";
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = "El registro ha sido eliminado satisactoriamente";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.regresar();
            })
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

  exportar()
  {
    let nombreReporte = "catalogo_trasportes.csv";
    let catalogo = "Catalogo de transportes";
    if (this.miSeleccion == 2)
    {
      nombreReporte = "catalogo_vehiculos.csv";
      catalogo = "Catalogo de vehiculos";
    }
    else if (this.miSeleccion == 3)
    {
      nombreReporte = "catalogo_choferes.csv";
      catalogo = "Catalogo de choferes";
    }
    else if (this.miSeleccion == 4)
    {
      nombreReporte = "catalogo_destinos.csv";
      catalogo = "Catalogo de destinos";
    }
    else if (this.miSeleccion == 5)
    {
      nombreReporte = "catalogo_generales.csv";
      catalogo = "Catalogo de registros generaless";
    }
    else if (this.miSeleccion == 6)
    {
      nombreReporte = "recipientes.csv";
      catalogo = "Catalogo de recipientes";
    }
    else if (this.miSeleccion == 7)
    {
      nombreReporte = "correos.csv";
      catalogo = "Catalogo de correos/reportes";
      
    }
    else if (this.miSeleccion == 8)
    {
      nombreReporte = "alertas.csv";
      catalogo = "Catalogo de alertas";
    }
    else if (this.miSeleccion == 9)
    {
      nombreReporte = "turnos.csv";
      catalogo = "Catalogo de turnos";
    }
    else if (this.miSeleccion == 10)
    {
      nombreReporte = "traducciones.csv";
      catalogo = "Catalogo de traducciones";
    }
    else if (this.miSeleccion == 11)
    {
      nombreReporte = "rutas.csv";
      catalogo = "Catalogo de rutas";
    }
    else if (this.miSeleccion == 17)
    {
      nombreReporte = "tiempos_de_descarga.csv";
      catalogo = "Tiempos de descarga";
    }
    else if (this.miSeleccion == 14)
    {
      nombreReporte = "politicas.csv";
      catalogo = "Catalogo de politicas";
    }
    else if (this.miSeleccion == 12)
    {
      nombreReporte = "usuarios.csv";
      catalogo = "Catalogo de usuarios";
    }
    else if (this.modelo == 5)
    {
      nombreReporte = "tactos_por_placa.csv";
      catalogo = "Reporte de tactos por placa";
    }
    else if (this.miSeleccion == 31)
    {
      nombreReporte = "dispositivos_transito.csv";
      catalogo = "Reporte de dispositivos (Transito)";
    }
    else if (this.miSeleccion == 32)
    {
      nombreReporte = "dispositivos_disponibles.csv";
      catalogo = "Reporte de dispositivos (Disponibles)";
    }
    else if (this.miSeleccion == 33)
    {
      nombreReporte = "dispositivos_TODOS.csv";
      catalogo = "Reporte de dispositivos (Todos)";
    }
    else if (this.miSeleccion == 34)
    {
      nombreReporte = "dispositivos_espera.csv";
      catalogo = "Reporte de dispositivos (Espera)";
    }
    else if (this.miSeleccion == 36)
    {
      nombreReporte = "dispositivos_descargando.csv";
      catalogo = "Reporte de dispositivos (Descargando)";
    }
    else if (this.miSeleccion == 37)
    {
      nombreReporte = "dispositivos_finalizado.csv";
      catalogo = "Reporte de dispositivos (FInalizado)";
    }
    else if (this.miSeleccion == 35)
    {
      nombreReporte = "dispositivos.csv";
      catalogo = "Reporte de dispositivos";
    }
    
      let campos = {accion: 100, sentencia: this.sentenciaR};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.servicio.generarReporte(resp, catalogo, nombreReporte)
      }
    })
  }

  listarListados(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.reporte), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".int_listados a LEFT JOIN " + this.servicio.rBD() + ".det_correo b ON a.id = b.reporte AND b.correo = " + id + " WHERE a.estatus = 'A' ORDER BY seleccionado DESC, a.orden;"
    this.listados = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      setTimeout(() => {
        this.listados = resp;  
      }, 200);
      
    });
  }

  asociarTablasFalla(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.proceso AND b.tipo = 1 AND b.falla = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.lineasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.lineasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, c.nombre as nlinea, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.falla = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_transportes c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, c.nombre as nlinea, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".cat_transportes c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.maquinasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.maquinasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_choferes a LEFT JOIN " + this.servicio.rBD() + ".relacion_fallas_operaciones b ON a.id = b.proceso AND b.tipo = 3 AND b.falla = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_choferes a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.areasSel = resp;  
      
    });
  
  }

  asociarOperaciones(operacion: number, indice: number)
  {
    let sentencia = "";
    if (operacion == 1)
    {
      sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.detalle), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".relaciones b ON a.id = b.detalle AND b.operacion = " + operacion + " AND indice = " + indice + " ORDER BY seleccionado DESC, a.nombre"
      if (indice == 0)
      {
        sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a WHERE a.estatus = 'A' ORDER BY a.nombre"
      }
    }
    this.lineasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.lineasSel = resp;  
      }
      else
      {
        sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a WHERE a.estatus = 'A' ORDER BY a.nombre"
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.lineasSel = resp;  
        });
      }
    });
    
  }

  asociarTablas(id: number)
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 1 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_transportes a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.lineasSel = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.lineasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, c.nombre as nlinea, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 2 AND b.usuario = " + id + " LEFT JOIN " + this.servicio.rBD() + ".cat_transportes c ON a.linea = c.id ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, c.nombre as nlinea, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".cat_transportes c ON a.linea = c.id WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.maquinasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.maquinasSel = resp;  
      
    });
    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_choferes a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 3 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_choferes a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.areasSel = resp;  
      
    });

    sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.proceso), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_operaciones b ON a.id = b.proceso AND b.tipo = 0 AND b.usuario = " + id + " ORDER BY seleccionado DESC, a.nombre"
    if (id==0)
    {
      sentencia = "SELECT a.id, a.nombre, 0 AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a WHERE a.estatus = 'A' ORDER BY a.nombre"
    }
    this.areasSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.operacionesSel = resp;  
      
    });
    
    sentencia = "SELECT a.id, CASE WHEN a.rol ='*' THEN '(Todos los roles)' WHEN a.rol = 'A' THEN 'ADMINISTRADOR' WHEN a.rol = 'G' THEN 'Gestor de la aplicación' WHEN a.rol = 'S' THEN 'Supervisor' WHEN a.rol = 'T' THEN 'Técnico' WHEN a.rol = 'O' THEN 'Operador' END AS erol, a.nombre, IF(ISNULL(b.opcion), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones a LEFT JOIN " + this.servicio.rBD() + ".relacion_usuarios_opciones b ON a.id = b.opcion AND b.usuario = " + id + " WHERE a.visualizar = 'S' ORDER BY seleccionado DESC, a.orden"
    if (id==0)
    {
      sentencia = "SELECT a.id, CASE WHEN a.rol ='*' THEN '(Todos los roles)' WHEN a.rol = 'A' THEN 'ADMINISTRADOR' WHEN a.rol = 'G' THEN 'Gestor de la aplicación' WHEN a.rol = 'S' THEN 'Supervisor' WHEN a.rol = 'T' THEN 'Técnico' WHEN a.rol = 'O' THEN 'Operador' END AS erol, a.nombre, IF(a.rol = 'O', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones a WHERE a.visualizar = 'S' ORDER BY a.orden"
    }
    this.opcionesSel = [];
    campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.opcionesSel = resp;  
      
    });
  }

    seleccion(tipo: number, event: any) 
    {
      this.cambiando("");
      if (tipo == 0)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.operacionesSel.length; i++) 
          {
            this.operacionesSel[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.detalle.operacion = "N";  
          }, 100);
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.operacionesSel.length; i++) 
          {
            this.operacionesSel[i].seleccionado = 0;
          }
          setTimeout(() => {
            this.detalle.operacion = "N";  
          }, 100);
        }
      }
      else if (tipo == 1)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.lineasSel.length; i++) 
          {
            this.lineasSel[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.detalle.linea = "N";  
          }, 100);
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.lineasSel.length; i++) 
          {
            this.lineasSel[i].seleccionado = 0;
          }
          setTimeout(() => {
            this.detalle.linea = "N";  
          }, 100);
        }
      }
      else if (tipo == 6)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.listados.length; i++) 
          {
            this.listados[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.selListadoT = "S";  
          }, 100);
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.listados.length; i++) 
          {
            this.listados[i].seleccionado = 0;
          }
          setTimeout(() => {
            this.selListadoT = "S";   
          }, 100);
        }
      }
      else if (tipo == 2)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.maquinasSel.length; i++) 
          {
            this.maquinasSel[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.detalle.maquina = "N";  
          }, 100);
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.maquinasSel.length; i++) 
          {
            this.maquinasSel[i].seleccionado = 0;
          }
          setTimeout(() => {
            this.detalle.maquina = "N";  
          }, 100);
        }
      }
      else if (tipo == 13)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.partesSel.length; i++) 
          {
            this.partesSel[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.detalle.parte = "N";  
          }, 100);
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.partesSel.length; i++) 
          {
            this.partesSel[i].seleccionado = 0;
          }
          setTimeout(() => {
            this.detalle.parte = "N";  
          }, 100);
        }
      }
      else if (tipo == 3)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.areasSel.length; i++) 
          {
            this.areasSel[i].seleccionado = 1;
          }
          setTimeout(() => {
            this.detalle.area = "N";  
          }, 100);
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.areasSel.length; i++) 
          {
            this.areasSel[i].seleccionado = 0;
          }
          setTimeout(() => {
            this.detalle.area = "N";  
          }, 100);
        }
      }
      else if (tipo == 5)
      {
        let sentencia = ""
        if (event.value == "A") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, 1 AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
        }
        else if (event.value == "G") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'G' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
        }
        else if (event.value == "S") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'S' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
        }
        else if (event.value == "T") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'T' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
        }
        else if (event.value == "O") 
        {
          sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'O' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
        }

        this.opcionesSel = [];
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.opcionesSel = resp;  
        });
      }
      else if (tipo == 4)
      {
        if (event.value == 1) 
        {
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            this.opcionesSel[i].seleccionado = 1;
          }
        }
        else if (event.value == 0) 
        {
          for (var i = 0; i < this.opcionesSel.length; i++) 
          {
            this.opcionesSel[i].seleccionado = 0;
          }
          
        }
        setTimeout(() => {
          this.opciones = "S";  
        }, 100);
      }


    }  

    colocarOpciones()
    {
      let sentencia = ""
      if (this.detalle.rol == "A") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, 1 AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
      }
      else if (this.detalle.rol == "G") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'G' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
      }
      else if (this.detalle.rol == "S") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'S' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
      }
      else if (this.detalle.rol == "T") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'T' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
      }
      else if (this.detalle.rol == "O") 
      {
        sentencia = "SELECT id, CASE WHEN rol ='*' THEN '(Todos los roles)' WHEN rol = 'A' THEN 'ADMINISTRADOR' WHEN rol = 'G' THEN 'Gestor de la aplicación' WHEN rol = 'S' THEN 'Supervisor' WHEN rol = 'T' THEN 'Técnico' WHEN rol = 'O' THEN 'Operador' END AS erol, nombre, IF(rol = 'O' OR rol = '*', 1, 0) AS seleccionado FROM " + this.servicio.rBD() + ".int_opciones WHERE visualizar = 'S' ORDER BY seleccionado DESC, orden"
      }

      this.opcionesSel = [];
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.opcionesSel = resp;  
      });
    }

  reiniciar()
  {
    let adicional: string = "";
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "480px", panelClass: 'dialogo', data: { titulo: "REINICIAR CONTRASEÑA", mensaje: "Esta acción reiniciará la contraseña del usuario seleccionado y la deberá cambiar en sl siguiente inicio de sesión<br><br><strong>¿Desea continuar con la operación?</strong>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Reiniciar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_grupos" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
        {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET inicializada = 'S' WHERE id = " + this.detalle.id;
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              
              this.detalle.inicializada = "S";
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "La contraseña del usuario se ha inicializado";
              mensajeCompleto.tiempo = 2500;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            })
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

  
  buscarIndice(index: number, item) {
    return item.id;
  }

  verMacros()
  {
    let mensajeTotal = "<strong>[1]</strong> Nombre del chofer.<br><strong>[2]</strong> Nombre del transporte.<br><strong>[3]</strong> Placas del vehículo.<br><strong>[4]</strong> Nombre del destino.<br><strong>[5]</strong> Fecha de la llamada.<br><strong>[11]</strong> Tiempo transcurrido.<br>";
   
    mensajeTotal = mensajeTotal + "<br><strong>[20]</strong> Número de repetición.<br><strong>[30]</strong> Nivel de escalamiento.<br><strong>[31]</strong> Repeticiones escalamiento 1.<br><strong>[32]</strong> Repeticiones escalamiento 2.<br><strong>[33]</strong> Repeticiones escalamiento 3.<br><strong>[34]</strong> Repeticiones escalamiento 4.<br><strong>[35]</strong> Repeticiones escalamiento 5.<br>";
    mensajeTotal = mensajeTotal + "<strong>[90]</strong> Salto de línea (sólo correo).";
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "400px", panelClass: 'dialogo', data: { titulo: "Macros para mensajes de alerta", tiempo: -1, mensaje: mensajeTotal, alto: "300", id: 0, accion: 0, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_general" }
    });
  }

ordenarPor(tabla: number, campo: number)
{
  this.animando = false;
  this.ordenadoPor = campo;
  if (tabla < 0)
  {
    tabla = this.miSeleccion;
  }
  this.rRegistros(tabla);
  setTimeout(() => {
    this.animando = true;  
  }, 500)
}

expandir()
{
  this.vistaResumen = this.vistaResumen == 1 ? 2 : 1;
  if (this.vistaResumen != 0)
  {
    this.icoExpandir = this.vistaResumen == 1 ? "i_expandir" : "i_reducir";
  }
}

cadaSegundo()
  {
    if (this.router.url.substr(0, 10) != "/catalogos")
    {
      return;
    }
    this.revisarTiempo();
    if (this.modelo > 10 && !this.efectoDemorado)
    {
      this.efectoDemorado = true
    }
    else if (this.modelo > 10 && this.efectoDemorado)
    {
      this.efectoDemorado = false;
      this.modelo = this.modelo - 10;
    }
    
  }

revisarTiempo()
{
  this.contarTiempo = false;
  for (var i = 0; i < this.registros.length; i++)
    {
      if(this.registros[i].preasignado=="S" && this.registros[i].estadonro == 10 && this.registros[i].orden != 1)
      {
        if (this.registros[i].fecha_recibo)
        {
          let segundos =  this.servicio.tiempoTranscurrido(this.registros[i].fecha_recibo, "F").split(";");
          this.arreTiempos[i] = segundos[1].substring(0, 1) != '-' ? (segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3])) : "---";
          this.cadTiempos[i] = segundos[1].substring(0, 1) != '-' ? "FALTAN" : "VENCIDO";
        }
        else
        {
          this.arreTiempos[i] = "";
          this.cadTiempos[i] = "";
        }
      }
      else
      {
        if (this.registros[i].desde)
        {
          let segundos =  this.servicio.tiempoTranscurrido(this.registros[i].desde, "V").split(";");
          this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
          this.cadTiempos[i] = this.registros[i].alarmado != 'S' ? "VAN" : "VENCIDO";
        }
        else
        {
          this.arreTiempos[i] = "";
          this.cadTiempos[i] = "";
        }
      }
                
    }
    for (var i = 0; i < this.historias.length; i++)
    {
      if (this.historias[i].idest == 0)
      {
        let segundos =  this.servicio.tiempoTranscurrido(this.historias[i].inicio, "V").split(";");
        this.arreTiempos2[i] = (+segundos[1] < 10 ? "0" + segundos[1] : segundos[1])  + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
      }       
      else if (this.historias[i].idest == 1)
      {
        let segundos =  this.servicio.tiempoTranscurrido(this.historias[i].des_inicio, "V").split(";");
        this.arreTiempos3[i] = (+segundos[1] < 10 ? "0" + segundos[1] : segundos[1])  + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
      }
      else
      {
        this.arreTiempos3[i] = "";
        this.arreTiempos2[i] = "";
      }
    }
    this.contarTiempo = true;
  }

  buscarPlaca(event: MatAutocompleteSelectedEvent) 
  {
    if (!event.option.value)
    {
      this.cadPlaca = 0;
      this.iniPlaca()
      return
    }
    this.buscarDatosVehiculo(event.option.value, 2)
      
  }

  buscarDatosVehiculo(placa: string, espera: number) 
  {
      if (placa == "")
    {
      this.cadPlaca = 0;
      this.iniPlaca()
      return
    }
    if (this.cadenaAntes != placa && espera==1)
    {
      this.cadenaAntes = placa;
      setTimeout(() => {
        this.buscarDatosVehiculo(this.cadenaAntes, 1);
      }, 800);
      return;
    }
    
    this.servicio.activarSpinnerSmall.emit(true);
    let sentencia = "SELECT a.id, a.linea, f.nombre AS ntransporte, a.chofer, a.tipo, a.agrupador_1, a.agrupador_2, a.carga, b.nombre, b.referencia, b.estatus AS choferestatus FROM " + this.servicio.rBD() + ".cat_vehiculos a LEFT JOIN " + this.servicio.rBD() + ".cat_choferes b ON a.chofer = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON a.agrupador_1 = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.linea = f.id WHERE a.nombre = '" + placa + "' LIMIT 1";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.cadPlaca = 1;
        this.detalle.nchofer = resp[0].chofer ? resp[0].chofer : 0;
        this.detalle.chofer = resp[0].nombre ? resp[0].nombre : "";
        this.detalle.linea = resp[0].linea ? resp[0].linea : 0;
        this.detalle.nlinea = resp[0].ntransporte ? resp[0].ntransporte : "";
        this.detalle.transporte = resp[0].linea ? resp[0].linea : 0;
        this.detalle.agrupador_1 = resp[0].agrupador_1 ? resp[0].agrupador_1 : 0;
        this.detalle.tipo = resp[0].tipo ? resp[0].tipo : 0;
        this.buscarMarca(this.detalle.agrupador_1)
        this.detalle.agrupador_2 = resp[0].agrupador_2 ? resp[0].agrupador_2 : 0;
        if (this.pagerActual!=0)
        {
          this.detalle.referencia = resp[0].referencia ? resp[0].referencia : "";
        }
        this.detalle.carga = resp[0].carga ? resp[0].carga : 0;
        this.detalle.vehiculo = resp[0].id;
        this.cadChofer = resp[0].chofer > 0 ? 1 : 3;
        if (resp[0].choferestatus == "S")
        {
          this.cadChofer = 2;
        }

        this.cadTransporte = resp[0].linea > 0 ? 1 : 2;
        
      }
      else
      {
        this.cadPlaca = 2;
        this.iniPlaca()
        
      }
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);
      }, 200);
    })
  }

  iniPlaca()
  {
    this.detalle.nchofer = 0;
    this.detalle.chofer = "";
    this.detalle.carga = "0";
    this.detalle.linea = "0";
    this.detalle.agrupador_1 = "0";
    this.detalle.tipo = "0";
    this.detalle.agrupador_2 = "0";
    if (this.pagerActual != 0)
    {
      this.detalle.referencia = "";
    }
    this.detalle.vehiculo = 0;
  }

  iniReferencia()
  {
    this.detalle.nchofer = 0;
    this.detalle.chofer = "";
    this.detalle.carga = "";
    this.detalle.linea = "0";
    this.detalle.agrupador_1 = "0";
    this.detalle.tipo = 0;
    this.detalle.agrupador_2 = "0";
    this.detalle.placa = "";
    this.detalle.vehiculo = 0;
  }

  buscarChofer(event: MatAutocompleteSelectedEvent) 
  {
    if (!event.option.value)
    {
      this.cadChofer = 0;
      if (this.pagerActual!=0)
      {
        this.detalle.referencia = "";
      }
      return
    }
    this.buscarDatosChofer(event.option.value, 2);
    
  }

  buscarTransporte(event: MatAutocompleteSelectedEvent) 
  {
    if (!event.option.value)
    {
      this.cadTransporte = 0;
      return
    }
    this.buscarDatosTransporte(event.option.value, 2);
    
  }

  buscarReferencia(event: MatAutocompleteSelectedEvent) 
  {
    if (!event.option.value)
    {
      this.cadReferencia = 0;
      return
    }
    this.buscarDatosReferencia(event.option.value, 2);
    
  }

  buscarDatosChofer(chofer: string, espera: number) 
  {
    if (chofer == "")
    {
      this.cadChofer = 0;
      if (this.pagerActual!=0)
      {
        this.detalle.referencia = "";
      }
      
      return
    }

    if (this.cadenaAntes != chofer && espera == 1)
    {
      this.cadenaAntes = chofer;
      setTimeout(() => {
        this.buscarDatosChofer(this.cadenaAntes, 1);
      }, 800);
      return;
    }
    this.servicio.activarSpinnerSmall.emit(true);
    let sentencia = "SELECT id, referencia, estatus FROM " + this.servicio.rBD() + ".cat_choferes WHERE nombre = '" + chofer + "' LIMIT 1";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.cadChofer = resp.length > 0 ? 1 : 3;
      if (resp.length > 0)
      {
        if (resp[0].estatus == "S")
        {
          this.cadChofer = 2;
        }
        this.detalle.nchofer = resp[0].id ? resp[0].id : 0;
        if (this.pagerActual!=0)
        {
          this.detalle.referencia = resp[0].referencia ? resp[0].referencia : "";
        }
      }
      else
      {
        this.detalle.nchofer = "";
        if (this.pagerActual!=0)
        {
          this.detalle.referencia = "";
        }
      }
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);
      }, 200);
    })
  }

  buscarDatosTransporte(chofer: string, espera: number) 
  {
    if (chofer == "")
    {
      this.cadTransporte = 0;
      return
    }

    if (this.cadenaAntes != chofer && espera == 1)
    {
      this.cadenaAntes = chofer;
      setTimeout(() => {
        this.buscarDatosTransporte(this.cadenaAntes, 1);
      }, 800);
      return;
    }
    this.servicio.activarSpinnerSmall.emit(true);
    let sentencia = "SELECT id, estatus FROM " + this.servicio.rBD() + ".cat_transportes WHERE nombre = '" + chofer + "' LIMIT 1";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.cadTransporte = resp.length > 0 ? 1 : 2;
      if (resp.length > 0)
      {
        this.detalle.linea = resp[0].id ? resp[0].id : 0;
      }
      else
      {
        this.detalle.linea = 0;
      }
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);
      }, 200);
    })
  }

  buscarDatosReferencia(placa: string, espera: number) 
  {
    if (placa == "")
    {
      this.cadReferencia = 0;
      this.iniReferencia()
      return
    }

    if (this.cadenaAntes != placa && espera == 1)
    {
      this.cadenaAntes = placa;
      setTimeout(() => {
        this.buscarDatosReferencia(this.cadenaAntes, 1);
      }, 800);
      return;
    }

    this.servicio.activarSpinnerSmall.emit(true);
    let sentencia = "SELECT a.id, b.linea, b.id, b.tipo, b.nombre AS placa, b.agrupador_1, b.agrupador_2, b.carga, a.nombre FROM " + this.servicio.rBD() + ".cat_choferes a LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos b ON a.id = b.chofer LEFT JOIN " + this.servicio.rBD() + ".cat_generales e ON b.agrupador_1 = e.id WHERE a.referencia = '" + placa + "' LIMIT 1";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.cadReferencia = 1;
        this.detalle.nchofer = resp[0].chofer ? resp[0].chofer : 0;
        this.detalle.chofer = resp[0].nombre ? resp[0].nombre : "";
        this.detalle.linea = resp[0].linea ? resp[0].linea : 0;
        this.detalle.agrupador_1 = resp[0].agrupador_1 ? resp[0].agrupador_1 : 0;
        this.detalle.tipo = resp[0].tipo ? resp[0].tipo : 0;
        this.buscarMarca(this.detalle.agrupador_1)
        this.detalle.agrupador_2 = resp[0].agrupador_2 ? resp[0].agrupador_2 : 0;
        this.detalle.placa = resp[0].placa ? resp[0].placa : "";
        this.detalle.carga = resp[0].carga ? resp[0].carga : "";
        this.detalle.vehiculo = resp[0].id;
      }
      else
      {
        this.cadReferencia = 2;
        this.iniReferencia()
        
      }
      setTimeout(() => {
        this.servicio.activarSpinnerSmall.emit(false);
      }, 200);
    })
  }


  filtrando(id: number)
  {
    if (id == 35)
    {
      this.cambiarVista(0);
      this.filtro35 = !this.filtro35
      this.filtroAplicado = this.filtro35;
      this.literalFiltros();
      this.rRegistros(id);
    }
  }

  literalFiltros()
  {
    if (this.miSeleccion == 35)
    {
      this.litFiltrar = this.filtro35 ? "Ver todos" : "Solo sin asignar";
    }
  }

  actualizarChofer()
  {
    if (this.detalle.chofer)
    {
      let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_choferes WHERE nombre = '" + this.detalle.chofer.toUpperCase() + "'";
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        let nuevo = true;
        sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_choferes (nombre, referencia, creacion, modificacion, creado, modificado) VALUES ('" + this.detalle.chofer.toUpperCase() + "', '" + this.detalle.referencia + "', NOW(), NOW(), " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET choferes = NOW();";
        if (resp.length > 0)
        {
          this.detalle.nchofer = resp[0].id;
          nuevo = false;
          sentencia = "UPDATE " + this.servicio.rBD() + ".cat_choferes SET referencia = '" + this.detalle.referencia + "', modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + " WHERE id = " + +this.detalle.nchofer + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
        }
        campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (nuevo)
          {
            sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_choferes WHERE nombre = '" + this.detalle.chofer + "'";
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              if (resp.length > 0)
              {
                this.detalle.nchofer = resp[0].id;
              }
              this.procesoGuardar = 1;
              this.guardar()
            })
          }
          else
          {
            this.procesoGuardar = 1;
            this.guardar()
          }
        })  
      })
    }
  }

  actualizarTransporte()
  {
    if (this.detalle.nlinea)
    {
      let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_transportes WHERE nombre = '" + this.detalle.nlinea.toUpperCase() + "'";
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.detalle.linea = resp[0].id;
          this.procesoGuardar = 2;
          this.guardar();
        }
        else
        {
          sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_transportes (nombre, creacion, modificacion, creado, modificado) VALUES ('" + this.detalle.nlinea.toUpperCase() + "', NOW(), NOW(), " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ");UPDATE " + this.servicio.rBD() + ".actualizaciones SET lineas = NOW();";
          campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_transportes WHERE nombre = '" + this.detalle.nlinea + "'";
            let campos = {accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              if (resp.length > 0)
              {
                this.detalle.linea = resp[0].id;
              }
              this.procesoGuardar = 2;
              this.guardar()
            })
          })
        }
      })
    }
    else
    {
      this.procesoGuardar = 2;
      this.guardar();
    }
  }

  actualizarVehiculo()
  {
    if (this.detalle.placa)
    {
      let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_vehiculos WHERE nombre = '" + this.detalle.placa.toUpperCase() + "'";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let nuevo = true;
      sentencia = "INSERT INTO " + this.servicio.rBD() + ".cat_vehiculos (nombre, linea, agrupador_1, agrupador_2, tipo, chofer, creacion, modificacion, creado, modificado, carga) VALUES ('" + this.detalle.placa.toUpperCase() + "', " + this.detalle.linea + ", " + this.detalle.agrupador_1 + ", " + this.detalle.agrupador_2 + ", " + this.detalle.tipo + ", " + this.detalle.nchofer + ", NOW(), NOW(), " + this.servicio.rUsuario().id + ", " + this.servicio.rUsuario().id + ", '" + this.detalle.carga + "');UPDATE " + this.servicio.rBD() + ".actualizaciones SET correos = NOW();";
      if (resp.length > 0)
      {
        nuevo = false;
        this.detalle.vehiculo = resp[0].id;
        sentencia = "UPDATE " + this.servicio.rBD() + ".cat_vehiculos SET chofer = " + this.detalle.nchofer + ", tipo = " + this.detalle.tipo + ", agrupador_1 = " + this.detalle.agrupador_1 + ", agrupador_2 = " + this.detalle.agrupador_2 + ", linea = " + this.detalle.linea + ", modificacion = NOW(), modificado = " + this.servicio.rUsuario().id + ", carga = " + this.detalle.carga + " WHERE id = " + this.detalle.vehiculo + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET vehiculos = NOW();";
      }
      campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (nuevo)
        {
          sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_vehiculos WHERE nombre = '" + this.detalle.placa + "'";
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              this.detalle.vehiculo = resp[0].id;
            }
            this.procesoGuardar = 3;
            this.guardar()
          })
        }
        else
        {
          this.procesoGuardar = 3;
          this.guardar()
        }
      })  
    })
    }
    else
    {
      this.procesoGuardar = 3;
      this.guardar()
    }
  }

  disponible(id: number)
  {

    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "360px", panelClass: 'dialogo', data: { titulo: "Regresar a disponible", tiempo: 0, mensaje: "Esta acción convertirá al dispositivo al estado <strong>DISPONIBLE</strong> listo para una nueva identificación. <br><br><strong>¿Desea regresar el dispositivo a disponible?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 0, usuario_asigna = 0, alarmas = 0, orden = 0, viajes = 0, origen = 0, destino = 0, alarmado = 'N', chofer = 0, vehiculo = 0, transporte = 0, mensaje_mmcall = NULL, mensaje = NULL, fecha_recibo = NULL, des_monitorear = 'N', des_estimado = 0, estimado = 0, monitorear = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, desde = NULL, hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL, fecha_asignacion = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "Se ha regresado el disposivo al estado DISPONIBLE";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.volver();
        })
      }
    })
  }

  finalizar(id: number)
  {
    const respuesta = this.dialogo.open(OpcionesComponent, {
      width: "300px", panelClass: 'dialogo', data: { titulo: "Dispositivo en descarga", tiempo: 0, mensaje: "Placas: <strong>" + this.registros[this.indiceActual].placa + "</strong><br>Chofer: <strong>" + this.registros[this.indiceActual].nchofer + "</strong><br><br><strong>¿Qué desea hacer?</strong>", alto: "60", opciones: 2, accion: 0, botones: 2, boton1STR: "Finalizar la ruta", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_sensor" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "320px", panelClass: 'dialogo_atencion', data: { titulo: "FINALIZAR JORNADA", tiempo: 0, mensaje: "Esta acción finalizará la descarga actual y el dispositivo pasará al estado <strong>FINALIZADO</strong> listo para ser asignado a otro vehículo. <br><br><strong>¿Desea continuar?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 40, origen = 0, destino = 0, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, " + (this.pagerActual > 0 ? "desde = NOW(), carga = 0, " : "") + "hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".movimientos_det SET des_fin = NOW(), des_tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), des_inicio)), usuario_finaliza = " + this.servicio.rUsuario().id + ", estatus = 2 WHERE requester = " + +id + " AND estado = 0 AND estatus = 1;UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "El tacto se finalizó, el dispositivo pasó al estado de FINALIZADO";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.ultimoRegistro(); 
              this.registros.splice(this.indiceActual, 1);
              
              this.arreTiempos.length = this.registros.length;
              this.cadTiempos.length = this.registros.length;
              this.contarRegs()
            })
          }
        })
      }
      else if (result.accion == 2) 
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "320px", panelClass: 'dialogo', data: { titulo: "Regresar a EN ESPERA", tiempo: 0, mensaje: "Esta acción finalizará la descarga actual y el dispositivo pasará al estado <strong>EN ESPERA</strong> listo para un próximo tacto en la misma jornada. <br><br><strong>¿Desea continuar?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 10, origen = 0, destino = 0, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, desde = NOW(), hasta = NULL, fecha_asignacion = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".movimientos_det SET des_fin = NOW(), des_tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), des_inicio)), usuario_finaliza = " + this.servicio.rUsuario().id + ", estatus = 2 WHERE requester = " + +id + " AND estado = 0 AND estatus = 1;UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "El tacto se finalizó, el dispositivo pasó al estado de EN ESPERA";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.ultimoRegistro(); 
              this.registros.splice(this.indiceActual, 1);
              
              this.arreTiempos.length = this.registros.length;
              this.cadTiempos.length = this.registros.length;
              this.contarRegs()
            })
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = "Acción cancelada por el usuario";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
       })
     }
     else if (result.accion == 4) 
     {
       this.modelo = 15;
       this.verTabla = true;
        this.rTactos(id);
     }
    
     else
     {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = "Acción cancelada por el usuario";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
     }
    })
  }

  finalizar2(id: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "560px", panelClass: 'dialogo', data: { titulo: "Finalizar tacto" + (this.pagerActual == 0 ? " de dispositivo temporal" : ""), tiempo: 0, mensaje: "Esta acción terminará el tacto pendiente y convertirá al dispositivo al estado DISPONIBLE O EN ESPERA según el caso<br><br><strong>¿Qué desea hacer?</strong>", alto: "60", id: 0, accion: 0, botones: 3, boton1STR: "FINALIZAR", icono1: "in_seleccionado", boton2STR: "Colocar en ESPERA", icono2: "i_reloj", boton3STR: "Cancelar", icono3: "i_cancelar", icono0: "in_pregunta" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = " + (this.pagerActual > 0 ? "0" : "10") + ", origen = 0, destino = 0, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, " + (this.pagerActual > 0 ? "desde = NULL, chofer = 0, transporte = 0, vehiculo = 0, carga = 0, " : "") + "hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL, fecha_asignacion = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "El tacto se finalizó el dispositivo pasó al estado de " + (this.pagerActual > 0 ? "DISPONIBLE" : "EN ESPERA");
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.ultimoRegistro(); 
          this.registros.splice(this.indiceActual, 1);
          
          this.arreTiempos.length = this.registros.length;
          this.cadTiempos.length = this.registros.length;
          this.contarRegs()
        })
      }
      else if (result.accion == 2) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 10, origen = 0, destino = 0, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, " + (this.pagerActual > 0 ? "desde = NOW(), carga = 0 " : "") + "hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, fecha_asignacion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "El tacto se finalizó, el dispositivo pasó al estado de EN ESPERA";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.ultimoRegistro(); 
          this.registros.splice(this.indiceActual, 1);
          
          this.arreTiempos.length = this.registros.length;
          this.cadTiempos.length = this.registros.length;
          this.contarRegs()
        })
      }
    })
  }


  cambiar(id: number)
  {
    const respuesta = this.dialogo.open(OpcionesComponent, {
      width: "300px", panelClass: 'dialogo', data: { titulo: "Dispositivo en tránsito", tiempo: 0, mensaje: "Placas: <strong>" + this.registros[this.indiceActual].placa + "</strong><br>Chofer: <strong>" + this.registros[this.indiceActual].nchofer + "</strong><br><br><strong>¿Qué desea hacer?</strong>", alto: "60", opciones: 1, accion: 0, botones: 2, boton1STR: "Continuar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_sensor" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "340px", panelClass: 'dialogo', data: { titulo: "Iniciar la descarga", tiempo: 0, mensaje: "Esta acción finalizará el tiempo de traslado y pasará al dispositivo al estado <strong>DESCARGANDO</strong>. iniciando así su tiempo de descarga.<br><br><strong>¿Desea inicar la descarga?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "A descarga", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 30, desde = NOW(), hasta = NULL, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".movimientos_det SET fin = NOW(), usuario_inicia_descarga = " + this.servicio.rUsuario().id + ", tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), inicio)), des_inicio = NOW(), estatus = 1 WHERE requester = " + +id + " AND estado = 0 AND estatus = 0;UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "El traslado finaliza e inicia la descarga";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.ultimoRegistro(); 
              this.registros.splice(this.indiceActual, 1);
              
              this.arreTiempos.length = this.registros.length;
              this.cadTiempos.length = this.registros.length;
              this.contarRegs()
            })
          }
        })
      }
      else if (result.accion == 2) 
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "340px", panelClass: 'dialogo', data: { titulo: "Volver disponible", tiempo: 0, mensaje: "Esta acción cancelará el tacto pendiente y convertirá al dispositivo al estado DISPONIBLE. <br><br><strong>¿Desea regresar el dispositivo a disponible?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "A disponible", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
          if (result.accion == 1) 
          {
            let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 0, alarmas = 0, usuario_asigna = 0, orden = 0, viajes = 0, origen = 0, destino = 0, alarmado = 'N', chofer = 0, vehiculo = 0, transporte = 0, mensaje_mmcall = NULL, mensaje = NULL, fecha_recibo = NULL, des_monitorear = 'N', des_estimado = 0, estimado = 0, monitorear = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, desde = NULL, hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL, fecha_asignacion = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".movimientos_det SET fin = NOW(), tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), inicio)), estatus = 9, usuario_cancela = " + this.servicio.rUsuario().id + " WHERE requester = " + +id + " AND estado = 0 AND estatus = 0;UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
            let campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "Se ha regresado el disposivo al estado DISPONIBLE";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.volver();
            })
          }
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = "Acción cancelada por el usuario";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
       })
     }
     else if (result.accion == 4) 
     {
       this.modelo = 15;
       this.verTabla = true;
        this.rTactos(id);
     }
     else
     {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = "Acción cancelada por el usuario";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
     }
    })
  }



  reanudar(id: number)
  {
    const respuesta = this.dialogo.open(OpcionesComponent, {
      width: "300px", panelClass: 'dialogo', data: { titulo: "Dispositivo FINALIZADO", tiempo: 0, mensaje: "Placas: <strong>" + this.registros[this.indiceActual].placa + "</strong><br>Chofer: <strong>" + this.registros[this.indiceActual].nchofer + "</strong><br><br><strong>¿Qué desea hacer?</strong>", alto: "60", opciones: 4, accion: 0, botones: 2, boton1STR: "Continuar sin monitorear", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_sensor" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "320px", panelClass: 'dialogo_atencion', data: { titulo: "Enviar a DISPONIBLE", tiempo: 0, mensaje: "Esta acción cambiará al dispositivo al estado de <strong>DISPONIBLE</strong> listo para ser asignado a otro vehículo.<br><br><strong>¿Desea continuar?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {
          let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 0, alarmas = 0, orden = 0, viajes = 0, origen = 0, destino = 0, alarmado = 'N', chofer = 0, vehiculo = 0, transporte = 0, mensaje_mmcall = NULL, mensaje = NULL, fecha_recibo = NULL, des_monitorear = 'N', des_estimado = 0, estimado = 0, monitorear = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, desde = NULL, hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL, fecha_asignacion = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".movimientos_det SET estado = 10 WHERE requester = " + +id + " AND estado = 0;UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
          let campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = "El traslado finaliza e inicia la descarga";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.ultimoRegistro(); 
            this.registros.splice(this.indiceActual, 1);
            
            this.arreTiempos.length = this.registros.length;
            this.cadTiempos.length = this.registros.length;
            this.contarRegs()
          })
        }
      })
    }
      else if (result.accion == 2) 
      {
        const respuesta = this.dialogo.open(DialogoComponent, {
          width: "320px", panelClass: 'dialogo_atencion', data: { titulo: "Enviar a ESPERA", tiempo: 0, mensaje: "Esta acción cambiará al dispositivo al estado de <strong>EN ESPERA</strong>  para que se le asigne un próximo tacto.<br><br><strong>¿Desea continuar?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_pregunta", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "", icono3: "", icono0: "in_pregunta" }
        });
        respuesta.afterClosed().subscribe(result => {
        if (result.accion == 1) 
        {
          let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 10, desde = NOW(), hasta = NULL, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, fecha_asignacion = NULL, espera_temporal = 0, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
          let campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-normal";
            mensajeCompleto.mensaje = "El traslado finaliza e inicia la descarga";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.ultimoRegistro(); 
            this.registros.splice(this.indiceActual, 1);
            
            this.arreTiempos.length = this.registros.length;
            this.cadTiempos.length = this.registros.length;
            this.contarRegs()
          })
        }
      })
    }
     else if (result.accion == 4) 
     {
       this.modelo = 15;
       this.verTabla = true;
        this.rTactos(this.reqActual);
     }
     else
     {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = "Acción cancelada por el usuario";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
     }
    })
    this.valTactos = false;
  }




  asignacion(id: number)
  {
    const respuesta = this.dialogo.open(OpcionesComponent, {
      width: "300px", panelClass: 'dialogo', data: { titulo: "Dispositivo en espera", tiempo: 0, mensaje: "Placas: <strong>" + this.registros[id].placa + "</strong><br>Chofer: <strong>" + this.registros[id].nchofer + "</strong><br><br><strong>¿Qué desea hacer?</strong>", alto: "60", opciones: 3, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", boton3STR: "Volver a la edición", icono3: "i_edicion", icono0: "i_sensor" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 0, alarmas = 0, orden = 0, viajes = 0, origen = 0, destino = 0, alarmado = 'N', chofer = 0, vehiculo = 0, transporte = 0, mensaje_mmcall = NULL, mensaje = NULL, fecha_recibo = NULL, des_monitorear = 'N', des_estimado = 0, estimado = 0, monitorear = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, desde = NULL, hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL, fecha_asignacion = NULL WHERE id = " + +this.reqActual + ";UPDATE " + this.servicio.rBD() + ".movimientos_det SET estado = 10 WHERE requester = " + +this.reqActual + " AND estado = 0;UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "El dispositivo cambió al estado DISPONIBLE";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.ultimoRegistro(); 
          this.registros.splice(this.indiceActual, 1);
          
          this.arreTiempos.length = this.registros.length;
          this.cadTiempos.length = this.registros.length;
          this.contarRegs()
          
        })
      }
      else if (result.accion == 2) 
      {
        this.valTactos=true;
        this.editar(id);
     }
     else if (result.accion == 4) 
     {
       this.modelo = 15;
       this.verTabla = true;
        this.rTactos(this.reqActual);
     }
     else
     {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = "Acción cancelada por el usuario";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
     }
    })
    this.valTactos = false;
  }

  cambiar2(id: number)
  {


    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "570px", panelClass: 'dialogo', data: { titulo: "Acción en dispositivo en tránsito", tiempo: 0, mensaje: "El dispositvo se encuentra en el estado de TRANSITO. <br><br><strong>¿Qué desea hacer?</strong>", alto: "60", id: 0, accion: 0, botones: 3, boton1STR: "Iniciar descarga", icono1: "in_seleccionado", boton2STR: (this.pagerActual > 0 ? "Mover a disponible" : "Eliminar temporal"), icono2: (this.pagerActual > 0 ? "in_pregunta" : "i_eliminar"), boton3STR: "Cancelar", icono3: "i_cancelar", icono0: "in_pregunta" }
    });
    respuesta.afterClosed().subscribe(result => {
      if (result.accion == 1) 
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 30, desde = NOW(), hasta = NULL, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "El dispositivo cambió al estado de DESCARGANDO";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.ultimoRegistro(); 
          this.registros.splice(this.indiceActual, 1);
          
          this.arreTiempos.length = this.registros.length;
          this.cadTiempos.length = this.registros.length;
          this.contarRegs()
          
        })
      }
      else if  (result.accion == 2) 
      {
        if (this.pagerActual == 0)
        {
          this.eliminarT(id)
          return;
        }
        let sentencia = "UPDATE " + this.servicio.rBD() + ".requesters SET estado = 0, origen = 0, destino = 0, alarmado = 'N', alarmado_desde = NULL, fecha_recibo = NULL, espera_temporal = 0, desde = NULL, hasta = NULL, repeticiones = 0, repeticiones_audio = 0, ultima_repeticion = NULL, ultima_repeticion_audio = NULL WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "Se ha regresado el disposivo al estado DISPONIBLE";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          this.ultimoRegistro(); 
          this.registros.splice(this.indiceActual, 1);
          
          this.arreTiempos.length = this.registros.length;
          this.cadTiempos.length = this.registros.length;
          this.contarRegs()
        })
      }
    })
  }

  eliminarT(id: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo', data: { titulo: "Eliminar dispositivo temporal", tiempo: 0, mensaje: "Esta acción eliminará permanentemente el dispositivo temporal del sistema y y en caso de un nuevo tacto, deberá registrarlo de nuevo.<br><br><strong>¿Qué desea hacer?</strong>", alto: "60", id: 0, accion: 0, botones: 2, boton1STR: "Eliminarlo", icono1: "in_seleccionado", boton2STR: "Canlcelar", icono2: "i_cancelar", boton3STR: "Cancelar", icono3: "i_cancelar", icono0: "in_pregunta" }
    });
    respuesta.afterClosed().subscribe(result => {
    if (result.accion == 1) 
    {
      let sentencia = "DELETE FROM " + this.servicio.rBD() + ".requesters WHERE id = " + +id + ";UPDATE " + this.servicio.rBD() + ".actualizaciones SET dispositivos = NOW();";
      let campos = {accion: 200, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "El dispositivo temporal ha sido eliminado de la aplicación";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        if (this.modelo == 4)
        {
          this.volver()
          return;
        }
        this.ultimoRegistro(); 
        this.registros.splice(this.indiceActual, 1);
        
        this.arreTiempos.length = this.registros.length;
        this.cadTiempos.length = this.registros.length;
        this.contarRegs()
        
      })
    }
  })
}

  asignar()
  {
    let mensajeCompleto: any = [];
    mensajeCompleto.clase = "snack-normal";
    mensajeCompleto.mensaje = "Proceda a cambiar los campos deseados";
    mensajeCompleto.tiempo = 2000;
    this.servicio.mensajeToast.emit(mensajeCompleto);
    this.asignando = true;
    setTimeout(() => {
      this.txtNombre.nativeElement.focus();
  }, 300);
  }

  validarPager()
  {
    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".requesters WHERE movil = '" + this.detalle.referencia + "' AND pager = 0";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.detalle.id = resp[0].id
        this.procesoGuardar = 3;
        this.existePager = resp.length > 0;
        this.guardar()
      }
      else
      {
        sentencia = "INSERT INTO " + this.servicio.rBD() + ".requesters (movil, tipo) VALUES ('" + this.detalle.referencia + "', 1);";
        let campos = {accion: 200, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          this.validarPager()
        })
      }
    })
  }
  
  ultimoRegistro()
  {
    if (this.registros.length == 1)
    {
      this.verSR = false
      this.leeBD = setTimeout(() => {
        this.verSR = true
      }, 500);
    }
  }

  rTactos(id: number) 
  {
    this.animando = false;
    let sentencia = "SELECT a.id, a.viaje, a.estatus AS idest, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, CASE WHEN a.estatus = 0 THEN 'i_reloj' WHEN a.estatus = 1 THEN 'i_documento' WHEN a.estatus = 2 THEN 'in_seleccionado' WHEN a.estatus = 9 THEN 'i_eliminar' END AS icono, SEC_TO_TIME(a.estimado) AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.alarmado, a.des_alarmado, a.des_inicio, a.des_fin, TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio) AS tiempo, TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio) AS des_tiempo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE a.requester = " + id + " AND a.estado = 0 ORDER BY a.viaje DESC"; 
    this.sentenciaR = "SELECT 'Placas', 'ID', 'Tacto', 'Estatus del tacto', 'Origen', 'Destino', 'Inicio del traslado', 'Fin del traslado', 'Tiempo estimado de traslado (seg)', 'Tiempo real del traslado (seg)', 'Se alarmó el tiempo de traslado?', 'Inicio de la descarga', 'Fin de la  descarga', 'Tiempo estimado de la descarga (seg)', 'Tiempo real de la descarga (seg)', 'Tiempo de espera (seg)', 'Se alarmo la descarga?', 'Transporte', 'Nombre del chofer', 'Tipo de Carga', 'Tipo de vehiculo' UNION ALL SELECT c.nombre, a.id, a.viaje, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio)) AS tiempo, a.alarmado, a.des_inicio, a.des_fin, a.des_estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio)) AS des_tiempo, a.espera, a.des_alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(i.nombre, 'N/A') AS ncarga, IFNULL(j.nombre, 'N/A') AS ntipo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales j ON c.tipo = j.id WHERE a.requester = " + id + " AND a.estado = 0"; 
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.datostransporte = resp[0];
      }
      else
      {
        this.datostransporte = {nombre: '', ntransporte: '', nchofer: '', ncarga: ''};
      }
       
      this.historias = resp;
      this.arreTiempos2.length = resp.length;
      this.arreTiempos3.length = resp.length;
      this.revisarTiempo();
      
      let cadAlarmas: string = "";
      {
        this.alarmados = 0;
        for (var i = 0; i < this.historias.length; i++)
        {
          if (this.historias[i].alarmado == 'S')
          {
            this.alarmados = this.alarmados + 1
          }
        }
        if (this.alarmados > 0)
        {
            cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? "uno alarmado" : this.alarmados + " alarmados") + "</span>";  
        }
      }

      let mensaje = this.historias.length + " tacto(s) " + cadAlarmas
      this.servicio.mensajeInferior.emit(mensaje);          


      setTimeout(() => {
        this.animando = true;
      }, 100);
    })
  }

  buscarDestinos(id: number)
  {
    let sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_destinos WHERE inicial = 'S' AND estatus = 'A'";
    if (id == 2)
    {
      sentencia = "SELECT id FROM " + this.servicio.rBD() + ".cat_destinos WHERE final = 'S' AND estatus = 'A'";
    }
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (id == 1)
      {
        this.detalle.origen = resp.length > 0 ? resp[0].id : 0;
      }
      else if (id == 2)
      {
        this.detalle.origen = resp.length > 0 ? resp[0].id : 0;
      }
    })
  }

  filtrando2(indice: number, evento: any)
  {
    if (indice==1)
    {
      let miCad = "";
      if (evento.target)
      {
        miCad = evento.target.value;
      }
      else
      {
        miCad = evento;
      }
      if (this.cadenaAntes != miCad )
      {
        this.cadenaAntes = miCad;
        setTimeout(() => {
          this.filtrando2(1, this.cadenaAntes);
        }, 300);
        return;
      }
      this.placasFiltradas = [];
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad.length > 1) 
      {
        for (var i = 0; i < this.placas.length; i  ++)
        {
          if (this.placas[i].nombre)
          {
            if (this.placas[i].nombre.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
            {
              this.placasFiltradas.splice(this.placasFiltradas.length, 0, this.placas[i]);
            }
          }
        }
      }
      else
      {
        this.placasFiltradas = [];//this.placas;
      }
      this.servicio.activarSpinnerSmall.emit(false);
    }
    else if (indice==2)
    {
      let miCad = "";
      if (evento.target)
      {
        miCad = evento.target.value;
      }
      else
      {
        miCad = evento;
      }
      if (this.cadenaAntes != miCad )
      {
        this.cadenaAntes = miCad;
        setTimeout(() => {
          this.filtrando2(2, this.cadenaAntes);
        }, 300);
        return;
      }
      this.choferesFiltradas = [];
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad.length > 1) 
      {
        for (var i = 0; i < this.choferes.length; i  ++)
        {
          if (this.choferes[i].nombre)
          {
            if (this.choferes[i].nombre.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
            {
              this.choferesFiltradas.splice(this.choferesFiltradas.length, 0, this.choferes[i]);
            }
          }
        }
      }
      else
      {
        this.choferesFiltradas = [];//this.placas;
      }
      this.servicio.activarSpinnerSmall.emit(false);
    }
    else if (indice==3)
    {
      let miCad = "";
      if (evento.target)
      {
        miCad = evento.target.value;
      }
      else
      {
        miCad = evento;
      }
      if (this.cadenaAntes != miCad )
      {
        this.cadenaAntes = miCad;
        setTimeout(() => {
          this.filtrando2(3, this.cadenaAntes);
        }, 300);
        return;
      }
      this.transportesFiltradas = [];
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad.length > 1) 
      {
        for (var i = 0; i < this.transportes.length; i  ++)
        {
          if (this.transportes[i].nombre)
          {
            if (this.transportes[i].nombre.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
            {
              this.transportesFiltradas.splice(this.transportesFiltradas.length, 0, this.transportes[i]);
            }
          }
        }
      }
      else
      {
        this.transportesFiltradas = [];//this.placas;
      }
      this.servicio.activarSpinnerSmall.emit(false);
    }
    else if (indice==4)
    {
      let miCad = "";
      if (evento.target)
      {
        miCad = evento.target.value;
      }
      else
      {
        miCad = evento;
      }
      if (this.cadenaAntes != miCad )
      {
        this.cadenaAntes = miCad;
        setTimeout(() => {
          this.filtrando2(4, this.cadenaAntes);
        }, 300);
        return;
      }
      this.referenciasFiltradas = [];
      this.servicio.activarSpinnerSmall.emit(true);
      if (miCad.length > 1) 
      {
        for (var i = 0; i < this.referencias.length; i  ++)
        {
          if (this.referencias[i].nombre)
          {
            if (this.referencias[i].nombre.toLowerCase().indexOf(miCad.toLowerCase()) !== -1)
            {
              this.referenciasFiltradas.splice(this.referenciasFiltradas.length, 0, this.referencias[i]);
            }
          }
        }
      }
      else
      {
        this.referenciasFiltradas = [];//this.placas;
      }
      this.servicio.activarSpinnerSmall.emit(false);
    }
  }
  

  rPlacas()
  {
    this.placas = [];
    let sentencia = "SELECT a.id, a.nombre FROM " + this.servicio.rBD() + ".cat_vehiculos a WHERE a.estatus = 'A' ORDER BY a.nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.placas = resp;
        
    })
  }

  rTransportes()
  {
    this.transportes = [];
    let sentencia = "SELECT a.id, a.nombre FROM " + this.servicio.rBD() + ".cat_transportes a WHERE a.estatus = 'A' ORDER BY a.nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.transportes = resp;
        
    })
  }


  rReferencias()
  {
    this.referencias = [];
    let sentencia = "SELECT a.id, a.nombre FROM " + this.servicio.rBD() + ".cat_choferes a WHERE (referencia <> '' AND NOT ISNULL(referencia))";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.referencias = resp;
        
    })
  }

  rChoferes()
  {
    this.choferes = [];
    let sentencia = "SELECT a.id, a.nombre FROM " + this.servicio.rBD() + ".cat_choferes a WHERE a.estatus = 'A' ORDER BY a.nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        this.choferes = resp;
        
    })
  }


}

