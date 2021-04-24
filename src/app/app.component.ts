import { Component, ViewChild, AfterContentInit, HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatIconRegistry } from '@angular/material/icon';
import { trigger, style, animate, transition, state } from '@angular/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ServicioService } from './servicio/servicio.service';
import { SesionComponent } from './sesion/sesion.component';
import { DialogoComponent } from './dialogo/dialogo.component';
import { LicenciaComponent } from './licencia/licencia.component';
import { SnackComponent } from './snack/snack.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [trigger('efecto', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)'})),
    state('out', style({ opacity: 0, transform: 'translateY(10px)'})),
    transition('* <=> *', [
      animate(200)
    ])
  ]), 
  [trigger('iconoMenu', [
    state('cerrado', style({ transform: 'rotate(-180deg)'})),
    state('abierto', style({ transform: 'rotate(0deg)'})),
    transition('* <=> *', [
      animate(200)
    ])
  ])],
  [trigger('iconoPin', [
    state('in', style({ opacity: 1, transform: 'translateY(0px)'})),
    state('out', style({ opacity: 0, transform: 'translateY(10px)'})),
    transition('in <=> out', [
      animate(200)
    ])
  ])],
  ]
})

export class AppComponent implements AfterContentInit {
    
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    
    this.calcularPantalla()    
  }


  
//elvis wip
  cadenaEscaneada: string = "";
  cadenaEscaneadaPrint:string = "";
  conEscaner: boolean = false;

