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
import { DxChartComponent } from "devextreme-angular";
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-exportar',
  templateUrl: './exportar.component.html',
  styleUrls: ['./exportar.component.css'],
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

  
export class ExportarComponent implements OnInit {

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
  @ViewChild("listaTurnos", { static: false }) listaTurnos: MatSelectionList;
  @ViewChild("listaPartes", { static: false }) listaPartes: MatSelectionList;
  @ViewChild("listaLotes", { static: false }) listaLotes: MatSelectionList;
  @ViewChild("listaProcesos", { static: false }) listaProcesos: MatSelectionList;
  
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
    public datepipe: DatePipe,
    private viewportRuler: ViewportRuler
  ) {

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

    this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion == 22)
      {
        this.verTop = true;
        this.modelo = 11;
        this.servicio.mensajeInferior.emit("Exportar datos");   
      }
      else if (accion == 23)
      {
        this.verTop = false;
        this.listarAlarmas()
        this.modelo = 13;
        this.iniLeerBD()
      }
      this.servicio.mostrarBmenu.emit(0);
    });
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 9) == "/exportar")
      {
        this.revisarTiempo();
      }
    });
    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    this.rConfiguracion();
    this.aplicarConsulta(0);
    
    if (this.servicio.rVista() == 23)
      {
        this.listarAlarmas()
        this.modelo = 3;
        this.iniLeerBD()
        this.verTop = false;
      }
      else
      {
        this.verTop = true;
      }
  }

  ngOnInit() {
    this.servicio.validarLicencia(1)
    this.servicio.mostrarBmenu.emit(0);
  }

  verTop: boolean = true;
  yaConfirmado: boolean = false;
  modelo: number  = 1;
  offSet: number;
  verIrArriba: boolean = false;
  filtrarC: boolean = false;
  hayFiltro: boolean = false
  eliminar: boolean = false;
  editando: boolean = false;
  graficando: boolean = true;
  verBuscar: boolean = true;
  verTabla: boolean = false;
  cambioVista: boolean = true;
  movil: boolean = false;
  parIndicador: string = "1.0-1"
  verGrafico: boolean = false;
  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  nCatalogo: string = "LÍNEAS DE PRODUCCIÓN"
  verBarra: string = "";
  ultimoReporte: string = "";
  nombreFile: string = "";
  ultimoID: number = 0;
  copiandoDesde: number = 0;
  selLineasT: string = "S";
  selMaquinasT: string = "S";
  selAreasT: string = "S";
  selTecnicosT: string = "S";
  selTurnosT: string = "S";
  selPartesT: string = "S";
  selLotesT: string = "S";
  selFallasT: string = "S";
  selProcesosT: string = "S";
  textoBuscar: string = "";
  fDesde: string = "";
  fHasta: string = "";
  
  miGrafica: any = [];
  tecnicos: any = [];
  partes: any = [];
  turnos: any = [];
  lotes: any = [];
  procesos: any = [];
  arreTiempos: any = [];
  consultas: any = [];
  maquinas: any = [];
  parGrafica: any = [];
  sentenciaR: string = "";
  reporteActual: string = "";
  reporteSel: number = 1;
  
  ultimaActualizacion = new Date();
  errorTitulo: string = "Ocurrió un error durante la conexión al servidor";
  errorMensaje: string = "";
  pantalla: number = 2;  
  miSeleccion: number = 1;
  iconoGeneral: string = "i_alarmas";
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
  nombreReporte: string = "";
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
  faltaMensaje: string = "";
  responsableSel: boolean = false;
  fallaSel: boolean = false;
  rAlarmado: string = "N";
  horaReporte;
  mensajePadre: string = "";
  filtroReportes: string = "";
  URL_BASE = "/logisticar/api/upload.php"
  URL_IMAGENES = "/assets/imagenes/";
  mostrarDetalle: boolean = false;
  grActual: number = +this.servicio.rUsuario().preferencias_andon.substr(41, 1);

  ayuda01 = ""

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

  consultaTemp: string = "0";
  consultaBuscada: boolean = false;
  

  guardarSel: boolean = true;
  bot1Sel: boolean = false;
  bot2Sel: boolean = false;
  bot3Sel: boolean = false;
  bot4Sel: boolean = false;
  bot5Sel: boolean = false;
  bot6Sel: boolean = false;
  bot7Sel: boolean = false;

  maxmin: {startValue: "0", endValue: 20};

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
      this.modelo = this.modelo - 10;
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

  descargarInfo()
  {
    this.nombreReporte = "Reporte de tactos"
    this.reporteActual = "reporte_de_tactos"
    let sentencia = "SELECT COUNT(a.id) AS cuenta FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos b ON a.vehiculo = b.id WHERE inicio >= '" + this.fDesde + "' AND inicio <= '" + this.fHasta + "' " + this.filtroReportes + " ";
    if (this.reporteSel==2)
    {
      this.nombreReporte = "LOG de eventos"
      this.reporteActual = "log_eventos"
      sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".log WHERE fecha >= '" + this.fDesde + "' AND fecha <= '" + this.fHasta + "'"
    }
    else if (this.reporteSel==3)
    {
      this.nombreReporte = "Todas las alarmas"
      this.reporteActual = "todas_las_alarmas"
      sentencia = "SELECT COUNT(*) AS cuenta FROM " + this.servicio.rBD() + ".alarmas a WHERE inicio >= '" + this.fDesde + "' AND inicio <= '" + this.fHasta + "' "
    }
     if (this.modelo == 3 || this.modelo == 13)
    {
      this.nombreReporte = "Alarmas activas"
      this.reporteActual = "alarmas_activas"
      sentencia = "SELECT COUNT(id) AS cuenta FROM " + this.servicio.rBD() + ".alarmas WHERE ISNULL(fin);";
    }
   

    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length == 0)
      {
        this.miGrafica = [];
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "No hay datos para exportar";
        mensajeCompleto.tiempo = 1000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      else if (resp[0].cuenta == 0)
      {
        this.miGrafica = [];
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "No hay datos para exportar";
        mensajeCompleto.tiempo = 1000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      else
        {
          this.sentenciaR = "SELECT 'Placas', 'ID', 'Tacto', 'Estatus del tacto', 'Origen', 'Destino', 'Inicio del traslado', 'Fin del traslado', 'Tiempo estimado de traslado (seg)', 'Tiempo real del traslado (seg)', 'Se alarmó el tiempo de traslado?', 'Inicio de la descarga', 'Fin de la  descarga', 'Tiempo estimado de la descarga (seg)', 'Tiempo real de la descarga (seg)', 'Se alarmo la descarga?', 'Tiempo Efectivo traslado+descarga (seg)', 'Tiempo de espera (seg)', 'Eficiencia (%)', 'Transporte', 'Nombre del chofer', 'Tipo de Carga', 'Tipo de vehiculo', 'ID Pager', 'Nombre del pager', 'Usuario que asignó el beeper', 'Usuario que inició el viaje', 'Usuario que inició la descarga', 'Usuario que finalizó la descarga', 'Usuario que canceló (si aplica)' UNION ALL SELECT b.nombre, a.id, a.viaje, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio)) AS tiempo, a.alarmado, a.des_inicio, a.des_fin, a.des_estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio)) AS des_tiempo, a.des_alarmado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio)) + TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio)), a.espera, (a.des_tiempo + a.tiempo) / (a.des_tiempo + a.tiempo + a.espera) * 100, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(i.nombre, 'N/A') AS ncarga, IFNULL(j.nombre, 'N/A') AS ntipo, IFNULL(z.pager, ''), IFNULL(z.nombre, 'N/A'), IFNULL(y.nombre, 'N/A'), IFNULL(x.nombre, 'N/A'), IFNULL(w.nombre, 'N/A'), IFNULL(v.nombre, 'N/A'), IFNULL(u.nombre, 'N/A') FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos b ON a.vehiculo = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".requesters z ON a.requester = z.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios y ON a.usuario_asigna = y.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios x ON a.usuario_envia_transito = x.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios w ON a.usuario_inicia_descarga = w.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios v ON a.usuario_finaliza = v.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios u ON a.usuario_cancela = u.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON a.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.carga = i.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales j ON b.tipo = j.id WHERE inicio >= '" + this.fDesde + "' AND inicio <= '" + this.fHasta + "' " + this.filtroReportes + "  "
          if (this.reporteSel==2)
          {
            this.sentenciaR = "SELECT 'ID', 'Fecha', 'Aplicacion', 'Tipo', 'Nro de reporte', 'Mensaje' UNION SELECT id, fecha, CASE WHEN aplicacion = 20 THEN 'MMCALL' WHEN aplicacion = 30 THEN 'INTERFAZ TELEFONICA' WHEN aplicacion = 40 THEN 'ENVIO DE CORREOS' WHEN aplicacion = 50 THEN 'ENVIO DE SMS' WHEN aplicacion = 60 THEN 'LOG DE EVENTOS' WHEN aplicacion = 70 THEN 'GENERACION DE AUDIOS' WHEN aplicacion = 80 THEN 'REPORTES AUTOMATICOS' ELSE 'MONITOR DE EVENTOS' END, CASE WHEN tipo = 0 THEN 'INFORMACION' WHEN tipo = 2 THEN 'ADVERTENCIA' WHEN tipo = 9 THEN 'ERROR' ELSE 'OTRO' END, proceso, texto FROM " + this.servicio.rBD() + ".log WHERE fecha >= '" + this.fDesde + "' AND fecha <= '" + this.fHasta + "' ";
          }
          else if (this.reporteSel==3)
          {
            this.sentenciaR = "SELECT 'No del requester alarmado', 'Nombre del requester alarmado', 'Nombre de la alerta', 'Fecha de activacion', 'Fecha de terminación', 'Tiempo transcurrido de la alerta (HH:MM:SS)', 'Placas', 'Transporte asociado', 'Area del beeper', 'Chofer', 'Nivel de escalamiento (1-5)', 'Total repeticiones', 'Usuario que termino la alerta' UNION (SELECT a.proceso, c.nombre, b.nombre, a.inicio, a.fin, IF(ISNULL(a.fin), TIMEDIFF(NOW(), a.inicio), SEC_TO_TIME(tiempo)), IFNULL(e.nombre, 'N/A'), IFNULL(g.nombre, 'N/A'), IFNULL(d.nombre, 'N/A'), IFNULL(f.nombre, 'N/A'), IF(a.fase - 10 < 0, 'N/A', a.fase - 10), a.repeticiones, IFNULL(g.nombre, 'N/A'),  FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".requesters c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes g ON c.transporte = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos e ON c.vehiculo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes f ON c.chofer = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_usuarios g ON c.termino = g.id WHERE a.inicio >= '" + this.fDesde + "' AND a.inicio <= '" + this.fHasta + "') ";
            
          }
          if (this.modelo == 3 || this.modelo == 13)
          {
            this.sentenciaR = "SELECT 'No del requester alarmado', 'Nombre del requester alarmado', 'Nombre de la alerta', 'Fecha de activacion', 'Fecha de terminación', 'Tiempo transcurrido de la alerta (HH:MM:SS)', 'Placas', 'Transporte asociado', 'Area del beeper', 'Chofer', 'Nivel de escalamiento (1-5)', 'Total repeticiones' UNION (SELECT a.proceso, c.nombre, b.nombre, a.inicio, a.fin, IF(ISNULL(a.fin), TIMEDIFF(NOW(), a.inicio), SEC_TO_TIME(tiempo)), IFNULL(e.nombre, 'N/A'), IFNULL(g.nombre, 'N/A'), IFNULL(d.nombre, 'N/A'), IFNULL(f.nombre, 'N/A'), IF(a.fase - 10 < 0, 'N/A', a.fase - 10), a.repeticiones FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".requesters c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes g ON c.transporte = g.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos e ON c.vehiculo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes f ON c.chofer = f.id WHERE ISNULL(a.fin) ORDER BY 3);";
          }
          
            this.exportar()
        }
    })
  }

  
  selectionChange(event){
    console.log('selection changed using keyboard arrow');
  }

  
  exportar()
  {
    
    let campos = {accion: 100, sentencia: this.sentenciaR};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp. length > 0)
      {
        this.servicio.generarReporte(resp, this.nombreReporte, this.reporteActual + ".csv")
      }
    })
  }

  siguienteInactivar(id: number)
  {
    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "500px", panelClass: 'dialogo_atencion', data: { titulo: "TERMINAR ALARMA", tiempo: 0, mensaje: "Esta acción terminará la alarma del requester <strong>" + this.registros[id].proceso + "</strong> de manera permanente y de estar configurado, se enviarán mensajes de resolución a todos los involucrados en la alarma.<br><br><strong>¿Desea continuar con la operación?</strong>", id: 0, accion: 0, botones: 2, boton1STR: "Terminar la alarma", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_alarmas" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {
          let sentencia = "SELECT a.*, c.informar_resolucion, c.evento FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".cat_alertas c ON a.alerta = c.id WHERE a.id = " + this.registros[id].id;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".alarmas SET estatus = 9, fin = NOW(), tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), inicio))" + (resp[0].informar_resolucion == "S" ? ", informado = 'S'" : "") + ", termino = " + this.servicio.rUsuario().id + " WHERE id = " + this.registros[id].id + ";UPDATE " + this.servicio.rBD() + ".mensajes SET estatus = 'Z' where alarma = " + this.registros[id].id;
            if (resp[0].informar_resolucion == "S")
            {
              sentencia = sentencia + ";INSERT INTO " + this.servicio.rBD() + ".mensajes (alerta, canal, tipo, proceso, alarma, lista) SELECT a.alerta, b.canal, 7, a.proceso, a.id, b.lista FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".mensajes b ON a.id = b.alarma WHERE a.id = " + this.registros[id].id + " AND a.estatus = 9  GROUP BY a.alerta, b.canal, a.proceso, a.id, b.lista";
            }
            campos = {accion: 200, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe( resp =>
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-normal";
              mensajeCompleto.mensaje = "La alarma del reporte número: <strong>" + this.registros[id].proceso + "</strong> ha sido terminada";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
              this.registros.splice(id, 1);
              this.contarRegs(); 
              this.noLeer = false;   
            })
          });
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "Se cancela la terminación de la alarma";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "Se cancela la terminación de la alarma";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  inactivar(id: number)
  {

  let rolBuscar = "A";
  if (this.servicio.rUsuario().rol == rolBuscar)
  {
    this.siguienteInactivar(id);
  }
  else
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + this.servicio.rUsuario().id + " AND opcion = 30";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0) 
      {
        this.siguienteInactivar(id);
      }
      else
      {
        const respuesta = this.dialogo.open(SesionComponent, 
        {
          width: "400px", panelClass: 'dialogo', data: { tiempo: 10, sesion: 1, rolBuscar: rolBuscar, opcionSel: 30, idUsuario: 0, usuario: "", clave: "", titulo: "Se requiere perfil ADMINISTRADOR", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_sesion" }
        });
        respuesta.afterClosed().subscribe(result => 
        {

          if (result)
          {
            if (result.accion == 1) 
            {
              this.siguienteInactivar(id);
            }
            else
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = "Inicio de sesión cancelado";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = "Inicio de sesión cancelado";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }

          })
        }
      })
    }
  }

  cancelarTodas()
  {
  
  this.yaConfirmado = false;
  let rolBuscar = "A";
  if (this.servicio.rUsuario().rol == rolBuscar)
  {
    this.siguienteCancelar();
  }
  else
  {
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + this.servicio.rUsuario().id + " AND opcion = 30";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0) 
      {
        this.siguienteCancelar();
      }
      else
      {
        const respuesta = this.dialogo.open(SesionComponent, 
        {
          width: "400px", panelClass: 'dialogo', data: { tiempo: 10, sesion: 1, rolBuscar: rolBuscar, opcionSel: 30, idUsuario: 0, usuario: "", clave: "", titulo: "Se requiere perfil ADMINISTRADOR", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_sesion" }
        });
        respuesta.afterClosed().subscribe(result => 
        {

          if (result)
          {
            if (result.accion == 1) 
            {
              this.yaConfirmado = true;
              this.siguienteCancelar();
            }
            else
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = "Inicio de sesión cancelado";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = "Inicio de sesión cancelado";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }

          })
        }
      })
    }
  }


  //Desde aqui
  

