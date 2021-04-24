import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, Params } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { DialogoComponent } from '../dialogo/dialogo.component';
import { Router } from '@angular/router';
import 'snapsvg-cjs';
import * as SNAPSVG_TYPE from 'snapsvg';

declare var Snap: typeof SNAPSVG_TYPE;

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css'],
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

export class VisorComponent implements OnInit {

  @ViewChild("txtBuscar") txtBuscar: ElementRef;
  @ViewChild("txtNotas") txtNotas: ElementRef;
  scrollingSubscription: Subscription;
  vistaCatalogo: Subscription;
  //URL_FOLDER = "http://localhost:8081/sigma/assets/datos/";
  URL_FOLDER = "/sigma/assets/datos/";

  @HostListener('window:resize', ['$event']) onResize() {
    // this.eliminarFiltros();
    // this.detenerConsultaStatus();
    // this.calcularPantalla();
    // this.procesarMapa();
    //setTimeout(() => location.reload(), 100);
  }


  constructor
  (
    private servicio: ServicioService,
    public scroll: ScrollDispatcher,
    public dialogo: MatDialog,
    private router: Router,
    private rutaActiva: ActivatedRoute
  )
  {
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
    this.servicio.teclaBuscar.subscribe((accion: boolean)=>
    {
      this.buscar();
    });
    this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      this.escapar();
    });
    this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
    });
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 6) == "/visor")
      {
        this.cadaSegundo();
      }
    });
    this.servicio.cambioPantalla.subscribe((pantalla: any)=>
    {
      this.altoPantalla = this.servicio.rPantalla().alto - 92;
      this.anchoPantalla = this.servicio.rPantalla().ancho - 2;// - (pantalla ? 0 : this.servicio.rAnchoSN());// : 0);
      if (this.verTop)
        {
          this.totalItems = Math.floor((this.altoPantalla - 60) / 100);
        }
        else{
          this.totalItems = Math.floor(this.altoPantalla / 100);
        }
        this.uReporte = 0;
        this.refrescarTactos();
      
    });
 
    this.servicio.vista.subscribe((accion: number)=>
    {
      if (accion == 20)
      {
        this.rConfiguracion();
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
        if (this.verTop)
        {
          this.totalItems = Math.floor((this.altoPantalla - 60) / 100);
        }
        else{
          this.totalItems = Math.floor(this.altoPantalla / 100);
        } 
        
      }
    });
    this.servicio.mostrarBarra.subscribe((accion: boolean)=>
    {
      if (this.router.url.substr(0, 6) == "/visor")
      {
        this.verTop = accion;
        this.servicio.guardarVista(34, this.verTop ? 1: 0 );
        if (this.verTop)
        {
          this.totalItems = Math.floor((this.altoPantalla - 60) / 100);
        }
        else{
          this.totalItems = Math.floor(this.altoPantalla / 100);
        }
        this.refrescarTactos();
        
      }
    });
    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    
  }

  ngOnInit() 
  {
    this.servicio.validarLicencia(1)
    
    this.rConfiguracion();
    this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
    if (this.verTop)
    {
      this.totalItems = Math.floor((this.altoPantalla - 60) / 100);
    }
    else{
      this.totalItems = Math.floor(this.altoPantalla / 100);
    }
  }

 

  listoMostrar: boolean = true;
  animando: boolean = true;
  sentenciaR: string = "";
  arreTiempos2: any = [];
  arreTiempos3: any = [];
  bot: any = [ false, false ];
  
  modelo: number = 5;
  historias: any = []; 
  

  
  uReporte: number = 0;
  leeBD: any;
  elTiempo: number = 0;
  sondeo: number = 0;
  mensajeTotal: string = "";
  ultimoMapa: string = "";
  mostradoTodos: boolean = false;

  llamadaLista: boolean = false;
  arreHover: any = [];

  offSet: number;

  contar: boolean = false;
  verIrArriba: boolean = false;
  contarTiempo: boolean = false;
  verBuscar: boolean = false;
  empezando: boolean = true;
  movil: boolean = false;
  verBarra: string = "";
  ultimoReporte: string = "";
  ultimoID: number = 0;
  textoBuscar: string = "";
  nuevoRegistro: string = ";"
  maestroActual: number = 0;
  altoPantalla: number = this.servicio.rPantalla().alto - 105;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();
  totalItems = Math.floor(this.altoPantalla / 100);
  anchoMapa: number = this.anchoPantalla * 0.60;
  anchoMensaje: number = this.anchoPantalla - 13;
  anchoExcel: number = this.anchoPantalla * 0.40 - 20;;
  altoMapa: number = this.altoPantalla * 0.67;
  altoMensaje: number = this.altoPantalla * 0.33 - 10;
  altoExcel: number = this.altoPantalla * 0.67;
  errorTitulo: string = "Ocurrió un error durante la conexión al servidor";
  errorMensaje: string = "";
  pantalla: number = 2;
  miSeleccion: number = 1;
  iconoGeneral: string = "";
  tituloBuscar: string = "";
  verMantenimiento: boolean = false;
  enCadaSegundo: boolean = false;
  cuentaMapa: number = 0;
  cuentaMapaRotar: number = 0;
  registros: any = [];
  excels: any = [];
  arrFiltrado: any = [];
  cronometro: any;
  laSeleccion: any = [];
  anchoColumnas: any = [];
  anchoColumnas2: any = [];
  configuracion: any = [];
  hoverp01: boolean = false;
  hoverp02: boolean = false;
  boton01: boolean = true;
  boton02: boolean = true;
  boton03: boolean = true;
  verSR: boolean = true

  verTop: boolean = this.servicio.rUsuario().preferencias_andon.substr(33, 1) == "1";

  
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
        this.txtBuscar.nativeElement.focus();
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
        this.verIrArriba = false; //true
        clearTimeout(this.cronometro);
        this.cronometro = setTimeout(() => {
          this.verIrArriba = false;
        }, 3000);
      }

    this.offSet = scrollTop;
  }

  cancelar()
  {

  }

  salidaEfecto(evento: any)
  {
    if (evento.toState)
    {
      this.modelo = 5;

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
        if (!resp[0].mapa_fondo)
        {
          resp[0].mapa_fondo = "t";
        }
        this.configuracion = resp[0];
        this.servicio.mostrarBmenu.emit(this.verTop ? 1 : 2);
        
        this.iniLeerBD();
        this.refrescarTactos();
      }
    },
    error =>
      {
        console.log(error)
      })
  }

  
  cadaSegundo()
  {
    if (this.router.url.substr(0, 6) != "/visor")
      {
        return;
      }
      this.revisarTiempo();
    
  }

  contarRegs()
  {
    if (this.router.url.substr(0, 6) != "/visor")
    {
      return;
    }
    let cadAlarmas = "";
    let alarmados = 0;
    for (var i = 0; i < this.historias.length; i++)
    {
      if (this.historias[i].alarmado == "S" || this.historias[i].des_alarmado == "S")
      {
        alarmados = alarmados + 1
      }
    }
    if (alarmados > 0)
    {
        cadAlarmas = "<span class='resaltar'>" + (alarmados == 1 ? "uno alarmado" : alarmados + " alarmados") + "</span>";  
    }
    if (this.historias.length == 0)
    {
      this.servicio.mensajeInferior.emit( "<span class='resaltar'>No hay tactos en este momento</span>");          
    }
    else
    { 
      this.servicio.mensajeInferior.emit(" Hay " +  (this.historias.length == 1 ? "un tacto en este momento" : this.historias.length + " tactos en este momento") + " " + cadAlarmas)
    }
  }


  
  leerBD()
  {
    if (this.router.url.substr(0, 6) != "/visor")
    {
      return;
    }
    this.refrescarTactos()
    
    clearTimeout(this.leeBD);
    if (this.router.url.substr(0, 6) == "/visor")
    {
      this.leeBD = setTimeout(() => {
        this.leerBD()
      }, +this.elTiempo);
    }
  }

  revisarTiempo()
  {
    this.contarTiempo = false;
    
      for (var i = 0; i < this.historias.length; i++)
      {
        

        if(this.historias[i].id==0)
        {
          if (this.historias[i].inicio)
          {
            let segundos =  this.servicio.tiempoTranscurrido(this.historias[i].inicio, "F").split(";");
            this.arreTiempos2[i] = segundos[1].substring(0, 1) != '-' ? (segundos[1] + ":" + (+segundos[2] < 10 ? "0" + segundos[2] : segundos[2]) + ":" + (+segundos[3] < 10 ? "0" + segundos[3] : segundos[3])) : "---";
          }
          else
          {
            this.arreTiempos2[i] = "";
          }
        }




        else if (this.historias[i].idest == 0)
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


  iniLeerBD()
  {
    if (!this.configuracion.visor_revisar_cada)
    {
      this.elTiempo = 5000;
    }
    else
    {
      this.elTiempo = +this.configuracion.visor_revisar_cada * 1000;
    }
    setTimeout(() => {
      this.leerBD();
    }, +this.elTiempo);
  }
  


////ELVIS


  refrescarTactos() 
  {
    //let sentencia = "SELECT * FROM (SELECT 1, a.id, a.viaje, a.estatus AS idest, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, CASE WHEN a.estatus = 0 THEN 'i_camion' WHEN a.estatus = 1 THEN 'i_documento' WHEN a.estatus = 2 THEN 'in_seleccionado' WHEN a.estatus = 9 THEN 'i_eliminar' END AS icono, SEC_TO_TIME(a.estimado) AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.alarmado, a.des_alarmado, a.des_inicio, a.des_fin, TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio) AS tiempo, TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio) AS des_tiempo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON a.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON a.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.carga = i.id WHERE a.estado = 0 AND a.id > " + this.uReporte + ") AS q1 UNION (SELECT 2, a.id, a.viaje, a.estatus AS idest, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, CASE WHEN a.estatus = 0 THEN 'i_camion' WHEN a.estatus = 1 THEN 'i_documento' WHEN a.estatus = 2 THEN 'in_seleccionado' WHEN a.estatus = 9 THEN 'i_eliminar' END AS icono, SEC_TO_TIME(a.estimado) AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.alarmado, a.des_alarmado, a.des_inicio, a.des_fin, TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio) AS tiempo, TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio) AS des_tiempo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON a.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON a.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.carga = i.id WHERE a.estado = 0 AND a.id <= " + this.uReporte + ") UNION (SELECT 0, 0, b.orden, 0 AS idest, 'En espera' AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, 'i_espera' AS icono, 0 AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, b.fecha_recibo AS inicio, b.hasta, b.alarmado, 'N' AS des_alarmado, NULL, NULL, 0 AS tiempo, 0 AS des_tiempo FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON b.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON b.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 10 AND b.preasignado = 'S') ORDER BY 1, 2, 3" 
    
    let sentencia = "SELECT * FROM (SELECT 1, a.id, a.viaje, a.estatus AS idest, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, CASE WHEN a.estatus = 0 THEN 'i_camion' WHEN a.estatus = 1 THEN 'i_documento' WHEN a.estatus = 2 THEN 'in_seleccionado' WHEN a.estatus = 9 THEN 'i_eliminar' END AS icono, SEC_TO_TIME(a.estimado) AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.alarmado, a.des_alarmado, a.des_inicio, a.des_fin, TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio) AS tiempo, TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio) AS des_tiempo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON a.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON a.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.carga = i.id WHERE a.estado = 0) AS qry UNION (SELECT 0, 0, b.orden, 0 AS idest, 'En espera' AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, 'i_espera' AS icono, 0 AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, b.fecha_recibo AS inicio, b.hasta, b.alarmado, 'N' AS des_alarmado, NULL, NULL, 0 AS tiempo, 0 AS des_tiempo FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON b.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON b.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 10 AND b.preasignado = 'S') ORDER BY 1, 2, 3" 

    if (this.configuracion.visor_mostrar==2)
    {
      sentencia = "SELECT a.id, a.viaje, a.estatus AS idest, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, CASE WHEN a.estatus = 0 THEN 'i_camion' WHEN a.estatus = 1 THEN 'i_documento' WHEN a.estatus = 2 THEN 'in_seleccionado' WHEN a.estatus = 9 THEN 'i_eliminar' END AS icono, SEC_TO_TIME(a.estimado) AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.alarmado, a.des_alarmado, a.des_inicio, a.des_fin, TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio) AS tiempo, TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio) AS des_tiempo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON a.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON a.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.carga = i.id WHERE a.estado = 0 ORDER BY 1, 2" 
    }
    else if (this.configuracion.visor_mostrar==1)
    {
     sentencia = "SELECT 0 AS id, b.orden AS viaje, 0 AS idest, 'En espera' AS estatus, c.nombre, f.nombre AS ntransporte, h.nombre AS nchofer, i.nombre AS ncarga, 'i_espera' AS icono, 0 AS estimado, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, b.fecha_recibo AS inicio, b.hasta, b.alarmado, 'N' AS des_alarmado, NULL, NULL, 0 AS tiempo, 0 AS des_tiempo FROM " + this.servicio.rBD() + ".requesters b LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON b.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON b.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON b.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON b.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON b.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON b.carga = i.id WHERE b.estado = 10 AND b.preasignado = 'S' ORDER BY 2" 

    }

    this.sentenciaR = "SELECT 'Placas', 'ID', 'Tacto', 'Estatus del tacto', 'Origen', 'Destino', 'Inicio del traslado', 'Fin del traslado', 'Tiempo estimado de traslado (seg)', 'Tiempo real del traslado (seg)', 'Se alarmó el tiempo de traslado?', 'Inicio de la descarga', 'Fin de la  descarga', 'Tiempo estimado de la descarga (seg)', 'Tiempo real de la descarga (seg)', 'Se alarmo la descarga?', 'Transporte', 'Nombre del chofer', 'Tipo de Carga', 'Tipo de vehiculo' UNION ALL SELECT c.nombre, a.id, a.viaje, CASE WHEN a.estatus = 0 THEN 'En curso' WHEN a.estatus = 1 THEN 'Descargando' WHEN a.estatus = 2 THEN 'Terminado' WHEN a.estatus = 9 THEN 'Cancelado' END AS estatus, IFNULL(d.nombre, 'N/A') AS dOrigen, IFNULL(e.nombre, 'N/A') AS dDestino, a.inicio, a.fin, a.estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 0, fin, NOW()), inicio)) AS tiempo, a.alarmado, a.des_inicio, a.des_fin, a.des_estimado, TIME_TO_SEC(TIMEDIFF(IF(a.estatus > 1, des_fin, NOW()), des_inicio)) AS des_tiempo, a.des_alarmado, IFNULL(f.nombre, 'N/A') AS ntransporte, IFNULL(h.nombre, 'N/A') AS nchofer, IFNULL(i.nombre, 'N/A') AS ncarga, IFNULL(j.nombre, 'N/A') AS ntipo FROM " + this.servicio.rBD() + ".movimientos_det a LEFT JOIN " + this.servicio.rBD() + ".cat_destinos d ON a.origen = d.id LEFT JOIN " + this.servicio.rBD() + ".requesters b ON a.requester = b.id LEFT JOIN " + this.servicio.rBD() + ".cat_vehiculos c ON a.vehiculo = c.id LEFT JOIN " + this.servicio.rBD() + ".cat_destinos e ON a.destino = e.id LEFT JOIN " + this.servicio.rBD() + ".cat_transportes f ON a.transporte = f.id LEFT JOIN " + this.servicio.rBD() + ".cat_choferes h ON a.chofer = h.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales i ON a.carga = i.id LEFT JOIN " + this.servicio.rBD() + ".cat_generales j ON c.tipo = j.id WHERE a.estado = 0"; 
    this.verSR = false;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {

      if (this.uReporte >= resp.length)
      {
        this.uReporte = 0;
      }
      if (resp.length > this.totalItems)
      {
        this.modelo = 15
        this.historias = [];
        for (var i = this.uReporte; i < this.uReporte + this.totalItems; i++)
        {
          if (i < resp.length)
          {
            this.historias.push(resp[i])    
          }
          else
          {
            break
          }
        }  
        let faltante = i - this.uReporte;
        if (faltante < this.totalItems)
        {
          for (var i = 0; i < this.totalItems - faltante; i++)
          {
            if (i < resp.length)
            {
              this.historias.push(resp[i])    
            }
            else
            {
              break
            }
          } 
        } 
        this.uReporte = i;
      }

      else
      {
        this.modelo = 15
        this.historias = resp;
        this.arreTiempos2.length = resp.length;
        this.arreTiempos3.length = resp.length;
        this.contarRegs();
        setTimeout(() => {
          this.animando = true;
        }, 100);
        this.uReporte = 0;
      }
      this.verSR = true;
      
    })
    
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

  exportar()
  {
    let nombreReporte = "tactos_activos.csv";
    let catalogo = "Tactos activos";
    let campos = {accion: 100, sentencia: this.sentenciaR};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.servicio.generarReporte(resp, catalogo, nombreReporte)
      }
    })
  }

  ////


}