//

  iconoBarra: string = "rgba(51, 51, 51)"
  logo_alto: string = "250";
  logo_ancho: string = "250";
  logo_arriba: string = "15";
  logo_izquierda: string = "10";
  opcionSeleccionada: any;

  sinConexion: boolean = false;
  pinEfecto: string = "in";
  verPin: boolean = false;
  autenticado: boolean = false;
  licenciado: boolean = false;
  preguntando: boolean = false;
  verKanban: boolean = false;
  verOEE: boolean = false;
  verSMED: boolean = false;
  cadenaVcto: string = "";
  
  total: number = 0;
  totalD: number = 0;
  totalE: number = 0;
  totalT: number = 0;
  totalG: number = 0;
  totalF: number = 0;

  iconoPin: string = "place";
  abiertoSN: boolean = false;
  verLogo: boolean = true;
  urlCronos: string = "";
  colorSN: string = "";
  logo_ruta: string = "./assets/logo.png";
  logoAplicacion: string = "./assets/icons/sigma.png";
  seleccion: number = 0;
  clareador;
  sufijoEscaner: string = "";
  prefijoEscaner: string = "";
  largoEscaner: number = 3;

  ayuda01: string = "Abre el menú de opciones";
  ayuda02: string = "Opciones de usuario";
  ayuda03: string = "Fija la barra de menú";
  ayuda04: string = "Sin conexión a la base de datos";
  ayuda05: string = "Esperando lectura del escaner";
  ayuda06: string = "Cambiar la apariencia";
  ayuda07: string = "Ocultar la barra de funciones";
  ayuda08: string = "Cambio de turno";

  direccion: string = "cerrado";
  pinDireccion: string = "normal";

  mUsuario: boolean = false;
  cambiarTema: boolean = true;
  cambiarTurno: boolean = true;
  turnoActual: string = "";
  temaPrincipal: number = 0;
  opcionOriginal: number = 0;
  hover: boolean = false;
  procesando: boolean = false;
  hov = [];
  alto_opciones: number = 0;
  alto_resto: number = 0;

  ayudaInferior: string = "Se requiere inicio de sesión...";    
  posMenu: string = "cerrado";  
  botonMenu: boolean = false;  
  configuracion: any = [];
  minuto: number = 0;
  miVista: number = 0;
  pantalla: number = 0;
  verProceso: boolean = false;
  modoSN: string = "side";
  verIrArriba: boolean = false;
  verCronos: boolean = false;
  offSet: number;
  contadorSeg: number = 59;
  estacion: string = "Refrescar beepers";
  estacionIcono: string = "./assets/icons/refrescar.svg";
  cerrar_al_ejecutar: boolean = false;
  temaActual: number = 0;
  

  iconoCronos: string = "./assets/icons/cronos.png";
  hora: any =  new Date();
  isHandset: boolean = false;
  ayudaSuperior: string = "";
  
  irArribaTT: string = "Ir al tope de la lista"
  cambioClave: string = "Cambiar contraseña..."
  cerrarSesion: string = "Cerrar la seisón";
  
  usuarioActual: string = "Invitado";
  perfilActual: any = [];
  temasUsuario: any = [];
  primerNombre: string = "";

  estado: string = "";  
  version: string = "LogistiCAR v1.15 16Mar21"
  verBarra: boolean = false;
  verPie: boolean = true;
  iconoHamburguesa: string = "i_menu";
  menuHamburguesaTT: string  = "Abrir panel de opciones";
  configTT: string  = "Configurar correo base";
  cronometro: any;
  tiempoLectura: number = 2000;
  errorBE: string = "";


  colorBaseOrigen: string = "B";
  colorFondoCbecera = "";
  colorBase: string = "#FFFFFF";
  colorBarraSuperior: string = "";
  colorBotonMenu: string = ""
  colorPie: string = "";
  colorCuerpo: string = "";
  colorLetrasTitulo: string = "";
  colorLetrasPanel: string = "";
  colorLetrasBox: string = "";
  colorFondoCabecera = "";
  colorPanelImportante: string = "";
  colorLetrasPie: string = "";
  colorIconoNormal: string = "";
  colorIconoInhabilitado: string = "";
  colorFondoLogo: string = "";
  colorFondo: string = "";
  colorPanel: string = "";
  colorTransparente: string = "transparent";
  colorFondoMenu: string = "";
  
  
  constructor
  (  
    public snackBar: MatSnackBar, 
    public scroll: ScrollDispatcher,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer, 
    private router: Router, 
    private breakpointObserver: BreakpointObserver,
    private servicio: ServicioService,
    public dialog: MatDialog, 
    ) 
    {
    //Iconos propios  
      this.servicio.activarSpinner.subscribe((data: any)=>
      {
        this.verProceso = data
      });

      this.servicio.activarSpinnerSmall.subscribe((data: any)=>
      {
        this.procesando = data
      });

      this.servicio.refrescarLogo.subscribe((data: any)=>
      {
        this.mostrarLogo();
      });


      this.servicio.mostrarBmenu.subscribe((accion: number)=>
      {
        this.botonMenu = accion > 0 ;
        if (this.botonMenu)
          {
            this.posMenu = accion == 1 ? "cerrado" : "abierto";
            this.posMenu = (this.posMenu == "cerrado" ? "abierto" : "cerrado");
            this.ayuda07  = (this.posMenu == "abierto" ? "Ocultar la barra de funciones" : "Visualizar la barra de funciones");
          }
      });

      this.servicio.cierreSnack.subscribe((accion: boolean)=>
      {
        if (!accion && this.snackBar)
        {
          this.snackBar.dismiss();
        }
        
      });

      //elvis wip

      this.servicio.listoEscanear.subscribe((val) => {
        this.conEscaner = val;
    })

    this.router.events.subscribe((val) => {
      //Se valida que exista el usuario
      if (this.router.url.substr(0, 12) != "/operaciones")
      {
        this.servicio.aEscanear(false);
        this.cadenaEscaneada = "";
        this.cadenaEscaneadaPrint = "";
        if (this.cronometro)
        {
          clearTimeout(this.cronometro); 
        }
      }
    })

      //


      
      this.servicio.rSesion.subscribe((data: any)=>
      {
        this.recuperarSesion()
      });

      iconRegistry.addSvgIcon("pin", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pin.svg'));
      iconRegistry.addSvgIcon("desconexion", sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/desconexion.svg'));
      iconRegistry.addSvgIcon('i_chofer', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_chofer.svg'));
      iconRegistry.addSvgIcon('i_camion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_camion.svg'));
      iconRegistry.addSvgIcon('i_excel', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_excel.svg'));
      iconRegistry.addSvgIcon('i_localizacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_localizacion.svg'));
      iconRegistry.addSvgIcon('i_dispositivos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_dispositivos.svg'));
      iconRegistry.addSvgIcon('i_buscar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_buscar.svg'));
      iconRegistry.addSvgIcon('i_transporte', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_transporte.svg'));
      iconRegistry.addSvgIcon('i_espera', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_espera.svg'));
      iconRegistry.addSvgIcon('i_menu', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_menu.svg'));
      iconRegistry.addSvgIcon('i_movil', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_movil.svg'));
      iconRegistry.addSvgIcon('i_lotes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_lotes.svg'));
      iconRegistry.addSvgIcon('i_procesos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_procesos.svg'));
      iconRegistry.addSvgIcon('i_changes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_changes.svg'));
      iconRegistry.addSvgIcon('i_sensor', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_sensor.svg'));
      iconRegistry.addSvgIcon('i_alertas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_alertas.svg'));
      iconRegistry.addSvgIcon('i_alarmas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_alarmas.svg'));
      iconRegistry.addSvgIcon('i_cerrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cerrar.svg'));
      iconRegistry.addSvgIcon('i_user', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_user.svg'));
      iconRegistry.addSvgIcon('i_sesion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_sesion.svg'));
      iconRegistry.addSvgIcon('i_pin', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_pin.svg'));
      iconRegistry.addSvgIcon('i_info', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_info.svg'));
      iconRegistry.addSvgIcon('i_carrusel', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_carrusel.svg'));
      iconRegistry.addSvgIcon('i_mapa', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_mapa.svg'));
      iconRegistry.addSvgIcon('i_produccion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_produccion.svg'));
      iconRegistry.addSvgIcon('i_correos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_correos.svg'));
      iconRegistry.addSvgIcon('i_reloj', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reloj.svg'));
      iconRegistry.addSvgIcon('i_reloj2', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reloj2.svg'));
      iconRegistry.addSvgIcon('i_recipiente', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_recipiente.svg'));
      iconRegistry.addSvgIcon('i_mantenimiento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_mantenimiento.svg'));
      iconRegistry.addSvgIcon('i_nuevo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_nuevo.svg'));
      iconRegistry.addSvgIcon('i_operacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_operacion.svg'));
      iconRegistry.addSvgIcon('i_falla', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_falla.svg'));
      iconRegistry.addSvgIcon('i_lineas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_lineas.svg'));
      iconRegistry.addSvgIcon('i_responsable', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_responsable.svg'));
      iconRegistry.addSvgIcon('i_maquina', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_maquina.svg'));
      iconRegistry.addSvgIcon('i_llamada', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_llamada.svg'));
      iconRegistry.addSvgIcon('i_ti', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ti.svg'));
      iconRegistry.addSvgIcon('i_calidad', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_calidad.svg'));
      iconRegistry.addSvgIcon('i_ingenieria', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ingenieria.svg'));
      iconRegistry.addSvgIcon('in_cerrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_cerrar.svg'));
      iconRegistry.addSvgIcon('in_arriba', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_arriba.svg'));
      iconRegistry.addSvgIcon('in_seleccionado', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_seleccionado.svg'));
      iconRegistry.addSvgIcon('in_seleccionado_vacio', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_seleccionado_vacio.svg'));
      iconRegistry.addSvgIcon('in_detener', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_detener.svg'));
      iconRegistry.addSvgIcon('in_pregunta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_pregunta.svg'));
      iconRegistry.addSvgIcon('in_cancelar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_cancelar.svg'));
      iconRegistry.addSvgIcon('i_expandir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_expandir.svg'));
      iconRegistry.addSvgIcon('i_reducir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reducir.svg'));
      iconRegistry.addSvgIcon('in_mensaje', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/in_mensaje.svg'));
      iconRegistry.addSvgIcon('i_tecnicos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_tecnicos.svg'));
      iconRegistry.addSvgIcon('i_revisando', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_revisando.svg'));
      iconRegistry.addSvgIcon('i_guardar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_guardar.svg'));
      iconRegistry.addSvgIcon('i_ok', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ok.svg'));
      iconRegistry.addSvgIcon('i_alerta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_alerta.svg'));
      iconRegistry.addSvgIcon('i_password', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_password.svg'));
      iconRegistry.addSvgIcon('i_seleccion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_seleccion.svg'));
      iconRegistry.addSvgIcon('i_ver', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_ver.svg'));
      iconRegistry.addSvgIcon('i_voz', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_voz.svg'));
      iconRegistry.addSvgIcon('i_vdetalle', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_vdetalle.svg'));
      iconRegistry.addSvgIcon('i_vcuadro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_vcuadro.svg'));
      iconRegistry.addSvgIcon('i_horarios', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_horarios.svg'));
      iconRegistry.addSvgIcon('i_grafica', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_grafica.svg'));
      iconRegistry.addSvgIcon('i_salir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_salir.svg'));
      iconRegistry.addSvgIcon('i_andon', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_andon.svg'));
      iconRegistry.addSvgIcon('i_descarga', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_descarga.svg'));
      iconRegistry.addSvgIcon('i_catalogo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_catalogos.svg'));
      iconRegistry.addSvgIcon('i_operaciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_operaciones.svg'));
      iconRegistry.addSvgIcon('i_reportes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_reportes.svg'));
      iconRegistry.addSvgIcon('i_partes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_partes.svg'));
      iconRegistry.addSvgIcon('i_configuracion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_configuracion.svg'));
      iconRegistry.addSvgIcon('i_paleta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_paleta.svg'));
      iconRegistry.addSvgIcon('i_refrescar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_refrescar.svg'));
      iconRegistry.addSvgIcon('i_descargar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_descargar.svg'));
      iconRegistry.addSvgIcon('i_agregar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_add.svg'));
      iconRegistry.addSvgIcon('i_regresar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_regresar.svg'));
      iconRegistry.addSvgIcon('i_inactivar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inactivar.svg'));
      iconRegistry.addSvgIcon('i_abrir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_abrir.svg'));
      iconRegistry.addSvgIcon('i_editar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_editar.svg'));
      iconRegistry.addSvgIcon('i_copiar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_copiar.svg'));
      iconRegistry.addSvgIcon('i_init', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_init.svg'));
      iconRegistry.addSvgIcon('i_eliminar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_eliminar.svg'));
      iconRegistry.addSvgIcon('i_cancelar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cancelar.svg'));
      iconRegistry.addSvgIcon('i_edicion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_edicion.svg'));
      iconRegistry.addSvgIcon('i_verMenu', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_verMenu.svg'));
      iconRegistry.addSvgIcon('i_cambio', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cambio.svg'));
      iconRegistry.addSvgIcon('i_cerrarsesion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_cerrarsesion.svg'));
      iconRegistry.addSvgIcon('i_tiempofallas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_tiempofallas.svg'));
      iconRegistry.addSvgIcon('i_finalizado', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_finalizado.svg'));
      iconRegistry.addSvgIcon('i_tiemporeparacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_tiemporeparacion.svg'));
      iconRegistry.addSvgIcon('i_pareto', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_pareto.svg'));
      iconRegistry.addSvgIcon('i_filtro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_filtro.svg'));
      iconRegistry.addSvgIcon('i_formato', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_formato.svg'));
      iconRegistry.addSvgIcon('i_izquierda', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_izquierda.svg'));
      iconRegistry.addSvgIcon('i_derecha', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_derecha.svg'));
      iconRegistry.addSvgIcon('i_bajar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_bajar.svg'));
      iconRegistry.addSvgIcon('i_general', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_general.svg'));
      iconRegistry.addSvgIcon('i_parametros', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_parametros.svg'));
      iconRegistry.addSvgIcon('i_grupos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_grupos.svg'));
      iconRegistry.addSvgIcon('i_evento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_evento.svg'));
      iconRegistry.addSvgIcon('i_traductor', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_traductor.svg'));
      iconRegistry.addSvgIcon('i_turnos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_turnos.svg'));
      iconRegistry.addSvgIcon('i_recuperar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_recuperar.svg'));
      iconRegistry.addSvgIcon('i_politicas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_politicas.svg'));
      iconRegistry.addSvgIcon('i_licencia', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_licencia.svg'));
      iconRegistry.addSvgIcon('i_oee', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_oee.svg'));
      iconRegistry.addSvgIcon('i_inicializar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inicializar.svg'));
      iconRegistry.addSvgIcon('i_proseguir', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_proseguir.svg'));
      iconRegistry.addSvgIcon('i_paro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_paro.svg'));
      iconRegistry.addSvgIcon('i_fijar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_fijar.svg'));
      iconRegistry.addSvgIcon('i_documento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_documento.svg'));
      iconRegistry.addSvgIcon('i_rates', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_rates.svg'));
      iconRegistry.addSvgIcon('i_estimados', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_estimados.svg'));
      iconRegistry.addSvgIcon('i_objetivos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_objetivos.svg'));
      iconRegistry.addSvgIcon('i_masivo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_masivo.svg'));
      iconRegistry.addSvgIcon('i_rutas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_rutas.svg'));
      iconRegistry.addSvgIcon('i_situaciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_situaciones.svg'));
      iconRegistry.addSvgIcon('i_prioridades', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_prioridades.svg'));
      iconRegistry.addSvgIcon('i_inventario', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inventario.svg'));
      iconRegistry.addSvgIcon('i_flujo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_flujo.svg'));
      iconRegistry.addSvgIcon('i_programacion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_programacion.svg'));
      iconRegistry.addSvgIcon('i_rechazo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_rechazo.svg'));
      iconRegistry.addSvgIcon('i_inspeccion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/i_inspeccion.svg'));
      this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
      });
      this.reloj();
      this.servicio.mensajeSuperior.subscribe((mensaje: any)=>
      {
        this.ayudaSuperior = mensaje
      });
      this.servicio.salir.subscribe((val) => 
      {
        const respuesta = this.dialog.open(DialogoComponent, {
          width: "500px", panelClass: 'dialogo_atencion', data: { titulo: "LA APLICACIÓN FINALIZARÁ", mensaje: val, id: 0, accion: 0, tiempo: 9, botones: 2, boton1STR: "Aplicar una licencia", icono1: "i_licencia", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_salir" }
        });
        respuesta.afterClosed().subscribe(result => 
        {
          if (result)
          {
            if (result.accion == 1)
            {
              const respuesta = this.dialog.open(LicenciaComponent, {
                width: "520px", panelClass: 'dialogo_atencion', data: {  }
              });
              respuesta.afterClosed().subscribe(result => 
              {
                if (result)
                {
                  if (result.accion==2)
                  {
                    this.salida(val);
                    return;
                  }  
                }
                else
                {
                  this.salida(val);
                  return;
                }
              })
            }
            else
            {
              this.salida(val)  
              return;
            }
          }
          else
          {
            this.salida(val)
            return;
          }
        })
        return;
      });
      this.servicio.vencimiento.subscribe((val: string) => 
      {
        this.licenciado = this.servicio.rLicenciado();
        const respuesta = this.dialog.open(DialogoComponent, {
          width: "500px", panelClass: 'dialogo_atencion', data: { titulo: "LICENCIA DEMOSTRATIVA", mensaje: val.substr(1), id: 0, accion: 0, tiempo: 9, botones: 1, boton1STR: "Aceptar", icono1: "in_seleccionado", boton2STR: "", icono2: "", icono0: "i_salir" }
        });
        if (this.servicio.rEsDemo())
        {
          this.version = "logistiCAR D(" + this.servicio.rVctoDemo() + ")"; 
          this.cadenaVcto =  " vence: " + this.servicio.rVctoDemo()
        }
        else
        {
          this.cadenaVcto =  "";
        }
      });

      this.servicio.valida.subscribe((val) => 
      {
        this.licenciado = this.servicio.rLicenciado();
        if (this.servicio.rEsDemo())
        {
          this.version = "logistiCAR D(" + this.servicio.rVctoDemo() + ")";  
          this.cadenaVcto =  " vence: " + this.servicio.rVctoDemo()
        }
        else
        {
          this.cadenaVcto =  "";
        }
        
  });

      

      this.router.events.subscribe((val) => {
        //Se valida que exista el usuario
          
        this.servicio.mensajeSuperior.emit("");
          if (this.cronometro)
          {
            clearTimeout(this.cronometro); 
          }
      })

      this.servicio.sinConexion.subscribe((dato: boolean)=>
      {
        this.sinConexion = dato;
      });

      this.servicio.mensajeInferior.subscribe((mensaje: any)=>
      {
        this.ayudaInferior = mensaje
      });
      this.servicio.configurando.subscribe((mensaje: any)=>
      {
        this.rConfiguracion();
      });
      this.servicio.mensajeToast.subscribe((mensaje)=>{
        this.toast(mensaje.clase, mensaje.mensaje, mensaje.tiempo)
      });
      this.router.navigateByUrl('/vacio');
      this.rConfiguracion();
      this.calcularPantalla();
      this.rOpciones();
      this.accion(0);
      this.hov.length = 40;
    }
  
  @HostListener('document:keypress', ['$event']) onKeypressHandler(event: KeyboardEvent) 
  {
    if (event.keyCode == 27)
    {
    }
    else if (!event.ctrlKey && !event.altKey)
    {
      
    }
  }


    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) 
  {

//elvis wip
if (event.keyCode == 27)
    {
      this.cadenaEscaneada = "" ;
      setTimeout(() => {
        this.cadenaEscaneadaPrint = "" ;
      }, 1000);
      if (this.cronometro)
      {
        clearTimeout(this.cronometro); 
      }
      this.servicio.teclaEscape.emit(true);
    }
    else if (!event.ctrlKey && !event.altKey)
    {
      if (this.servicio.rEscanear() && event.keyCode > 20) 
      {
        if (this.clareador)
        {
          clearTimeout(this.clareador);  
        }
        if (this.cadenaEscaneada.length==0)
        {
          this.cronometro = setTimeout(() => {
          if (this.cadenaEscaneada.length>0)
          {
            let completo: boolean = true;
            if (this.prefijoEscaner)
            {
              completo = this.cadenaEscaneada.substr(0, this.prefijoEscaner.length) == this.prefijoEscaner;
            }
            if (this.sufijoEscaner && completo)
            {
              completo = (this.cadenaEscaneada.length > this.prefijoEscaner.length) && (this.cadenaEscaneada.substr(this.cadenaEscaneada.length - this.sufijoEscaner.length, this.sufijoEscaner.length) == this.sufijoEscaner);
            }
            if (completo)
            {
              completo = this.cadenaEscaneada.length > this.prefijoEscaner.length + this.sufijoEscaner.length
            }
            if (completo)
            {
              completo = this.largoEscaner > 0 && this.cadenaEscaneada.length >= this.largoEscaner || this.largoEscaner == 0   
            }
            if (completo)
            {
              this.servicio.escaneado.emit(this.cadenaEscaneada.substr(this.prefijoEscaner.length, this.cadenaEscaneada.length - this.prefijoEscaner.length - this.sufijoEscaner.length));
            }
            else
            {
              this.cadenaEscaneadaPrint="Lectura incompleta o incongruente"
            }
            this.cadenaEscaneada = "";
            this.iniciarImpreso();
          }
          }, this.tiempoLectura);
        }
        this.cadenaEscaneada = this.cadenaEscaneada + String.fromCharCode(event.keyCode);
        this.cadenaEscaneadaPrint = this.cadenaEscaneada;
      }
    }
//



    if (event.ctrlKey  && (event.keyCode == 66 || event.keyCode == 98))
    {
      this.buscar()
    }

    else if (event.shiftKey  && event.keyCode == 117)
    {
      this.servicio.teclaProceso.emit(true);
    }

    else if (event.shiftKey  && event.keyCode == 113)
    {
      this.servicio.teclaResumen.emit(true);
    }

    else if (event.ctrlKey  && event.keyCode == 123)
    {
      this.servicio.verProgramador.emit(true);
    }

    else if (event.keyCode == 119)
    {
      this.verMenu();
    }

    else if (event.keyCode == 118)
    {
      this.cambiarVista()
    }

    else if (event.ctrlKey  && (event.keyCode == 123 || event.keyCode == 123))
    {

    }

    else if (event.keyCode == 27)
    {
      this.servicio.teclaEscape.emit(true);
    }

    else if (event.keyCode == 113)
    {
      this.menuIzquierdo();
    }
  }
  
  @ViewChild('barraIzquierda', { static: true }) sidenav: MatSidenav;
  scrollingSubscription: Subscription;
  verMenuSuperior: boolean = true;

  ngAfterContentInit() {
    this.estado="in";
    this.router.navigateByUrl('/vacio');
    //this.recuperar(1, 21);
    this.temas(0); 
    this.revBE();   
  }

  iniciarImpreso()
  {
    if (this.cronometro)
    {
      clearTimeout(this.cronometro);  
    }
    this.clareador = setTimeout(() => {
      this.cadenaEscaneadaPrint = "" ;  
      
    }, 2000);
  }


  calcularPantalla()
  {
    this.servicio.aPantalla({ alto: window.innerHeight, ancho: window.innerWidth });
    this.alto_opciones = window.innerHeight - 165;
    if (window.innerWidth <= 600 && !this.isHandset)
    {
      this.isHandset = true;
      this.servicio.esMovil.emit(this.isHandset);
      this.servicio.aMovil(this.isHandset);
      if (this.sidenav)
      {
        if (this.sidenav.opened)
        {
          this.menuIzquierdo();
        }
        
      }
    } 
    else if (window.innerWidth > 600 && this.isHandset)
    {
      this.isHandset = false;
      this.servicio.esMovil.emit(this.isHandset);
      this.servicio.aMovil(this.isHandset);
    }
    this.alto_resto = window.innerHeight - (window.innerHeight < 250 ? 94 : 93);
    this.servicio.cambioPantalla.emit(false);
  }

  buscar()
  {
    this.servicio.teclaBuscar.emit(true);
  }

  cambiarVista()
  {     
    this.servicio.teclaCambiar.emit(true);
  }