filtrar()
{
  this.listarConsultas()
  this.filtrando = true;
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
  this.listarProcesos();
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
      this.detalle.filtrotur = "S";
      this.detalle.filtronpar = "S";
      this.detalle.filtroord = "S";
      this.detalle.filtrooper = "S";
      
    }
    this.consultaBuscada = false;
    
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
  this.modelo = 11;
  this.graficando = true;
  this.filtrando = false;
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

  listarAlarmas()
  {
    let sentencia = "SELECT a.*, b.evento, NOW() AS hasta, b.nombre, IFNULL(d.nombre, 'N/A') AS narea, IFNULL(e.nombre, 'N/A') AS placa, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(g.nombre, 'N/A') AS ndestino, '' AS n1, '' AS n2 FROM " + this.servicio.rBD() + ".alarmas a LEFT JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".requesters c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos e ON c.vehiculo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON c.vehiculo = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos g ON c.destino = g.id WHERE ISNULL(fin) ORDER BY inicio;"
    this.registros = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.registros = resp;
      this.arreTiempos.length = resp.length;
      this.revisarTiempo();
      this.contarRegs();
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
            this.detalle.filtrotur = "S";
            this.detalle.filtronpar = "S";
            this.detalle.filtroord = "S";
            this.detalle.filtrooper = "S";
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
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_generales a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 30 AND b.consulta = " + this.consultaTemp + " WHERE a.tabla = 30 ORDER BY a.nombre;"
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

  listarProcesos()
  {
    let sentencia = "SELECT a.id, a.nombre, IF(ISNULL(b.valor), 0, 1) AS seleccionado FROM " + this.servicio.rBD() + ".cat_procesos a LEFT JOIN " + this.servicio.rBD() + ".consultas_det b ON b.valor = a.id AND b.tabla = 90 AND b.consulta = " + this.consultaTemp + " ORDER BY seleccionado DESC, a.nombre;"
    this.procesos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
        setTimeout(() => {
          this.procesos = resp;
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
    
  }

  guardar(id: number)
  {
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
        if (resp[0].periodo == "8")
        {
          desde = new Date(this.datepipe.transform(new Date(resp[0].desde), "yyyy/MM/dd"));
          hasta = new Date(this.datepipe.transform(new Date(resp[0].hasta), "yyyy/MM/dd"));            
        }
        if (resp[0].filtrolin == "N")
        {
          this.filtroReportes = " AND a.transporte IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 10) "
         
        }
        if (resp[0].filtromaq == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND a.vehiculo IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 20) "
          
        }
        if (resp[0].filtroare == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND a.area IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 30) "
          
        }
        if (resp[0].filtrofal == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND b.tipo IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 40) "
        }
        if (resp[0].filtrotec == "N")
        {
          this.filtroReportes = this.filtroReportes + " AND a.carga IN (SELECT valor FROM " + this.servicio.rBD() + ".consultas_det WHERE consulta = " + this.servicio.rConsulta() + " AND tabla = 50) "
        } 
      } 
      else
      {
        let nuevaFecha = this.servicio.fecha(1, '' , "yyyy/MM") + "/01";         
        desde = new Date(nuevaFecha);
      }
      this.fHasta = this.datepipe.transform(hasta, "yyyy/MM/dd") + " 23:59:59";
      this.fDesde = this.datepipe.transform(desde, "yyyy/MM/dd") + " 00:00:00";  
      this.exportar();
    })
  }
     
  
  revisarTiempo()
  {
    if (this.modelo == 13 || this.modelo == 3)
    {
      this.contarTiempo = false;
      for (var i = 0; i < this.registros.length; i++)
      {
        let segundos =  this.servicio.tiempoTranscurrido(this.registros[i].inicio, "").split(";");
        this.arreTiempos[i] = segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3]);
      }
      this.contarTiempo = true;
    }
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

  leerBD()
  {
    if ((this.modelo != 13 && this.modelo != 3) || this.router.url.substr(0, 9) != "/exportar")
    {
      return;
    }
    let sentencia = "";
    
    sentencia = "SELECT a.*, b.evento, NOW() AS hasta, b.nombre, IFNULL(d.nombre, 'N/A') AS narea, IFNULL(e.nombre, 'N/A') AS placa, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(g.nombre, 'N/A') AS ndestino, '' AS n1, '' AS n2 FROM " + this.servicio.rBD() + ".alarmas a LEFT JOIN " + this.servicio.rBD() + ".cat_alertas b ON a.alerta = b.id LEFT JOIN " + this.servicio.rBD() + ".requesters c ON a.proceso = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales d ON c.AREA = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos e ON c.vehiculo = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON c.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos g ON c.destino = g.id WHERE ISNULL(fin) ORDER BY inicio;";
    
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      let actualizar = JSON.stringify(this.registros) != JSON.stringify(resp);
      if (actualizar)
      {
        if (resp.length == 0)
        {
          this.registros = [];
        }
        if (this.registros.length == 0 && resp.length > 0)
        {
          this.registros = resp;
        }
        else 
        {
          for (i = this.registros.length - 1; i >= 0; i--)
          {
            let hallado = false;
            for (var j = 0; j < resp.length; j++)
            {

              if (this.registros[i].id ==  resp[j].id)
              {
                if (this.registros[i].estado !=  resp[j].indicador || this.registros[i].hasta !=  resp[j].hasta || this.registros[i].fase != resp[j].fase)
                {
                  this.registros[i].indicador = resp[j].indicador;
                  this.registros[i].hasta = resp[j].hasta;
                  this.registros[i].fase = resp[j].fase;
                }
                hallado = true;
                break;
              }
            }
            if (!hallado)
            {
              this.registros.splice(i, 1);
              this.arreTiempos.length = resp.length;
              this.arreHover.length = resp.length;
            }
          }
          for (var i = 0; i < resp.length; i++)
          {
            let agregar = true;
            for (var j = 0; j < this.registros.length; j++)
            {
              if (this.registros[j].id == resp[i].id)
              {
                agregar = false
                break;              
              }
            }
            if (agregar)
            {
              this.registros.splice(i, 0, resp[i])
              this.arreTiempos.length = resp.length;
              this.arreHover.length = resp.length;
            }
          }
          
        }
        this.contarRegs()
      }
      clearTimeout(this.leeBD);
      if (this.router.url.substr(0, 9) == "/exportar")
      {
        this.leeBD = setTimeout(() => {
          this.leerBD()
        }, +this.elTiempo);
      }
    });
  }

  contarRegs()
  {
    if (this.router.url.substr(0, 9) != "/exportar")
    {
      return;
    }
    if (this.modelo == 1)
    {
      this.servicio.mensajeInferior.emit("Exportar datos");   
      return;
    }
    let mensaje = "";
    if (this.registros.length > 0)
    {
      mensaje = "Hay " + (this.registros.length == 1 ? " una alarma activa" : this.registros.length + " alarmas activas") 
    }
    else
    {
      mensaje = "No hay alarmas activas";
    }
    let cadAlarmas: string = "";
    this.alarmados = 0;
    for (var i = 0; i < this.registros.length; i++)
    {
      if (this.registros[i].fase >10)
      {
        this.alarmados = this.alarmados + 1
      }
    }
    if (this.alarmados > 0)
    {
      cadAlarmas = "<span class='resaltar'>" + (this.alarmados == 1 ? "una escalada" : this.alarmados + " escaladas") + "</span>";
    }
    mensaje = mensaje + ' ' + cadAlarmas

    this.servicio.mensajeInferior.emit(mensaje);          
  }


  cancelarAlarmas()
  {
    let sentencia = "SELECT a.*, c.informar_resolucion, c.evento FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".cat_alertas c ON a.alerta = c.id WHERE ISNULL(a.fin)"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        sentencia = "";
        for (var i = 0; i < resp.length; i++) 
        {
              sentencia = sentencia + ";UPDATE " + this.servicio.rBD() + ".alarmas SET estatus = 9, fin = NOW(), tiempo = TIME_TO_SEC(TIMEDIFF(NOW(), inicio))" + (resp[i].informar_resolucion == "S" ? ", informado = 'S'" : "") + ", termino = " + this.servicio.rUsuario().id + " WHERE id = " + resp[i].id + ";UPDATE " + this.servicio.rBD() + ".mensajes SET estatus = 'Z' where alarma = " + resp[i].id;
            if (resp[0].informar_resolucion == "S")
            {
              sentencia = sentencia + ";INSERT INTO " + this.servicio.rBD() + ".mensajes (alerta, canal, tipo, proceso, alarma, lista) SELECT a.alerta, b.canal, 7, a.proceso, a.id, b.lista FROM " + this.servicio.rBD() + ".alarmas a INNER JOIN " + this.servicio.rBD() + ".mensajes b ON a.id = b.alarma WHERE a.id = " + resp[i].id + " AND a.estatus = 9  GROUP BY a.alerta, b.canal, a.proceso, a.id, b.lista";
            }
          }
          sentencia = sentencia.substr(1);
          campos = {accion: 200, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = "Se han terminado todas las alarmas";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
            this.leerBD();
            this.contarRegs(); 
            this.noLeer = false;   
          })
        }
      });
                    
  }
  siguienteCancelar()
  {

    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: "TERMINACIÓN MASIVA DE ALARMAS", mensaje: "Esta acción <strong>SUMAMENTE DELICADA</strong> terminará las alarmas activas de la aplicación.<br><br><strong>¿Desea continuar con la operación?</strong><br><br>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Terminar alarmas", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_alerta" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        
        if (result.accion == 1) 
        {
          if (this.yaConfirmado)
          {
            this.cancelarAlarmas();
          }
          else
          {

            const respuesta = this.dialogo.open(SesionComponent, 
            {
              width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: "Confirmación del ADMINISTRADOR", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_sesion" }
            });
            respuesta.afterClosed().subscribe(result => 
            {
              if (result)
              {
                if (result.accion == 1) 
                {
                  this.cancelarAlarmas();  
                }
                else
                {
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = "No se confirmó la terminacion de las alertas";
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                }
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = "No se confirmó la terminación de las alertas";
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            })
            }
          }        
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "No se confirmó la terminacion de las alertas";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "No se confirmó la terminacion de las alertas";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })

}

}

