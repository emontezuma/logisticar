import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { ActivatedRoute, GuardsCheckStart } from '@angular/router';
import { trigger, style, animate, transition, query, group, state, stagger } from '@angular/animations';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { HttpClient  } from '@angular/common/http';
import { ViewportRuler } from "@angular/cdk/overlay";
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { LicenciaComponent } from '../licencia/licencia.component';
import { SesionComponent } from '../sesion/sesion.component';
import { ProgramadorComponent } from '../programador/programador.component';
import { TemasComponent } from '../temas/temas.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css'],
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

export class ParametrosComponent implements OnInit {

  
  @ViewChild("txtT1") txtT1: ElementRef;
  @ViewChild("txtT2") txtT2: ElementRef;
  @ViewChild("txtT3") txtT3: ElementRef;
  @ViewChild("listaListad") listaListad: MatSelectionList;
  
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

    this.servicio.verProgramador.subscribe((data: any)=>
      {
        if (!this.eProgramador)
        {
          const respuesta = this.dialogo.open(ProgramadorComponent, 
          {
            width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: "Confirmación de ADMINISTRADOR", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Ingresar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_sesion" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (result.accion == 1)
              {
                this.eProgramador = true;
              } 
            }
          })  
        }
      });
   

    this.servicio.teclaEscape.subscribe((accion: boolean)=>
    {
      this.cancelar();
    });
    this.servicio.vista.subscribe((accion: number)=>
    {
      if (this.router.url.substr(0, 11) == "/parametros")
      {
        this.eProgramador = false;
        if (accion == 42 || accion == 44)
        {
          if (accion == 42)
          {
            this.modelo = 11;
            this.verCambioMapa = true;
            this.servicio.mensajeInferior.emit("<span class='resaltar'>Parámetros de la aplicación</span>");
            this.rConfiguracion();
          }
          else if (accion == 44)
          {
            this.llenarLicencias();
            this.modelo = 12;
            this.verCambioMapa = false;
            
            }
        }
      }
    })
    this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
      document.documentElement.style.setProperty("--ancho_campo", this.movil ? "300px" : "400px");
    });

    this.servicio.valida.subscribe((val) => 
    {
        this.licenciado = this.servicio.rLicenciado();
    });
    

    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
    });
    if (this.servicio.rVista() == 42)
    {
      this.modelo = 1;
      this.verCambioMapa = true;
      this.servicio.mensajeInferior.emit("<span class='resaltar'>Parámetros de la aplicación</span>");
    }
    else
    {
      this.modelo = 2;
      this.llenarLicencias();
      this.verCambioMapa = false;
      
    }
    this.rConfiguracion();
    
  }

  ngOnInit() {
    
    this.servicio.validarLicencia(1)
    this.llenarListas(9, this.servicio.rBD() + ".cat_distribucion", "");
    document.documentElement.style.setProperty("--ancho_campo", this.servicio.rMovil() ? "300px" : "400px");
    this.movil = this.servicio.rMovil(); 
    this.servicio.mostrarBmenu.emit(0);
    let sentencia = "SELECT CONCAT(key_number, serial) AS mmcall FROM mmcall.locations"
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.clave = resp[0].mmcall;
      }
      else
      {

      }
    })
  }

  offSet: number;
  mensajeMacro: string = "Agregar macro al mensaje:\n[0] Número del reporte.\n[1] Nombre de la línea asociada.\n[2] Nombre de la máquina.\n[3] Nombre del área.\n[4] Nombre de la falla.\n[5] Fecha y hora del mensaje.\n[11] Tiempo transcurrido.\n[20] Número de repetición.\n[30] Nivel de escalamiento.\n"
  imagenSel: boolean = false;
  activarModulos: boolean = false;
  lineaSel: boolean = false;
  mapaSel: boolean = false;
  licSel: boolean = false;
  verIrArriba: boolean = false;
  licenciado: boolean = this.servicio.rLicenciado();
  movil: boolean = false;
  verBarra: string = "";
  textoBuscar: string = "";
  clavePublica: string = "";
  verSR: boolean = false;
  editando: boolean = false;
  faltaMensaje: string = "";
  mensajeImagen: string = "Campo opcional";
  eProgramador: boolean = false;
  mostrarImagenRegistro: string = "N";
  existeRegistro: boolean = false;
  palabraClave: string = "LogisticarcronosI2019";
  tipo: string = "B";
  verCambioMapa: boolean = true;

  cancelarEdicion: boolean = false;

  modelo: number = 0;
  ultimaActualizacion = new Date();
  altoPantalla: number = this.servicio.rPantalla().alto - 92;
  anchoPantalla: number = this.servicio.rPantalla().ancho - 10 + this.servicio.rAnchoSN();
  errorTitulo: string = "Ocurrió un error durante la conexión al servidor";
  errorMensaje: string = "";
  pantalla: number = 2;
  iconoGeneral = "i_licencia";
  iconoVista: string = "";
  visualizarImagen: boolean = false;
  detalle: any = [];
  listas: any = [];
  temas: any = [];
  eventos: any = [];
  licencias: any = [];
  //URL_BASE = "http://localhost:8081/logisticar/api/upload.php";
  URL_IMAGENES = "/logisticar/assets/imagenes/";
  URL_BASE = "/logisticar/api/upload.php"
  
  ayuda01 = "Seleccionar una imagen para subir"
  disponibilidad: any = [];

  boton01: boolean = false;
  boton02: boolean = false;

  bot4Sel: boolean = false;

  error01: boolean = false;
  error02: boolean = false;
  error03: boolean = false;
  error04: boolean = false;
  error35: boolean = false;
  clave: string = "";
  local: string = "";
  licencia: string = "";

  cronometro: any;

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

  imagenError()
  {
    this.mostrarImagenRegistro = "N";
    this.detalle.mostrarImagen = "N"
  }


  rConfiguracion()
  {
    this.eProgramador = false;
    this.existeRegistro = false; 
    this.detalle = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.existeRegistro = true
      if (resp.length > 0)
      {
        this.faltaMensaje = "";
        resp[0].mapa_fondo = "#" + resp[0].mapa_fondo;
        if (resp[0].mapa_alineacion == "none")
        {
          resp[0].mapa_alineacion = "S";
        }
        else
        {
          resp[0].mapa_alineacion = "L";
        }
        if (resp[0].ruta_archivos_enviar)
        {
          resp[0].ruta_archivos_enviar = resp[0].ruta_archivos_enviar.replace(/\//g, '\\');  
        }
        
        if (resp[0].ruta_audios)
        {
          resp[0].ruta_audios = resp[0].ruta_audios.replace(/\//g, '\\');
        }
        if (resp[0].ruta_sms)
        {
          resp[0].ruta_sms = resp[0].ruta_sms.replace(/\//g, '\\');
        }
        
        if (resp[0].ruta_programa_mapa)
        {
          resp[0].ruta_programa_mapa = resp[0].ruta_programa_mapa.replace(/\//g, '\\');
        }
        
        if (resp[0].audios_ruta)
        {
          resp[0].audios_ruta = resp[0].audios_ruta.replace(/\//g, '\\');
        }
        
        if (resp[0].audios_prefijo)
        {
          resp[0].audios_prefijo = resp[0].audios_prefijo.replace(/\//g, '\\');
        }
        
        
        this.detalle = resp[0];
        this.boton01 = false;
        this.boton02 = false;
        
        
        this.llenarTemas();
        this.llenarEventos()
        sentencia = "SELECT * FROM " + this.servicio.rBD() + ".disponibilidad WHERE maquina = 0 AND linea = 0 LIMIT 1;"
        let campos = {accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length > 0)
          {
            this.disponibilidad = resp[0];
          }
          else
          {
            this.iniDisp();
          }
        });

      }
      this.editando = false;
    },
    error =>
      {
        console.log(error)
      })
  }

  
    guardar()
  {
    let errores = 0;
    this.error01 = false;
    this.error02 = false;
    this.error03 = false;
    this.error04 = false;
    if (this.verCambioMapa)
    {
      this.faltaMensaje = "<strong>No se ha guardado el registro por el siguiente mensaje:</strong> ";
      if (!this.detalle.planta)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el Nombre de la planta";
      }
      if (!this.detalle.rfc)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el RFC del negocio";
      }
      if (!this.detalle.licencia)
      {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar la licencia de software suministrada por Cronos";
      }
    }
    else
    {
      this.faltaMensaje = "<strong>No se ha guardado la licencia por el siguiente mensaje:</strong> ";
      if (!this.local)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el Número o ID del equipo";
      }
      else if (this.local.length == 0)
      {
          errores = errores + 1;
          this.error01 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar el Número o ID del equipo";
      }
      if (!this.licencia)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar la licencia del proveedor";
      }
      else if (this.licencia.length == 0)
      {
          errores = errores + 1;
          this.error02 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") Falta especificar la licencia del proveedor";
      }
      if (errores == 0)
      {
        let validada = true;
        let cadComparar = "";
        let claveInterna = this.alterarPalabraClave();
        for (var i = 0; i < this.licencia.length; i++) 
        {
          let numero = (this.clavePublica[i].charCodeAt(0) ^ claveInterna[i].charCodeAt(0)).toString();
          if (numero.length == 1)
          {
            cadComparar = numero;
          }
          else if (numero.length == 2)
          {
            cadComparar = numero.substr(1);
          }
          else if (numero.length == 3)
          {
            cadComparar = numero.substr(1, 1);
          }
          if (cadComparar != this.licencia[i])
          {
            validada = false;
            break;
          }
        }
        if (!validada)
        {
          errores = errores + 1;
          this.error03 = true;
          this.faltaMensaje = this.faltaMensaje + "<br>" + errores + ") La licencia no es válida";
  
        }
      }

    }
    if (errores > 0)
    {
      setTimeout(() => {
        if (this.verCambioMapa)
        {
          if (this.error01)
          {
            this.txtT1.nativeElement.focus();
          }
          else if (this.error02)
          {
            this.txtT2.nativeElement.focus();
          }
          else if (this.error03)
          {
            this.txtT3.nativeElement.focus();
          }
        }
        else
        {
          if (this.error01)
          {
            this.txtT1.nativeElement.focus();
          }
          else if (this.error02)
          {
            this.txtT2.nativeElement.focus();
          }
          else if (this.error03)
          {
            this.txtT2.nativeElement.focus();
          }
        }
      }, 300);
      return;
    }
    this.servicio.refrescarLogo.emit(true);
    this.editando = false;
    this.faltaMensaje = "";
    if (this.verCambioMapa)
    {
      let sentencia = "INSERT INTO " + this.servicio.rBD() + ".configuracion (tiempo) VALUES (0);";
      if (this.existeRegistro)
      {
        sentencia = "";
      }
      let mapa_fondo = "FFFFFF";
      if (this.detalle.mapa_fondo)
      {
        if (this.detalle.mapa_fondo.substr(0, 1)=="#")
        {
          mapa_fondo = this.detalle.mapa_fondo.substr(1);
        }
      }
      if (!this.detalle.escape_lista)
      {
        this.detalle.escape_lista = 0
      }
      if (!this.detalle.tiempo_reporte)
      {
        this.detalle.tiempo_reporte = 0
      }
      if (!this.detalle.mapa_delay)
      {
        this.detalle.mapa_delay = 30;
      }
      else if (this.detalle.mapa_delay > 3600)
      {
        this.detalle.mapa_delay = 3600;
      }
      let mapa_alineacion = "none";
      if (this.detalle.mapa_alineacion == "L")
      {
        mapa_alineacion = "xMidYMid meet";
      }
      if (!this.detalle.timeout_llamadas)
      {
        this.detalle.timeout_llamadas = 0
      }
      if (!this.detalle.timeout_sms)
      {
        this.detalle.timeout_sms = 0
      }
      if (!this.detalle.veces_reproducir)
      {
        this.detalle.veces_reproducir = 0
      }
      this.detalle.be_alarmas_correos = "N";
      this.detalle.be_alarmas_llamadas = "N";
      this.detalle.be_alarmas_mmcall = "N";
      this.detalle.be_alarmas_sms = "N";

      for (var i = 0; i < this.listaListad.selectedOptions.selected.length; i++) 
      {
        if (this.listaListad.selectedOptions.selected[i].value==0)
        {
          this.detalle.be_alarmas_correos = "S";
        }
        else if (this.listaListad.selectedOptions.selected[i].value==1)
        {
          this.detalle.be_alarmas_mmcall = "S";
        }
        else if (this.listaListad.selectedOptions.selected[i].value==2)
        {
          this.detalle.be_alarmas_llamadas = "S";
        }
        else 
        {
          this.detalle.be_alarmas_sms = "S";
        }
      }
      
      let ruta_archivos_enviar = ""
      if (this.detalle.ruta_archivos_enviar)
      {
        ruta_archivos_enviar = this.detalle.ruta_archivos_enviar.replace(/\\/g, '/')
      }
      let ruta_audios = ""
      if (this.detalle.ruta_audios)
      {
        ruta_audios = this.detalle.ruta_audios.replace(/\\/g, '/')
      }
      let ruta_programa_mapa = ""
      if (this.detalle.ruta_programa_mapa)
      {
        ruta_programa_mapa = this.detalle.ruta_programa_mapa.replace(/\\/g, '/')
      }
      let ruta_sms = ""
      if (this.detalle.ruta_sms)
      {
        ruta_sms = this.detalle.ruta_sms.replace(/\\/g, '/')
      }
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
      if (!this.detalle.audios_escalamiento)
      {
        this.detalle.audios_escalamiento = 0;
      }
      if (!this.detalle.andon_repeticiones)
      {
        this.detalle.andon_repeticiones = 0;
      }
      else if (this.detalle.andon_repeticiones> 999)
      {
        this.detalle.andon_repeticiones = 999;
      }
      if (!this.detalle.tiempo_andon)
      {
        this.detalle.tiempo_andon = 0;
      }
      else if (this.detalle.tiempo_andon > 86400)
      {
        this.detalle.tiempo_andon = 86400;
      }
      if (!this.detalle.carrusel_tiempo)
      {
        this.detalle.carrusel_tiempo = 0;
      }
      else if (this.detalle.carrusel_tiempo > 999999)
      {
        this.detalle.carrusel_tiempo = 999999;
      }
      else if (this.detalle.carrusel_tiempo < 10)
      {
        this.detalle.carrusel_tiempo = 10;
      }

      this.detalle.tiempo_escaner = this.detalle.tiempo_escaner <= 10 || this.detalle.tiempo_escaner > 9999 ? 10 : this.detalle.tiempo_escaner;
      this.detalle.tiempo_entre_lecturas = this.detalle.tiempo_entre_lecturas <= 0 || this.detalle.tiempo_entre_lecturas > 99999 ? 10 : this.detalle.tiempo_entre_lecturas;
      this.detalle.holgura_reprogramar = this.detalle.holgura_reprogramar <= 0 || this.detalle.holgura_reprogramar > 99999 ? 10 : this.detalle.holgura_reprogramar;
      this.detalle.tiempo_entre_lecturas = this.detalle.avisar_segundos <= 0 || this.detalle.avisar_segundos > 9999 ? 10 : this.detalle.avisar_segundos;
      this.detalle.estimado_productividad = this.detalle.estimado_productividad <= 0 || this.detalle.estimado_productividad > 9999 ? 0 : this.detalle.estimado_productividad;
      


      sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".configuracion SET avisar_segundos = " + +this.detalle.avisar_segundos + ", estimado_productividad = " + +this.detalle.estimado_productividad + ", holgura_reprogramar = " + +this.detalle.holgura_reprogramar + ", tiempo_entre_lecturas = " + +this.detalle.tiempo_entre_lecturas + ", tiempo_escaner = " + +this.detalle.tiempo_escaner + ", tipo_flujo = '" + this.detalle.tipo_flujo + "', mensaje_mmcall = '" + this.detalle.mensaje_mmcall + "', reverso_referencia = '" + this.detalle.reverso_referencia + "', lote_inspeccion_clave = '" + this.detalle.lote_inspeccion_clave + "', reverso_permitir = '" + this.detalle.reverso_permitir + "', oee_mostrar_paro = '" + this.detalle.oee_mostrar_paro + "', carrusel_oee = " + this.detalle.carrusel_oee + ", carrusel_tiempo = " + +this.detalle.carrusel_tiempo + ", mostrar_numero = '" + this.detalle.mostrar_numero + "', confirmar_mensaje_mantto = '" + this.detalle.confirmar_mensaje_mantto + "', usar_clave_falla = '" + this.detalle.usar_clave_falla + "', audios_resolucion = '" + this.detalle.audios_resolucion + "', audios_escalamiento = " + this.detalle.audios_escalamiento + ", accion_mmcall = '" + this.detalle.accion_mmcall + "', be_alarmas_correos = '" + this.detalle.be_alarmas_correos + "', be_alarmas_llamadas = '" + this.detalle.be_alarmas_llamadas + "', be_alarmas_mmcall = '" + this.detalle.be_alarmas_mmcall + "', be_alarmas_sms = '" + this.detalle.be_alarmas_sms + "', be_envio_reportes = '" + this.detalle.be_envio_reportes + "', be_revision_arduino = '" + this.detalle.be_revision_arduino + "', be_revision_correos = '" + this.detalle.be_revision_correos + "', be_revision_mmcall = '" + this.detalle.be_revision_mmcall + "', confirmar_reparacion = '" + this.detalle.confirmar_reparacion + "', correo_clave = '" + this.detalle.correo_clave + "', correo_cuenta = '" + this.detalle.correo_cuenta + "', correo_host = '" + this.detalle.correo_host + "', correo_puerto = '" + this.detalle.correo_puerto + "', correo_ssl = '" + this.detalle.correo_ssl + "', escape_accion = '" + this.detalle.escape_accion + "', escape_lista = " + this.detalle.escape_lista + ", escape_llamadas = '" + this.detalle.escape_llamadas + "', escape_mensaje = '" + this.detalle.escape_mensaje + "', escape_mensaje_propio = '" + this.detalle.escape_mensaje_propio + "', gestion_meses = " + this.detalle.gestion_meses + ", licencia = '" + this.detalle.licencia + "', limitar_inicio = " + this.detalle.limitar_inicio + ", limitar_respuestas = " + this.detalle.limitar_respuestas + ", logo_alto = " + this.detalle.logo_alto + ", logo_ancho = " + this.detalle.logo_ancho + ", logo_arriba = " + this.detalle.logo_arriba + ", logo_izquierda = " + this.detalle.logo_izquierda + ", logo_ruta = '" + this.detalle.logo_ruta + "', mantener_prioridad = '" + this.detalle.mantener_prioridad + "', mapa_alineacion = '" + mapa_alineacion + "', mapa_fondo = '" + mapa_fondo + "', optimizar_correo = '" + this.detalle.optimizar_correo + "', optimizar_llamada = '" + this.detalle.optimizar_llamada + "', optimizar_mmcall = '" + this.detalle.optimizar_mmcall + "', optimizar_sms = '" + this.detalle.optimizar_sms + "', planta = '" + this.detalle.planta + "', puerto_comm1 = '" + this.detalle.puerto_comm1 + "', puerto_comm1_par = '" + this.detalle.puerto_comm1_par + "', puerto_comm2 = '" + this.detalle.puerto_comm2 + "', puerto_comm2_par = '" + this.detalle.puerto_comm2_par + "', recuperar_sesion = '" + this.detalle.recuperar_sesion + "', rfc = '" + this.detalle.rfc + "', ruta_archivos_enviar = '" + ruta_archivos_enviar + "', ruta_audios = '" + ruta_audios + "', ruta_programa_mapa = '" + ruta_programa_mapa + "', ip_localhost = '" + this.detalle.ip_localhost + "', ruta_sms = '" + ruta_sms + "', tiempo_reporte = " + this.detalle.tiempo_reporte + ", timeout_llamadas = " + this.detalle.timeout_llamadas + ", timeout_sms = " + this.detalle.timeout_sms + ", mapa_delay = " + this.detalle.mapa_delay + ", ver_nombre_planta = '" + this.detalle.ver_nombre_planta + "', mapa_rotacion = " + this.detalle.mapa_rotacion + ", traducir = '" + this.detalle.traducir + "', url_mmcall = '" + this.detalle.url_mmcall + "', utilizar_arduino = '" + this.detalle.utilizar_arduino + "', veces_reproducir = " + +this.detalle.veces_reproducir + ", voz_predeterminada = '" + this.detalle.voz_predeterminada + "', tema_principal = " + +this.detalle.tema_principal + ", tema_permitir_crear = '" + this.detalle.tema_permitir_crear + "', tema_permitir_cambio = '" + this.detalle.tema_permitir_cambio + "', turno_modo = '" + this.detalle.turno_modo + "', audios_activar = '" + this.detalle.audios_activar + "', audios_ruta = '" + audios_ruta + "', audios_prefijo = '" + audios_prefijo + "', ver_ayuda = '" + this.detalle.ver_ayuda + "', mensaje = '" + this.detalle.mensaje + "', andon_repeticiones = " + +this.detalle.andon_repeticiones + ", tiempo_andon = " + this.detalle.tiempo_andon + ", agregar_movil = '" + this.detalle.agregar_movil + "', adicionales = '" + this.detalle.adicionales + "', asignar_caseta = '" + this.detalle.asignar_caseta + "', asignar_automatico = '" + this.detalle.asignar_automatico + "', agregar_transporte = '" + this.detalle.agregar_transporte + " ', visor_mostrar = '" + this.detalle.visor_mostrar + "', ver_logo_cronos = '" + this.detalle.ver_logo_cronos + "', url_cronos = '" + this.detalle.url_cronos + "', pagers_val = '" + this.detalle.pagers_val + "' ";
      let campos = {accion: 200, sentencia: sentencia};
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        
        this.eProgramador = false;
        sentencia = ""
        for (var i = 0; i < this.eventos.length; i++) 
        {
          this.eventos[i].revision = !this.eventos[i].revision ? 5 : this.eventos[i].revision;
          sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".int_eventos SET monitor = '" + this.eventos[i].monitor + "', revision = " + +this.eventos[i].revision + " WHERE id = " + this.eventos[i].id + ";";            
        }
        sentencia = sentencia.substr(0, sentencia.length - 1);
        this.disponibilidad.lunes = !this.disponibilidad.lunes ? 0 : this.disponibilidad.lunes; 
        this.disponibilidad.martes = !this.disponibilidad.martes ? 0 : this.disponibilidad.martes; 
        this.disponibilidad.miercoles = !this.disponibilidad.miercoles ? 0 : this.disponibilidad.miercoles; 
        this.disponibilidad.jueves = !this.disponibilidad.jueves ? 0 : this.disponibilidad.jueves; 
        this.disponibilidad.viernes = !this.disponibilidad.viernes ? 0 : this.disponibilidad.viernes; 
        this.disponibilidad.sabado = !this.disponibilidad.sabado ? 0 : this.disponibilidad.sabado; 
        this.disponibilidad.domingo = !this.disponibilidad.domingo ? 0 : this.disponibilidad.domingo; 

        this.disponibilidad.lunes = this.disponibilidad.lunes < 0 ? 0 : this.disponibilidad.lunes; 
        this.disponibilidad.martes = this.disponibilidad.martes < 0 ? 0 : this.disponibilidad.martes; 
        this.disponibilidad.miercoles = this.disponibilidad.miercoles < 0 ? 0 : this.disponibilidad.miercoles; 
        this.disponibilidad.jueves = this.disponibilidad.jueves < 0 ? 0 : this.disponibilidad.jueves; 
        this.disponibilidad.viernes = this.disponibilidad.viernes < 0 ? 0 : this.disponibilidad.viernes; 
        this.disponibilidad.sabado = this.disponibilidad.sabado < 0 ? 0 : this.disponibilidad.sabado; 
        this.disponibilidad.domingo = this.disponibilidad.domingo < 0 ? 0 : this.disponibilidad.domingo; 

        this.disponibilidad.lunes = this.disponibilidad.lunes > 86400 ? 86400 : this.disponibilidad.lunes; 
        this.disponibilidad.martes = this.disponibilidad.martes > 86400 ? 86400 : this.disponibilidad.martes; 
        this.disponibilidad.miercoles = this.disponibilidad.miercoles > 86400 ? 86400 : this.disponibilidad.miercoles; 
        this.disponibilidad.jueves = this.disponibilidad.jueves > 86400 ? 86400 : this.disponibilidad.jueves; 
        this.disponibilidad.viernes = this.disponibilidad.viernes > 86400 ? 86400 : this.disponibilidad.viernes; 
        this.disponibilidad.sabado = this.disponibilidad.sabado > 86400 ? 86400 : this.disponibilidad.sabado; 
        this.disponibilidad.domingo = this.disponibilidad.domingo > 86400 ? 86400 : this.disponibilidad.domingo; 

        sentencia = sentencia + ";DELETE FROM " + this.servicio.rBD() + ".disponibilidad WHERE maquina = 0 AND linea = 0;INSERT INTO " + this.servicio.rBD() + ".disponibilidad (linea, maquina, lunes, martes, miercoles, jueves, viernes, sabado, domingo) VALUES(0, 0, " + +this.disponibilidad.lunes + ", " + +this.disponibilidad.martes + ", " + +this.disponibilidad.miercoles + ", " + +this.disponibilidad.jueves + ", " + +this.disponibilidad.viernes + ", " + +this.disponibilidad.sabado + ", " + +this.disponibilidad.domingo + ");";
        if (this.detalle.tema_principal > 0)
        {
          sentencia = sentencia + "UPDATE " + this.servicio.rBD() + ".pu_colores SET obligatorio = 'N';UPDATE " + this.servicio.rBD() + ".pu_colores SET obligatorio = 'S' WHERE id = " + +this.detalle.tema_principal;
        }
        let campos = {accion: 200, sentencia: sentencia};
        this.servicio.consultasBD(campos).subscribe( resp =>
        {})
        this.boton01 = false;
        this.boton02 = false;
        this.bot4Sel = false;
        this.lineaSel = false;
        this.servicio.refrescarLogo.emit(true);
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "La configuración ha sido guardada satisfactoriamente";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.servicio.configurando.emit(true);
      })
    }
  else
    {
      let sentencia = "INSERT INTO " + this.servicio.rBD() + ".licencias (tipo, mmcall, cronos, inicio, licenciado) VALUES ('" + this.tipo + "', '" + this.local + "', '" + this.licencia + "', NOW(), NOW());";
      let campos = {accion: 200, sentencia: sentencia};
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        this.licencia = "";
        this.local = "";
        this.clavePublica = "";
        setTimeout(() => {
          this.txtT1.nativeElement.focus();  
        }, 100);
        
        this.llenarLicencias()
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = "El equipo se ha licenciado satisfactoriamente";
        mensajeCompleto.tiempo = 3000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.servicio.configurando.emit(true);
      })
    }
  }

  selectionChange(event){
    console.log('selection changed using keyboard arrow');
  }

  

  onFileSelected(event)
  {
      this.boton01 = true;
      this.boton02 = true;
      this.editando = true;
      const fd = new FormData();
      fd.append('imagen', event.target.files[0], event.target.files[0].name);
      this.editando = true;
      this.faltaMensaje = "No se han guardado los cambios..."
      this.cancelarEdicion = false;
      this.mensajeImagen = "Campo opcional"
      this.detalle.logo_ruta = this.URL_IMAGENES + event.target.files[0].name;
      this.faltaMensaje = "No se han guardado los cambios..."
      this.detalle.modificacion = null;
      this.detalle.modificado = "";
      this.cancelarEdicion = false;
          

      /** In Angular 5, including the header Content-Type can invalidate your request */
      this.http.post(this.URL_BASE, fd)
      .subscribe(res => {
        console.log(this.URL_BASE);
        console.log(res);
        
          this.faltaMensaje = "No se han guardado los cambios..."
          this.detalle.modificacion = null;
          this.detalle.modificado = "";
          this.cancelarEdicion = false;
          this.mostrarImagenRegistro = "S";
          this.mensajeImagen = "Campo opcional"

          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-normal";
          mensajeCompleto.mensaje = "La imagen fue guardada satisfactoriamente en su servidor";
          mensajeCompleto.tiempo = 3000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        });
  }