escapar()
{
  this.buscar()
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
        this.verLogo = resp[0].ver_logo_cronos == "S";     
        this.urlCronos = resp[0].url_cronos;     
        this.logo_ruta = resp[0].logo_ruta; 
        if (!this.logo_ruta)
        {
          this.logo_ruta = "./assets/logo_general.png"
          this.logo_alto  = resp[0].logo_alto;
          this.logo_ancho = resp[0].logo_ancho;
          this.logo_arriba  = resp[0].logo_arriba;
          this.logo_izquierda = resp[0].logo_izquierda;
        }
        else
        {
          this.logo_alto  = resp[0].logo_alto;
          this.logo_ancho = resp[0].logo_ancho;
          this.logo_arriba  = resp[0].logo_arriba;
          this.logo_izquierda = resp[0].logo_izquierda;
        }
        

        this.servicio.aConfig(resp[0]); 
        this.configuracion = resp[0];
        //this.accion(0);
        this.cambiarTema = resp[0].tema_permitir_cambio == "S"
        this.cambiarTurno = resp[0].turno_modo == 0 && this.servicio.rUsuario().turno == 0
        if (resp[0].tema_permitir_cambio == "S")
        {
          this.llenarTemas();
        }
        if (+resp[0].tema_principal > 0)
        {
          this.temaPrincipal = resp[0].tema_principal
        }
      }
      
    }, 
    error => 
      {
        console.log(error)
      })
  }

  rOpciones()
  {
    this.verKanban = false;
    this.verOEE = false;
    this.verSMED = false;
    
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".int_opciones";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        for (var i = 0; i < resp.length; i++)
        {
          if (resp[i].opcion_app == 12 && resp[i].visualizar == 'S' && resp[i].estatus == 'A')
          {
            this.verKanban = true;
          }
          if (resp[i].opcion_app == 13 && resp[i].visualizar == 'S' && resp[i].estatus == 'A')
          {
            this.verOEE = true;
          }
          if (resp[i].opcion_app == 13 && resp[i].visualizar == 'S' && resp[i].estatus == 'A')
          {
            this.verSMED = true;
          }
        }
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  mostrarLogo()
  {
    
    let sentencia = "SELECT logo_ruta, logo_arriba, logo_ancho, logo_alto, logo_izquierda FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
            
        this.logo_ruta = resp[0].logo_ruta; 
        if (!this.logo_ruta)
        {
          this.logo_ruta = "./assets/logo_general.png"
          this.logo_alto  = resp[0].logo_alto;
          this.logo_ancho = resp[0].logo_ancho;
          this.logo_arriba  = resp[0].logo_arriba;
          this.logo_izquierda = resp[0].logo_izquierda;
        }
        else
        {
          this.logo_alto  = resp[0].logo_alto;
          this.logo_ancho = resp[0].logo_ancho;
          this.logo_arriba  = resp[0].logo_arriba;
          this.logo_izquierda = resp[0].logo_izquierda;
        }
      }
      
    }, 
    error => 
      {
        console.log(error)
      })
  }
  
  irArriba() {
    window.requestAnimationFrame(this.irArriba);
    document.querySelector('[cdkScrollable]').scrollTop = 0;    
  }

  miScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
     if (scrollTop < 5) {
      this.verIrArriba = false
    }
     else {
      this.verIrArriba = true
    }

    this.offSet = scrollTop;
  }

  getState(outlet){
    return outlet.activatedRouteData.state;
  }
  
  toast(clase: string, mensaje: string, duracion: number) {

    this.snackBar.openFromComponent(SnackComponent, {
      data: {mensaje: mensaje},
      panelClass: [clase],
      duration: duracion
    });

  }

  menuIzquierdo() 
  {
    
    this.sidenav.toggle();
    
    if (!this.sidenav.opened)
    {
      this.servicio.aAnchoSN(0);
      this.iconoHamburguesa="i_menu";
      this.menuHamburguesaTT = "Abrir panel de opciones";
      this.direccion = "abierto"
      this.pinEfecto = "out";
      setTimeout(() => {
        this.verPin = false;
      }, 200);
    }
    else 
    {
      if (this.modoSN=="side")
      {
        this.servicio.aAnchoSN(300);  
      }
      else
      {
        this.servicio.aAnchoSN(0);
      }
      this.iconoHamburguesa="i_cerrar";
      this.menuHamburguesaTT = "Cerrar el panel de opciones";
      this.direccion = "cerrado"
      //this.verPin = true;
      this.verPin = !this.isHandset;
      this.pinEfecto = "in";
    }
    this.servicio.cambioPantalla.emit(!this.sidenav.opened);
  }

    reloj()
    {
      setInterval(() => {
        this.hora = new Date();
        this.servicio.cadaSegundo.emit(true);
        this.calcularTotales()
        //this.moverTurno();
      }, 1000);
    }

    sugerirTurno(turno: number)
    {
      let titulo = "CAMBIO DE TURNO";
      if (this.servicio.rConfig().turno_modo == 1)
      {
        titulo = titulo + " SUGERIDO";
      }
      else if (this.servicio.rConfig().turno_modo == 2)
      {
        titulo = titulo + " OBLIGATORIO";
      }
      const respuesta = this.dialog.open(DialogoComponent, 
      {
        width: "480px", panelClass: 'dialogo', data: { mensaje: "", sesion: 1, titulo: titulo, alto: "90", id: turno, accion: 0, botones: 2, boton1STR: "Ingresar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_turnos" }
      });
      respuesta.afterClosed().subscribe(result => 
      {
        if (result)
        {
          this.preguntando = false;
          if (result.accion == 1) 
          {
            let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_turnos WHERE id = " + result.idTurno;
            let campos={accion: 100, sentencia: sentencia};  
            this.servicio.consultasBD(campos).subscribe(resp =>
            {
                let miTurno={id: resp[0].id, inicia: resp[0].inicia, termina: resp[0].termina, mover: resp[0].mover, nombre: resp[0].nombre, secuencia: resp[0].secuencia };
                this.servicio.aTurno(miTurno);
                this.turnoActual = resp[0].nombre;
                this.toast('snack-normal', 'Se ha realizado un cambio al turno ' + resp[0].nombre, 2000 );
                this.servicio.cambioTurno.emit(true);
            })
          }
          else
          {
            let mensajeCompleto: any = [];
            mensajeCompleto.clase = "snack-error";
            mensajeCompleto.mensaje = "Cambio de turno cancelado";
            mensajeCompleto.tiempo = 2000;
            this.servicio.mensajeToast.emit(mensajeCompleto);
          }
        }
        else
        {
          this.preguntando = false;
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "Cambio de turno cancelado";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      });
    }
    
    moverTurno() {
      if (!this.autenticado || !this.licenciado)
      {
        return;
      }
      if (this.servicio.rUsuario().turno > 0 && this.servicio.rUsuario().turno != this.servicio.rTurno().id)
      {
        let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_turnos WHERE id = " + this.servicio.rUsuario().turno;
        let campos={accion: 100, sentencia: sentencia};  
        this.servicio.consultasBD(campos).subscribe(resp =>
        {
          if (resp.length > 0)
          {
            let miTurno={id: resp[0].id, inicia: resp[0].inicia, termina: resp[0].termina, mover: resp[0].mover, nombre: resp[0].nombre, secuencia: resp[0].secuencia };
            this.servicio.aTurno(miTurno);
            this.turnoActual = resp[0].nombre;
            this.toast('snack-normal', 'Se ha realizado un cambio al turno ' + resp[0].nombre, 2000 );
            this.servicio.cambioTurno.emit(true);
          }
        })
        return;
      }
      else if (this.servicio.rUsuario().turno > 0)
      {
        return;
      }
      if (this.servicio.rConfig().turno_modo == 0 && this.servicio.rTurno().id == 0 && this.preguntando) 
      {
        this.preguntando = true;
        this.sugerirTurno(0);
        return;
      }
      if (this.contadorSeg < 60)
      {
        this.contadorSeg = this.contadorSeg + 1;
        return;
      }
      this.contadorSeg = 0;
      //Cada 30 segundos se evaluan algunas cosas
      let hora = this.servicio.fecha(1, "", "HH:mm:ss");
      let tBuscar = this.servicio.rTurno().id;
      let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_turnos WHERE estatus = 'A' AND (inicia <= '" + hora + "' OR termina >= '" + hora + "') AND id <> " + tBuscar + " ORDER BY inicia, termina";
      let campos={accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe((data2: any []) =>
      {
        if (data2) 
        {
          let hayUno = false;
          for (var i = 0; i < data2.length; i++) 
          {
            if (hora >= data2[i].inicia && hora <= data2[i].termina)
            {
              if (this.servicio.rConfig().turno_modo == 3)
              {
                hayUno= true;
                let miTurno={id: data2[i].id, inicia: data2[i].inicia, termina: data2[i].termina, mover: data2[i].mover, nombre: data2[i].nombre, secuencia: data2[i].secuencia };
                this.servicio.aTurno(miTurno);
                this.turnoActual = data2[i].nombre;
                this.toast('snack-normal', 'Se ha realizado un cambio al turno ' + data2[i].nombre, 2000 );
                this.servicio.cambioTurno.emit(true);
              }
              else
              {
                this.sugerirTurno(data2[i].id);
              }
            }
          }
          if (!hayUno)
          {
            for (var i = 0; i < data2.length; i++) 
            {
            if ((hora >= data2[i].inicia || hora <= data2[i].termina) && data2[i].termina < data2[i].inicia)
            {
              if (this.servicio.rConfig().turno_modo == 3)
              {
                hayUno= true;
                let miTurno={id: data2[i].id, inicia: data2[i].inicia, termina: data2[i].termina, mover: data2[i].mover, nombre: data2[i].nombre, secuencia: data2[i].secuencia };
                this.servicio.aTurno(miTurno);
                this.turnoActual = data2[i].nombre;
                this.toast('snack-normal', 'Se ha realizado un cambio al turno ' + data2[i].nombre, 2000 );
                this.servicio.cambioTurno.emit(true);
              }
              else
              {
                this.sugerirTurno(data2[i].id);
              }
            }
          }
        }
  }
    });
  }

revBE()
{
  setTimeout(() => {
    let sentencia = "SELECT ultima_actualizacion FROM " + this.servicio.rBD() + ".configuracion";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.errorBE = "";
      if (resp.length > 0)
      {
        if (resp[0].ultima_actualizacion)
        {
          let segundos =  this.servicio.tiempoTranscurrido(resp[0].ultima_actualizacion, "S").split(";");
          if (+segundos[3] > 20)
          {
            if (+segundos[3] < 3600)
            {
              this.errorBE = "Revisar backend (" + Math.floor(+segundos[3] / 60) + " min)";
            }
            else if (+segundos[3] < 86400)
            {
              this.errorBE = "Revisar backend (" + Math.floor(+segundos[3] / 3600) + " hr)";
            }
            else
            {
              this.errorBE = "Revisar backend (" + resp[0].ultima_actualizacion + ")";
            }

          }
        }
      }
      this.revBE();
    });
    
  }, 10000);
}
    
cerrarSalir()
{
  if (this.cerrar_al_ejecutar)
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="i_menu";
        this.menuHamburguesaTT = "Abrir panel de opciones";
      }, 400);
      
    }
    if (this.pantalla>0)
    {
      let consulta = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET ultima_pantalla = " + this.pantalla + " WHERE id = " + this.servicio.rUsuario().id;
      let campos = {accion: 2000, consulta: consulta};  
      this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      })
    }
}

  irCronos() {
    window.open("http://www.mmcallmexico.mx/  ", "_blank");
  }

recuperar(id: number)
{
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".cat_usuarios WHERE id = " + id
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( registro =>
  {
    if (registro && registro.length>0)
      {

      this.servicio.aUsuario(registro[0])
      if (registro[0].politica > 0)
        {
          let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".politicas WHERE id = " + registro[0].politica;
          let campos = {accion: 100, sentencia: sentencia};  
          this.servicio.consultasBD(campos).subscribe( resp =>
          {
            if (resp.length > 0)
            {
              this.cambiarTurno = this.configuracion.turno_modo == 0 && this.servicio.rUsuario().turno == 0
              if (resp[0].deunsolouso == "S")
              {
                let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET estatus = 'Y' WHERE id = " + id;
                let campos = {accion: 200, sentencia: sentencia};  
                this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
                  let mensajeCompleto: any = [];
                  mensajeCompleto.clase = "snack-error";
                  mensajeCompleto.mensaje = "El usuario se ha configurado para usar sólo esta sesión";
                  mensajeCompleto.tiempo = 2000;
                  this.servicio.mensajeToast.emit(mensajeCompleto);
                })
                this.autenticado = true;
              }
              else if (resp[0].vence == "S")
              {
                let diferencia = ((new Date().getTime() - new Date(registro[0].ucambio).getTime()) / (1000 * 24 * 60 * 60) - 1).toFixed(0) ;
                if ((+diferencia >= +resp[0].diasvencimiento && +resp[0].diasvencimiento > 0) || !registro[0].ucambio)
                {
                  const respuesta = this.dialog.open(DialogoComponent, {
                    width: "460px", panelClass: 'dialogo_atencion', data: { titulo: "CONTRASEÑA VENCIDA", mensaje: "Su contraseña ha vencido. Es necesario que la actualice para continuar operando el sistema.", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Actualizar", icono1: "in_seleccionado", boton2STR: "Finalizar sesión", icono2: "i_salir", icono0: "i_cambio" }
                  });
                  respuesta.afterClosed().subscribe(result => 
                  {
                    if (result)
                    {
                      if (result.accion == 1) 
                      {
                        this.cambiarClave(1);
                      }
                      else
                      {
                        this.cierreSesion();
                      }
                    }
                    else
                    {
                      this.cierreSesion();
                    }
                  })
                }
                else if (((+resp[0].diasvencimiento - (+diferencia)) <= +resp[0].aviso && +resp[0].aviso > 0 && +resp[0].diasvencimiento > 0))
                {
                  const respuesta = this.dialog.open(DialogoComponent, {
                    width: "460px", panelClass: 'dialogo_atencion', data: { titulo: "CONTRASEÑA POR VENCER", mensaje: "Su contraseña vencerá en " + (+resp[0].diasvencimiento - (+diferencia)) + " día(s). El sistema recomienda cambiarla.<br><br><strong>¿Qué desea hacer?</strong>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Cambiarla", icono1: "in_seleccionado", boton2STR: "La cambiaré luego", icono2: "i_cancelar", icono0: "i_cambio" }
                  });
                  respuesta.afterClosed().subscribe(result => 
                  {
                    if (result)
                    {
                      if (result.accion == 1) 
                      {
                        this.cambiarClave(1);
                      }
                      else
                      {
                        this.continuarSesion()
                      }
                      
                    }
                    else
                    {
                      this.continuarSesion()
                    }
                    
                  })
                }
                else
                {
                  this.continuarSesion()
                }
                
              }
              else
              {
                this.continuarSesion()
              }
            }
            else
            {
              this.continuarSesion()
            }
          });
        }
        else
        {
          this.continuarSesion()
        }
      }
    })
  }

  continuarSesion()
  {
    this.autenticado = true;
    if (this.servicio.rUsuario().tema && this.servicio.rConfig().tema_permitir_cambio == "S")
    {
      if (this.servicio.rUsuario().tema)
      {
        this.temaPrincipal = this.servicio.rUsuario().tema;
      }
    }

    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET entrada = NOW() WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{});
      
    
    //this.cTurno = this.cambiarTurno && this.servicio.rUsuario().cerrar_al_ejecutar 
    if (this.servicio.rUsuario().tema && this.cambiarTema)
    {
      this.temas(this.servicio.rUsuario().tema);
    }
    else
    {
      this.temas(0);
    }
    
    let cadena = this.servicio.rUsuario().nombre.split(' ');
    this.primerNombre = cadena[0];
    this.cerrar_al_ejecutar = this.servicio.rUsuario().cerrar_al_ejecutar == "S";
    //this.verPin = this.cerrar_al_ejecutar;
    this.abiertoSN = !this.cerrar_al_ejecutar;
    this.pinDireccion = (this.cerrar_al_ejecutar ? "normal" : "aplicado");
    this.ayuda03 = (this.pinDireccion == "normal" ? "Fija la barra de menú" : "Barra de menú flotante");
    this.modoSN = (this.pinDireccion == "normal" ? "over" : "side");
    this.sidenav.mode = (this.cerrar_al_ejecutar || this.isHandset ? "over" : "side");
    this.iconoPin = (this.pinDireccion == "normal" ? "place" : "pin_drop");
    if (this.cerrar_al_ejecutar){
      this.iconoHamburguesa="i_menu";
      this.menuHamburguesaTT = "Abrir panel de opciones";
      this.servicio.aAnchoSN(0);
      
    }
    else 
    {
      if (this.modoSN=="side")
      {
        this.servicio.aAnchoSN(300);  
      }
      else
      {
        this.servicio.aAnchoSN(0);
      }
      
      this.iconoHamburguesa="i_cerrar";
      this.menuHamburguesaTT = "Cerrar el panel de opciones";
    }
    this.continuarOpcion(this.opcionSeleccionada);
    this.servicio.cambioPantalla.emit(!this.sidenav.opened);
    this.cerrarSalir();
    if (this.cerrar_al_ejecutar)
    {
      this.sidenav.close();
    }
  }