cambiando(evento: any)
  {

    if (!this.editando)
    {
      this.boton01 = true;
      this.boton02 = true;
      this.editando = true;
      this.faltaMensaje = "No se han guardado los cambios..."
      this.detalle.modificacion = null;
      this.detalle.modificado = "";
      this.cancelarEdicion = false;
    }
    if (evento.target)
    {
      if (evento.target.name)
      {
        if (evento.target.name == "imagen")
        {
          this.detalle.mostrarImagen = "S";
          this.mensajeImagen = "Campo opcional"
        }
      }
    }
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
    if (this.boton01)
    {
      this.bot4Sel = false;

      this.edicionCancelada();
      this.rConfiguracion()
      }
    }

    llenarListas(arreglo: number, nTabla: string, cadWhere: string)
  {
    let sentencia = "SELECT id, nombre FROM " + nTabla + " " + cadWhere + " ORDER BY nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.listas = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  
  llenarLicencias()
  {
    this.licencias = [];
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".licencias ORDER BY licenciado DESC";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.licencias = resp;
      }
      this.servicio.mensajeInferior.emit(this.licencias.length == 0 ? "No hay equipos licenciados" : this.licencias.length == 1 ? "Hay un equipo licenciado" : this.licencias.length + " equipos licenciados"); 
    }, 
    error => 
      {
        console.log(error)
      })
  }



  llenarEventos()
  {
    let sentencia = "SELECT id, nombre, monitor, alerta, revision FROM " + this.servicio.rBD() + ".int_eventos ORDER BY alerta";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.eventos = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  llenarTemas()
  {
    this.temas = [];
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".pu_colores WHERE personalizada = 'N' AND estatus = 'A' ORDER BY id";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        
        this.temas = resp
        
      }
    }, 
    error => 
      {
        console.log(error)
      })
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

  iniDisp()
  {
    this.disponibilidad.lunes = 86400;
    this.disponibilidad.martes = 86400;
    this.disponibilidad.miercoles = 86400;
    this.disponibilidad.jueves = 86400;
    this.disponibilidad.viernes = 86400;
    this.disponibilidad.sabado = 86400;
    this.disponibilidad.domingo = 86400;
    
  }

  actualizarMapa()
  {

    const respuesta = this.dialogo.open(DialogoComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { titulo: "ACTUALIZACIÓN DE MAPAS", mensaje: "Esta acción <strong>SUMAMENTE DELICADA</strong> actualizará los mapas actuales de la aplicación por la última versión de la presentacón de PowerPoint.<br><br><strong>¿Desea continuar con la operación?</strong><br><br>Asegúrese de que la presentación está guardada en la ruta indicada y que la aplicación esté cerrada", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Actualizar mapas", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_mapa" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        
        if (result.accion == 1) 
        {
          const respuesta = this.dialogo.open(SesionComponent, 
          {
            width: "400px", panelClass: 'dialogo_atencion', data: { tiempo: 10, sesion: 1, rolBuscar: "A", opcionSel: 0, idUsuario: 0, usuario: "", clave: "", titulo: "Confirmación de ADMINISTRADOR", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Ingresar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_sesion" }
          });
          respuesta.afterClosed().subscribe(result => 
          {
            if (result)
            {
              if (result.accion == 1) 
              {
                let sentencia = "UPDATE " + this.servicio.rBD() + ".configuracion SET mapa_solicitud = 'S'";
                let campos = {accion: 200, sentencia: sentencia};
                this.servicio.consultasBD(campos).subscribe( resp =>
                {
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = "Se ha generado una solicitud para la actualización del mapa";
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                })
              }
              else
              {
                let mensajeCompleto: any = [];
                mensajeCompleto.clase = "snack-error";
                mensajeCompleto.mensaje = "No se confirmó la actualización del mapa";
                mensajeCompleto.tiempo = 2000;
                this.servicio.mensajeToast.emit(mensajeCompleto);
              }
            }
            else
            {
              let mensajeCompleto: any = [];
              mensajeCompleto.clase = "snack-error";
              mensajeCompleto.mensaje = "No se confirmó la actualización del mapa";
              mensajeCompleto.tiempo = 2000;
              this.servicio.mensajeToast.emit(mensajeCompleto);
            }
      
          })
        }        
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "No se confirmó la actualización del mapa";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
          }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "No se confirmó la actualización del mapa";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  licenciar()
  {

    const respuesta = this.dialogo.open(LicenciaComponent, {
      width: "520px", panelClass: 'dialogo_atencion', data: { accion: 0  }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result.accion==1)
      {
        this.licenciado = true;
      }  
    })
  }

  alterarPalabraClave()
  {
    let nvaPalabra = ""
    let palabraNueva = "ElViS"
    let ciclo = 0;
    for (var i = 0; i < this.palabraClave.length; i++) 
    {
      
      if (i > 0 && i % 5 == 0)
      {
        nvaPalabra = nvaPalabra + palabraNueva[ciclo];
        ciclo = ciclo + 1
      }
      else
      {
        nvaPalabra = nvaPalabra + this.palabraClave[i];
      }
    } 
    return nvaPalabra;  
  }

  generarClave()
  {
    if (!this.local)
    {
      this.clavePublica = "";
      return;
    }
    else if (this.local == "")
    {
      this.clavePublica = "";
      return;
    }

    this.clavePublica = "";
    let claveInterna = this.alterarPalabraClave();
    let temporal = "";
    let temporal2 = "";
    let numero = "";
    let numero2 = 0;
    let buscarEn = 0;
    let posicion = 0;
    let numeroActual = 0;
    let recorrido = 0;
    if (claveInterna.length > this.local.length)
    
    {
      temporal = "";
      temporal2 = claveInterna;
      
      do
      {
        if (recorrido >= this.clave.length)
        {
          recorrido = 0;
        }
        numero = this.local[recorrido % this.local.length].charCodeAt(0).toString();
        numero2 = +this.clave[recorrido];

        if (numero.length == 1)
        {
          buscarEn = +numero;
          numeroActual = 0;  
        }
        else if (numero.length == 2)
        {
          let numero1 = +numero.substr(0, 1);
          let numero2 = +numero.substr(1);  
          if (numeroActual == 0)
          {
            buscarEn = numero1;
            numeroActual = 1;  
          }
          else
          {
            buscarEn = numero2;
            numeroActual = 0;  
          }
          posicion = numero1 + numero2 + recorrido;
        }
        else if (numero.length == 3)
        {
          let numero1 = +numero.substr(0, 1);
          let numero2 = +numero.substr(1, 1);  
          let numero3 = +numero.substr(2);  
          if (numeroActual == 0)
          {
            buscarEn = numero1;
            numeroActual = 1;  
          }
          else if (numeroActual == 1)
          {
            buscarEn = numero2;
            numeroActual = 2;  
          }
          else 
          {
            buscarEn = numero3;
            numeroActual = 0;  
          }
          posicion = numero1 + numero2 + numero3 + recorrido;
        }
        posicion = posicion + numero2;
        if (posicion > this.clave.length - 1)
        {
          posicion = posicion % this.clave.length
        }
        temporal = (temporal. length == 0 ? this.tipo : "") + temporal + this.clave[posicion];  
        recorrido = recorrido + 1;
      }
      while (temporal.length < claveInterna.length)
      temporal = temporal.substr(0, claveInterna.length);
    }
    else if (claveInterna.length == this.local.length)
    {
      temporal = this.local;
      temporal2 = claveInterna;
    }
    
    else if (this.local.length > claveInterna.length)
    {
      temporal = this.local;
      temporal2 = claveInterna;
      do
      {
        temporal2 = temporal2 + claveInterna;  
      }
      while (temporal2.length < this.local.length)
      temporal2 = temporal2.substr(0, this.local.length);
    }
    let cadComparar = "";
    for (var i = 0; i < temporal.length; i++) 
      {
        let numero = (temporal[i].charCodeAt(0) ^ temporal2[i].charCodeAt(0)).toString();
        if (numero. length == 1)
        {
          cadComparar = numero;
        }
        else if (numero.length == 2)
        {
          cadComparar = numero.substr(1);
        }
        else if (numero.length == 3)
        {
          cadComparar = numero.substr(1, 1);
        }
        this.clavePublica = this.clavePublica + cadComparar; 
      }
  }

  colores()
  {
    const respuesta = this.dialogo.open(TemasComponent, {
      width: "560px", panelClass: 'dialogo_atencion', data: { titulo: "", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Actualizar mapas", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_mapa" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {

        }
      }
    })
  }
  
}