cambioSN()
{
  //this.servicio.cambioPantalla.emit(this.sidenav.opened);
  this.verBarra = !this.verBarra;
  if (!this.sidenav.opened)
  {
    this.iconoHamburguesa="i_menu";
    this.menuHamburguesaTT = "Abrir panel de opciones";
    this.direccion = "abierto"
    this.pinEfecto = "out";
    setTimeout(() => {
      this.verPin = false;
    }, 200);
  }
  else 
  {
    this.iconoHamburguesa="i_cerrar";
    this.menuHamburguesaTT = "Cerrar el panel de opciones";
    this.direccion = "cerrado"
    //this.verPin = true;
    this.verPin = !this.isHandset;
    this.pinEfecto = "in";
  }
  this.servicio.cambioPantalla.emit(!this.sidenav.opened);
}

aplicarSN() 
{

  this.iconoPin = (this.pinDireccion == "normal" ? "pin_drop" : "place");
  this.pinDireccion = (this.pinDireccion == "normal" ? "aplicado" : "normal");
  this.ayuda03 = (this.iconoPin == "pin_drop" ? "Barra de menú flotante" : "Fija la barra de menú");
  this.modoSN = (this.iconoPin == "pin_drop" ? "side" : "over");
  this.sidenav.mode = (this.iconoPin == "pin_drop" ? "side" : "over");
  if (this.modoSN=="side")
  {
    this.servicio.aAnchoSN(300);  
  }
  else
  {
    this.servicio.aAnchoSN(0);
  }
  
  
  if (this.autenticado)
  {
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET cerrar_al_ejecutar = '" + (this.iconoPin == "pin_drop" ? "N" : "S") + "' WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp => {
      this.cerrar_al_ejecutar = this.iconoPin == "place";
    })
  }
  this.servicio.cambioPantalla.emit(this.sidenav.opened);
}


//DESDE AQUI



validarOpcion(opcion: any)
{
  if (this.servicio.rUsuario().id == 0)
  {
    this.validarSesion(opcion)
  }
  else
  {
    if (this.servicio.rUsuario().admin == "S" || this.servicio.rUsuario().rol == "A")
    {
      this.continuarOpcion(opcion);
    }
    else
    {
      let optBuscar = opcion.id;
      if (this.opcionOriginal >= 1000 && this.opcionOriginal <= 2000)
      {
        optBuscar = 200;
      }
      let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".relacion_usuarios_opciones WHERE usuario = " + this.servicio.rUsuario().id + " AND opcion = " + optBuscar;
      let campos = {accion: 100, sentencia: sentencia};  
      this.servicio.consultasBD(campos).subscribe( resp =>
      {
        if (resp.length > 0)
        {
          this.continuarOpcion(opcion);
        }
        else
        {
          this.validarSesion(opcion)
        }
      })
    }
  }
}


validarSesion(opcion: any)
{
  const respuesta = this.dialog.open(SesionComponent, 
    {
      width: this.isHandset ? "300px" : "400px", panelClass: 'dialogo', data: { tiempo: 10, sesion: 1, rolBuscar: "", opcionSel: opcion.id, idUsuario: 0, usuario: "", clave: "", titulo: "Sesión de usuario", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Ingresar", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_sesion" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {
          this.opcionSeleccionada = opcion; 
          this.recuperar(result.idUsuario);          
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
    });
  }

accion(opcion: number)
{
  this.opcionOriginal = opcion
  if (opcion == 0)
  {
    this.validarSesion({id: 0});
  }
  else
  {
    if (opcion >= 1000 && opcion <= 2000)
    {
      opcion = 21;
    }
    let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".int_opciones WHERE opcion_app = " + opcion;
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.validarOpcion(resp[0]);
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "Esta opción NO existe en el sistema";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
      
    });
  }
    
}

continuarOpcion(opcion: any)
{
  if (this.opcionOriginal >= 1000 && this.opcionOriginal <= 2000)
  {
    this.servicio.aVista(this.opcionOriginal);
    this.seleccion = this.opcionOriginal;
    if (this.router.url != "/graficas")
    {
      this.router.navigateByUrl("/graficas");
    }
    else
    {
      this.servicio.vista.emit(this.opcionOriginal);
    }
    if (this.pinDireccion=="normal")
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="i_menu";
        this.menuHamburguesaTT = "Abrir panel de opciones";
      }, 300);
    }
  }
  else
  {
    if (!opcion.opcion_app)
    {
      return;
    }
    this.servicio.aVista(opcion.opcion_app);
    this.seleccion = opcion.opcion_app;
    if (this.router.url != opcion.url)
    {
      this.router.navigateByUrl(opcion.url);
    }
    else
    {
      this.servicio.vista.emit(opcion.opcion_app);
    }
    if (this.pinDireccion=="normal" || this.isHandset)
    {
      setTimeout(() => {
        this.sidenav.close()
        this.iconoHamburguesa="i_menu";
        this.menuHamburguesaTT = "Abrir panel de opciones";
      }, 300);
    }
  }
  
}

temas(id: number)
{
  let respuesta: any = [];
  let sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores ORDER BY obligatorio DESC, id LIMIT 1";
  if (id != 0)
  {
    sentencia = "SELECT * FROM " + this.servicio.rBD() + ".pu_colores WHERE id = " + id;
    
  }
  
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    {
      respuesta = resp[0];
      this.servicio.aTemaActual(resp[0].id);
      this.temaActual = resp[0].id;
      
    }
    else
    {
      respuesta = [];
    }
    this.servicio.aColores(respuesta);
    document.documentElement.style.setProperty("--fondo_total", "#" + this.servicio.rColores().fondo_total);
    document.documentElement.style.setProperty("--fondo_barra_superior", "#" + this.servicio.rColores().fondo_barra_superior);
    document.documentElement.style.setProperty("--fondo_barra_inferior", "#" + this.servicio.rColores().fondo_barra_inferior);
    document.documentElement.style.setProperty("--fondo_aplicacion", "#" + this.servicio.rColores().fondo_aplicacion);
    document.documentElement.style.setProperty("--fondo_seleccion", "#" + this.servicio.rColores().fondo_seleccion);
    document.documentElement.style.setProperty("--fondo_boton", "#" + this.servicio.rColores().fondo_boton);
    document.documentElement.style.setProperty("--fondo_slider", "#" + this.servicio.rColores().fondo_slider);
    document.documentElement.style.setProperty("--fondo_tarjeta", "#" + this.servicio.rColores().fondo_tarjeta);
    document.documentElement.style.setProperty("--fondo_boton_inactivo", "#" + this.servicio.rColores().fondo_boton_inactivo);
    document.documentElement.style.setProperty("--fondo_boton_positivo", "#" + this.servicio.rColores().fondo_boton_positivo);
    document.documentElement.style.setProperty("--fondo_boton_negativo", "#" + this.servicio.rColores().fondo_boton_negativo);
    document.documentElement.style.setProperty("--borde_total", "#" + this.servicio.rColores().borde_total);
    document.documentElement.style.setProperty("--borde_seleccion", "#" + this.servicio.rColores().borde_seleccion);
    document.documentElement.style.setProperty("--borde_hover", "#" + this.servicio.rColores().borde_hover);
    document.documentElement.style.setProperty("--borde_boton", "#" + this.servicio.rColores().borde_boton);
    document.documentElement.style.setProperty("--borde_boton_inactivo", "#" + this.servicio.rColores().borde_boton_inactivo);
    document.documentElement.style.setProperty("--borde_tarjeta", "#" + this.servicio.rColores().borde_tarjeta);
    document.documentElement.style.setProperty("--color_impar", "#" + this.servicio.rColores().color_impar);
    document.documentElement.style.setProperty("--color_par", "#" + this.servicio.rColores().color_par);
    document.documentElement.style.setProperty("--texto_tarjeta", "#" + this.servicio.rColores().texto_tarjeta);
    document.documentElement.style.setProperty("--texto_tarjeta_resalte", "#" + this.servicio.rColores().texto_tarjeta_resalte);
    document.documentElement.style.setProperty("--texto_barra_superior", "#" + this.servicio.rColores().texto_barra_superior);
    document.documentElement.style.setProperty("--texto_barra_inferior", "#" + this.servicio.rColores().texto_barra_inferior);
    document.documentElement.style.setProperty("--texto_boton", "#" + this.servicio.rColores().texto_boton);
    document.documentElement.style.setProperty("--texto_boton_inactivo", "#" + this.servicio.rColores().texto_boton_inactivo);
    document.documentElement.style.setProperty("--texto_boton_positivo", "#" + this.servicio.rColores().texto_boton_positivo);
    document.documentElement.style.setProperty("--texto_boton_negativo", "#" + this.servicio.rColores().texto_boton_negativo);
    document.documentElement.style.setProperty("--texto_seleccion", "#" + this.servicio.rColores().texto_seleccion);
    document.documentElement.style.setProperty("--texto_tiptool", "#" + this.servicio.rColores().texto_tiptool);
    document.documentElement.style.setProperty("--fondo_tiptool", "#" + this.servicio.rColores().fondo_tiptool);
    document.documentElement.style.setProperty("--borde_tiptool", "#" + this.servicio.rColores().borde_tiptool);
    document.documentElement.style.setProperty("--texto_boton_barra", "#" + this.servicio.rColores().texto_boton_barra);
    document.documentElement.style.setProperty("--fondo_boton_barra", "#" + this.servicio.rColores().fondo_boton_barra);
    document.documentElement.style.setProperty("--fondo_logo", "#" + this.servicio.rColores().fondo_logo);
    document.documentElement.style.setProperty("--fondo_snack_normal", "#" + this.servicio.rColores().fondo_snack_normal);
    document.documentElement.style.setProperty("--fondo_snack_error", "#" + this.servicio.rColores().fondo_snack_error);
    document.documentElement.style.setProperty("--texto_snack_normal", "#" + this.servicio.rColores().texto_snack_normal);
    document.documentElement.style.setProperty("--texto_snack_error", "#" + this.servicio.rColores().texto_snack_error);
    document.documentElement.style.setProperty("--texto_solo_texto", "#" + this.servicio.rColores().texto_solo_texto);
    
    
    this.servicio.cambioColor.emit(true);
  }, 
  error => 
    {
      console.log(error)
    })
  
}

recuperarSesion()
{
  if (this.servicio.rConfig().recuperar_sesion=="S" && this.servicio.rUsuarioAnterior()>0)
  {
    this.seleccion = 10;
    this.opcionSeleccionada = {opcion_app: 10, url: "/andon"}; 
    this.recuperar(this.servicio.rUsuarioAnterior())    
  }
  else
  {
    this.primerNombre = "";
    this.ayudaInferior = "Se requiere inicio de sesión..."
    this.servicio.aUsuario({id: 0, nombre: ''});
    this.estado="in";
    this.router.navigateByUrl('/vacio');
    this.accion(10);   
  }
}

imagenError()
  {
    this.logo_ruta = "./assets/logo_general.png"
    this.logo_alto  = "47";
    this.logo_ancho = "250";
    this.logo_arriba  = "10";
    this.logo_izquierda = "0";
  }

verMenu()
{
    this.servicio.mostrarBarra.emit(this.posMenu == "cerrado");
    this.posMenu = (this.posMenu == "cerrado" ? "abierto" : "cerrado");
    this.ayuda07  = (this.posMenu == "abierto" ? "Ocultar la barra de funciones" : "Visualizar la barra de funciones");
}

finalizar()
  {
    let adicional: string = "";
    const respuesta = this.dialog.open(DialogoComponent, {
      width: "420px", panelClass: 'dialogo_atencion', data: { titulo: "FINALIZAR SESIÓN", mensaje: "Esta acción terminará su sesión de trabajo en la aplicación de ANDON.<br><br><strong>¿Desea salir de la aplicación?</strong>", id: 0, accion: 0, tiempo: 0, botones: 2, boton1STR: "Finalizar sesión", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_salir" }
    });
    respuesta.afterClosed().subscribe(result => 
    {
      if (result)
      {
        if (result.accion == 1) 
        {
          this.cierreSesion()        
        }
        else
        {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "No se ha finalizado la sesión de <strong> " + this.servicio.rUsuario().nombre + "</strong>";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
        }
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = "No se ha finalizado la sesión de <strong> " + this.servicio.rUsuario().nombre + "</strong>";
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
      }
    })
  }

  cierreSesion()
  {
    let sentencia = "UPDATE " + this.servicio.rBD() + ".cat_usuarios SET salida = NOW(), tema = " + this.servicio.rTemaActual() + " WHERE id = " + this.servicio.rUsuario().id;
    let campos = {accion: 200, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe((datos: any []) =>{
      let mensajeCompleto: any = [];
      this.servicio.aUsuarioAnterior(0);
      this.servicio.aConsulta(0);
      mensajeCompleto.clase = "snack-normal";
      mensajeCompleto.mensaje = "Se ha finalizado la sesión de <strong> " + this.servicio.rUsuario().nombre + "</strong>";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.servicio.aUsuario({id: 0, nombre: ''});
      this.primerNombre = "";
      this.servicio.mensajeError.emit("");
      this.servicio.mensajeInferior.emit("");
      this.servicio.mensajeSuperior.emit("");
      this.router.navigateByUrl('/vacio');
      this.autenticado=false;
      this.accion(0);
    });
  }
  llenarTemas()
  {
    let sentencia = "SELECT id, nombre FROM " + this.servicio.rBD() + ".pu_colores WHERE (personalizada = 'N' OR (personalizada = 'S' AND usuario = " + this.servicio.rUsuario().id +")) AND estatus = 'A' ORDER BY personalizada DESC, nombre";
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      if (resp.length > 0)
      {
        this.temasUsuario = resp
      }
    }, 
    error => 
      {
        console.log(error)
      })
  }

  iraCronos()
  {
    if (this.urlCronos)
    {
      window.open(this.urlCronos, "_blank");
    }
    else
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = "No hay ninguna página web asociada a Cronos";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
    }
  }

  cambiarClave(posterior: number)
  {
    const respuesta = this.dialog.open(SesionComponent, 
      {
        width: this.isHandset ? "300px" : "400px", panelClass: 'dialogo', data: { sesion: 3, opcionSel: 0, idUsuario: this.servicio.rUsuario().id, usuario: "", clave: "", titulo: "Cambio de contraseña", mensaje: "", alto: "90", id: 0, accion: 0, botones: 2, boton1STR: "Cambiar contraseña", icono1: "in_seleccionado", boton2STR: "Cancelar", icono2: "i_cancelar", icono0: "i_cambio" }
      });
      respuesta.afterClosed().subscribe(result => 
      {

        if (result)
        {
        if (posterior==1 && result.accion==1)
         {
          this.continuarSesion();
         }
         else if (posterior==1)
         {
          let mensajeCompleto: any = [];
          mensajeCompleto.clase = "snack-error";
          mensajeCompleto.mensaje = "Inicio de sesión inválido";
          mensajeCompleto.tiempo = 2000;
          this.servicio.mensajeToast.emit(mensajeCompleto);
         } 
        }
        else 
        {
          this.continuarSesion();
        }
      })
  }

  salida(mensaje: string)
  {
    this.router.navigateByUrl('/vacio');
    this.version = "LogistiCAR N/A"; 
    this.cadenaVcto =  "";
    this.licenciado = this.servicio.rLicenciado();
    this.servicio.mensajeInferior.emit("<span class='resaltar'>" + mensaje + "</span>");
  }

  
 
calcularTotales()
{
  let sentencia = "SELECT COUNT(*) AS total, SUM(IF(estado = 0, 1, 0)) AS totalD, SUM(IF(estado = 10, 1, 0)) AS totalE, SUM(IF(estado = 20, 1, 0)) AS totalT, SUM(IF(estado = 30, 1, 0)) AS totalG, SUM(IF(estado = 40, 1, 0)) AS totalF FROM " + this.servicio.rBD() + ".requesters";
  let campos = {accion: 100, sentencia: sentencia};  
  this.servicio.consultasBD(campos).subscribe( resp =>
  {
    if (resp.length > 0)
    {
      this.total = resp[0].total ? resp[0].total : 0;
      this.totalD = resp[0].totalD ? resp[0].totalD : 0;
      this.totalE = resp[0].totalE ? resp[0].totalE : 0;
      this.totalT = resp[0].totalT ? resp[0].totalT : 0;
      this.totalG = resp[0].totalG ? resp[0].totalG : 0;
      this.totalF = resp[0].totalF ? resp[0].totalF : 0;
    }
    else
    {
      this.total = 0;
      this.totalD = 0;
      this.totalE = 0;
      this.totalT = 0;
      this.totalG = 0;
      this.totalF = 0;
    }
    
  })    
  
}

}