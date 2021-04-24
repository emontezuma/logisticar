import { Injectable, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Observable, throwError, pipe } from 'rxjs';  
import { HttpClient,  HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators'
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'  
})
export class ServicioService {

  URL_BASE = environment.urlAPP;
  URL_MMCALL = environment.urlMMCALL;

  private anchoSN: number = 300;
  private palabraClave: string = "LogisticarcronosI2019";
  private usuarioActual: any = {id: 0};
  private config: any = [];
  private colores: any = [];
  private coloresv1: any = [];
  private pantalla: {alto: 0, ancho: 0};
  private huboError: boolean = false;
  private demoVersion: boolean = false;
  private licenciado: boolean = false;
  private vctoDemo: string = "";
  private operacion: any = {id: 0, nombre: "", desde: "N/A", hasta: "N/A", };
  private miVista: number = 0;
  private consulta: number = 0;
  private tema: number = 0;
  private respuestaLicencia: string = "";
  private usuarioAnterior: number = 0;
  private nombreInstalacion: string = "";
  private turnoActual: any = {id: 0, inicia: "", termina: "", mover: 0, secuencia: 0, nombre : "" };
  mmcall: string = "";

  
  ///ELVIS
  private horaDesde: string = "";
  private viendoRate: boolean = false;
  private enMovil: boolean = false;
  private iniciarCuenta: boolean = false;
  private piezasAcumuladas: number = 0;
  private escanear: boolean = false;
  private cadenaEscaneada: string = "";
  //
  
  aHoraDesde(hora: string) {
    this.horaDesde = hora;
  }

  rHoraDesde() {
    return this.horaDesde ;
  }

  aVerRate(ver: boolean) {
    this.viendoRate = ver;
  }

  rVerRate() {
    return this.viendoRate ;
  }

  aInicio(iniciar: boolean) {
    this.iniciarCuenta = iniciar;
  }

  rInicio() {
    return this.iniciarCuenta ;
  }

  aAcumuladas(piezas: number) {
    this.piezasAcumuladas = piezas;
  }

  rAcumuladas() {
    return this.piezasAcumuladas ;
  }

  aMovil(enMovil: boolean) {
    this.enMovil = enMovil;
  }

  rMovil() {
    return this.enMovil ;
  }

  constructor(public datepipe: DatePipe,
              private http: HttpClient,
            ) 
            {}

  activarSpinner = new EventEmitter<boolean>();
  activarSpinnerSmall = new EventEmitter<boolean>();
  teclaBuscar = new EventEmitter<boolean>();
  configurando = new EventEmitter<boolean>();
  teclaEscape = new EventEmitter<boolean>();
  teclaResumen = new EventEmitter<boolean>();
  refrescarLogo = new EventEmitter<boolean>();
  teclaProceso = new EventEmitter<boolean>();
  cambioColor = new EventEmitter<boolean>();
  sinConexion = new EventEmitter<boolean>();
  mensajeSuperior = new EventEmitter<string>();
  mensajeInferior = new EventEmitter<string>();
  mensajeError = new EventEmitter<string>();
  esMovil = new EventEmitter<boolean>();
  cambioTurno = new EventEmitter<boolean>();
  cambioRouter = new EventEmitter<boolean>();
  rSesion = new EventEmitter<boolean>();
  mensajeToast = new EventEmitter<object>();
  teclaCambiar = new EventEmitter<boolean>();
  refrescarVista = new EventEmitter<boolean>();
  cambioPantalla = new EventEmitter<boolean>();
  quitarBarra = new EventEmitter<boolean>();
  cierreSnack = new EventEmitter<boolean>();
  vista = new EventEmitter<number>();
  cadaSegundo = new EventEmitter<boolean>();
  mostrarBmenu = new EventEmitter<number>();
  mostrarBarra = new EventEmitter<boolean>();
  verProgramador = new EventEmitter<boolean>();
  salir = new EventEmitter<string>();
  valida = new EventEmitter<boolean>();
  vencimiento = new EventEmitter<string>();
  escaneado = new EventEmitter<string>();
  listoEscanear = new EventEmitter<boolean>();

  //
  vista_2 = new EventEmitter<number>();
  vista_3 = new EventEmitter<number>();
  vista_4 = new EventEmitter<number>();
  vista_5 = new EventEmitter<number>();
  //
  

  aAnchoSN(ancho: number) {
    this.anchoSN = ancho;
  }
  rAnchoSN() {
    return this.anchoSN ;
  }

  aUsuarioAnterior(id: number) {
    this.usuarioAnterior = id;
  }
  rUsuarioAnterior() {
    return this.usuarioAnterior ;
  }

  rEsDemo() {
    return this.demoVersion;
  }

  rLicenciado() {
    return this.licenciado;
  }

  rVctoDemo() {
    return this.vctoDemo;
  }

  aTurno(valor: any) {
    this.turnoActual = valor;
  }

  rTurno() {
    return this.turnoActual ;
  }



  aConsulta(numero: number) {
    this.consulta = numero;
  }
  rConsulta() {
    return this.consulta ;
  }


  aHuboError(siError: boolean) {
    this.huboError = siError;
  }
  rHuboError() {
    return this.huboError ;
  }

  aUsuario(valor: any) {
    this.usuarioActual = valor;
  }
  rUsuario() {
    return this.usuarioActual ;
  }

  aConfig(valor: any) {
    this.config = valor;
  }
  rConfig() {
    return this.config ;
  }

  rBD() {
    let bd = "logisticar";
    return bd;
  }

  aTemaActual(valor: any) {
    this.tema = valor;
  }
  rTemaActual() {
    return this.tema ;
  }

  rPalabraClave() {
    return this.palabraClave ;
  }
  
  aColores(valor: any) {
    this.colores = valor;
    
  }
  rColores() {
    return this.colores ;
  }

  aColoresv1(valor: any) {
    this.coloresv1 = valor;
    
  }
  rColoresv1() {
    return this.coloresv1 ;
  }


  aUltimoReporte(valor: number) {
    this.usuarioActual.ultimo_reporte = valor;
  }

  aPantalla(valor: any) {
    this.pantalla = valor;
  }
  rPantalla() {
    return this.pantalla ;
  }


  aVista(vista: number) {
    this.miVista = vista;
  }
  rVista() {
    return this.miVista ;
  }


  aOperacion(valor: any) {
    this.operacion = valor;
  }
  rOperacion() {
    return this.operacion ;
  }

  

  fecha(tipo: number, miFecha: string, formato: string): string 
  {
    if (tipo == 1) 
    {
      return this.datepipe.transform(new Date(), formato);
    }
    else if (tipo == 2) 
    {
      if (!miFecha)
      {
        return "";  
      }
      else
      {
        return this.datepipe.transform(new Date(miFecha), formato);
      }
    }
  }

  consultasBD(campos: any): Observable<any> 
  {      
    
    if (campos.accion == 100) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=consultar", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    if (campos.accion == 150) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=consultar_archivo", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 200) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 300) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=agregar", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1000) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar_planta", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 1100) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar_proceso", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 1200) 
    {

      return this.http.post<any>(this.URL_BASE + "accion=actualizar_ruta_cabecera", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1300) 
    {
      
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_ruta_detalle", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1400) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_secuencia_ruta", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    
    else if (campos.accion == 1500) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_proceso_detalle", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    
      }
    else if (campos.accion == 1600) 
      {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_secuencia_ruta2", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1700) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_parte", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 1800) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_recipiente", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 1900) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_alertas", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 2000) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_situaciones", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 2100) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_horarios", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 2200) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_usuario", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 3000) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_programacion", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 3050) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_carga", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    else if (campos.accion == 3100) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=actualizar_prioridad", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }

    else if (campos.accion == 3200) 
    {
      return this.http.post<any>(this.URL_BASE + "accion=recuperar_excel", JSON.stringify(campos)
      //, { params: parametros, headers: cabeceras }
      )
      .pipe(
        map( resp => 
          { 
            return resp;
          }),  
        );
    }
    
  }  

  
  llamadaMMCall(campos: any): Observable<any> 
  {
    if (campos.accion == 100) {
      return this.http.get(this.URL_MMCALL + "action=call&code=" + campos.requester + "&key=1&custom_message=" + campos.mensaje, {responseType: 'text'});
      
    }
    else if (campos.accion == 200) {
      return this.http.get(this.URL_MMCALL + "action=cancel&code=" + campos.requester, {responseType: 'text'});
    }
    else if (campos.accion == 300) {
      let sentencia = "INSERT INTO mmcall.tasks (location_id, task, message, recipients, status, created) VALUES (1, 'page', '" + campos.mensaje + "', '" + (+campos.pager + 100) + "', 0, NOW());";
      let camposMSG = {accion: 200, sentencia: sentencia};  
      this.consultasBD(camposMSG).subscribe( resp =>
      {
      })

      //return this.http.get(campos.url + "&message=" + campos.mensaje, {responseType: 'text'});

    }
    
  }

  /* Suma el porcentaje indicado a un color (RR, GG o BB) hexadecimal para aclararlo */

  colorear(color, porcentaje: number)
  {

    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) 
    {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
        color = "#" + r + g + b;
    }
    
    if (porcentaje > 0)
    {
      //Se oscurece
      
      const subtractLight = function(color, porcentaje){
        let cc = parseInt(color,16) - porcentaje;
        let c = (cc < 0) ? 0 : (cc);
        return (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;
      }
  
      /* Oscurece un color hexadecimal de 6 caracteres #RRGGBB segun el porcentaje indicado */
      color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
      porcentaje = parseInt('' + (255 * porcentaje) /100);
      return color = `#${subtractLight(color.substring(0,2), porcentaje)}${subtractLight(color.substring(2,4), porcentaje)}${subtractLight(color.substring(4,6), porcentaje)}`;
    }
    else
    {
      porcentaje = porcentaje * -1;
      const addLight = function(color: string, porcentaje: number)
      {
        let cc = parseInt(color,16) + porcentaje;
        let c: number = (cc > 255) ? 255 : (cc);
        return (c.toString(16).length > 1 ) ? c.toString(16) : `0${c.toString(16)}`;
      }

        color = (color.indexOf("#")>=0) ? color.substring(1,color.length) : color;
        porcentaje = parseInt('' + (255 * porcentaje) / 100);
        return color = `#${addLight(color.substring(0,2), porcentaje)}${addLight(color.substring(2,4), porcentaje)}${addLight(color.substring(4,6), porcentaje)}`;
    }

  /* Resta el porcentaje indicado a un color (RR, GG o BB) hexadecimal para oscurecerlo */
    
  }

  claridad(color) {

    // Variables for red, green, blue values
    var r, g, b, hsp;
    
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 

    else {
        
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    return Math.sqrt(0.241 * (r * r) + 0.691 * (g * g) + 0.068 * (b * b));
  }

  tiempoTranscurrido(fecha: string, formato: string): string
  {
    if (formato == "S")
    {
      return "0;0;0;" + Math.round((new Date().getTime() - new Date(fecha).getTime()) / 1000);
    }
    else if (formato == "FS")
    {
      return "0;0;0;" + Math.round((new Date(fecha).getTime() - new Date().getTime()) / 1000);
    }
    else if (formato == "F" || formato == "FD")
    {
      let segundos = Math.round((new Date(fecha).getTime() - new Date().getTime()) / 1000);
      if (formato == "FD")
      {
        let dias = Math.floor(segundos / 86400);
        let horas = Math.floor((segundos % 86400) / 3600);
        let minutos = Math.floor(((segundos % 86400) % 3600) / 60);
        segundos = segundos % 60 ; 
        return dias + ";" + horas + ";" + minutos + ";" + segundos;
      }
      else
      {
        let horas = Math.floor(segundos / 3600);
        let minutos = Math.floor((segundos % 3600) / 60);
        segundos = segundos % 60 ; 
        return "0;" + horas + ";" + minutos + ";" + segundos;
      }
    }
    else 
    {
      let segundos = Math.round((new Date().getTime() - new Date(fecha).getTime()) / 1000);
      if (formato == "D")
      {
        let dias = Math.floor(segundos / 86400);
        let horas = Math.floor((segundos % 86400) / 3600);
        let minutos = Math.floor(((segundos % 86400) % 3600) / 60);
        segundos = segundos % 60 ; 
        return dias + ";" + horas + ";" + minutos + ";" + segundos;
      }
      else
      {
        let horas = Math.floor(segundos / 3600);
        let minutos = Math.floor((segundos % 3600) / 60);
        segundos = segundos % 60 ; 
        return "0;" + horas + ";" + minutos + ";" + segundos;
      }
      
    }    
  }
  
  tildes(cadena, tipo = "")
  {
      var input = cadena
      var tittles = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
      var original = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
      for (var i = 0; i < tittles.length; i++) {
          input = input.replace(tittles.charAt(i), original.charAt(i));
      };
      if (tipo=="m")
      {
        input = input.toLowerCase();
      }
      else if (tipo=="M")
      {
        input = input.toUpperCase();
      }
      return input;
   };

   guardarVista(vista: number, valor: number)
   {
      let sentencia = "UPDATE " + this.rBD() + ".cat_usuarios SET preferencias_andon = CONCAT(LEFT(preferencias_andon, " + (vista - 1) + "), " + valor + ", MID(preferencias_andon, " + (vista + 1) + ")) WHERE id = " + this.rUsuario().id
      let campos = {accion: 200, sentencia: sentencia};  
      this.consultasBD(campos).subscribe( resp =>
      {
        this.usuarioActual.preferencias_andon =  this.usuarioActual.preferencias_andon.substring(0, vista - 1) + valor + this.usuarioActual.preferencias_andon.substring(vista);
      })
   }

   generarReporte(arreglo, titulo, archivo)
  {
    
    let exportCSV = ""; 
    exportCSV = "LogistiCAR\r\n";
    exportCSV = exportCSV + this.config.planta + "\r\n";
    exportCSV = exportCSV + titulo + "\r\n";
    
    exportCSV = exportCSV + 'Fecha del reporte: ' + this.fecha(1, '', 'dd/MM/yyyy HH:mm:ss') + "\r\n";
    for (var i = 0; i < arreglo.length; i++)
    {
      for (var j in arreglo[i])
      {
        if (arreglo[i][j])
        {
          arreglo[i][j] = '' + arreglo[i][j];
          let cadena = this.tildes(arreglo[i][j]).replace(/\n/g,'');
          cadena = cadena.replace(/\r/g,'');
          exportCSV = exportCSV + '"' + cadena + '",'
        }
        else
        {
          exportCSV = exportCSV + '"",'
        }
        
      }
      exportCSV = exportCSV  + "\r\n"
    }
    exportCSV = exportCSV + "Total registros: " + (arreglo.length - 1) + "\r\n"
    var blob = new Blob([exportCSV], {type: 'text/csv' }),
    url = window.URL.createObjectURL(blob);
    let link = document.createElement('a')
    link.download = archivo;
    link.href = url
    link.click()
    window.URL.revokeObjectURL(url);
    link.remove();
  }

  validarLicencia(paso: number)
  {
      
      if (paso==1)
      {
        this.licenciado = false;
        let sentencia = "SELECT CONCAT(key_number, serial) AS mmcall FROM mmcall.locations"
        let campos = {accion: 100, sentencia: sentencia};  
        this.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length == 0)
          {
            this.respuestaLicencia = "MMCall no tiene la configuración adecuada.<br><br><strong>Configure MMCall e intente de nuevo</strong>";
            this.validarLicencia(3);
          }
          else
          {
            this.mmcall = resp[0].mmcall;
            this.validarLicencia(2);
          }
        })
      }
      else if (paso == 2)
      {
        let sentencia = "SELECT licencia FROM " + this.rBD() + ".configuracion"
        let campos = {accion: 100, sentencia: sentencia};  
        this.consultasBD(campos).subscribe( resp =>
        {
          if (resp.length==0)
          {
            this.respuestaLicencia = "La aplicación de ANDON no tiene una licencia asociada.<br><br><strong>Configure ANDON e intente de nuevo</strong>";
            this.validarLicencia(3);
          }
          else 
          {
            resp[0].licencia = resp[0].licencia ? resp[0].licencia : "";
            if (resp[0].licencia.length > 0)
            {
              let licencia = resp[0].licencia.substr(0, 2)
              licencia = licencia + resp[0].licencia.substr(3, 3);
              licencia = licencia + resp[0].licencia.substr(7, 2);
              licencia = licencia + resp[0].licencia.substr(10, 2);
              licencia = licencia + resp[0].licencia.substr(13, 5);
              licencia = licencia + resp[0].licencia.substr(19, 2);
              licencia = licencia + resp[0].licencia.substr(22, 2);
              licencia = licencia + resp[0].licencia.substr(25, 2);
              licencia = licencia + resp[0].licencia.substr(28, 2);

              let palabra = this.alterarPalabraClave();
              if (palabra.length > licencia.length)
              {
                licencia = licencia + '0'.repeat(palabra.length - licencia.length);
              }
              else if (licencia.length > palabra.length)
              {
                palabra = palabra + '0'.repeat(licencia.length - palabra.length);
              }
              //Validar la licencia
              let validada = true;
              let cadComparar = "";
              for (var i = 0; i < this.mmcall.length; i++) 
              {
                let numero = (palabra[i].charCodeAt(0) ^ this.mmcall[i].charCodeAt(0)).toString();
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
                if (cadComparar != licencia[i])
                {
                  validada = false;
                  break;
                }
              }
              if (!validada) 
              {
                //Comparar fechas
                this.demoVersion= true;
                let anyo = resp[0].licencia.substr(2,1) + resp[0].licencia.substr(6,1) + resp[0].licencia.substr(9,1) + resp[0].licencia.substr(12,1);
                let mes = resp[0].licencia.substr(18,1) + resp[0].licencia.substr(21,1);
                let dia = resp[0].licencia.substr(24,1) + resp[0].licencia.substr(27,1);
                let desde= new Date(anyo + "/" + mes + "/" + dia);
                if (desde.getTime() === desde.getTime())
                {
                  this.vctoDemo = this.fecha(2, (anyo + "/" + mes + "/" + dia), "dd-MM-yyyy")
                  let diferencia = ((desde.getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);            
                  if (+diferencia == 0)
                  {
                    this.respuestaLicencia = "+Su licencia demostrativa vence el día de hoy. <strong>Mañana no estará disponible</strong><br><br>Comuníquese con su proveedor de LogistiCAR para la aplicación de una licencia perpetua"
                  }
                  else if (+diferencia == 1)
                  {
                    this.respuestaLicencia = "+Su licencia demostrativa <strong>vencerá mañana</strong><br><br>Comuníquese con su proveedor de LogistiCAR para la aplicación de una licencia perpetua";
                  }
                  else if (+diferencia > 1 && +diferencia <= 5)
                  {
                    this.respuestaLicencia = "+Su licencia demostrativa vencerá en <strong>" + diferencia + " días</strong><br><br>Comuníquese con su proveedor de LogistiCAR para la aplicación de una licencia perpetua";
                  }
                  else if (+diferencia > 5)
                  {
                    this.respuestaLicencia = "" ;
                  }
                  else
                  {
                    this.respuestaLicencia = "Su licencia demostrativa <strong>ha vencido </strong><br><br>Comuníquese con su proveedor de LogistiCAR para la aplicación de una licencia perpetua ";
                  }
                  this.validarLicencia(3);
                  
                }
                else
                {
                  
                  this.respuestaLicencia = "Su licencia demostrativa <strong>ha vencido </strong><br><br>Comuníquese con su proveedor de LogistiCAR para la aplicación de una licencia perpetua ";
                  this.validarLicencia(3);
                  return;
                }
              }
              else
              {
                this.licenciado = true;
                this.demoVersion = false;
                this.respuestaLicencia = "";
                this.validarLicencia(3);
              }
            }
            else
            {
              this.respuestaLicencia = "La aplicación de LogistiCAR no tiene una licencia asociada.<br><br><strong>Configure LogistiCAR e intente de nuevo</strong>";
              this.validarLicencia(3);
            }
          }
        })
      }
      else
      {
        if (this.respuestaLicencia.length== 0)
        {
          //Licencia válida
          this.valida.emit(true);
          return;
        }
        else if (this.respuestaLicencia.substr(0,1) != "+")
        {
          this.salir.emit(this.respuestaLicencia);
          return;
        }
        else
        {
          this.vencimiento.emit(this.respuestaLicencia.substr(0));
          return;
        }
      }
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

  aEscanear(yaEscanear: boolean) {
    if (!this.escanear && yaEscanear)
    {
      this.cadenaEscaneada = "";
    }
    this.escanear = yaEscanear;
    this.listoEscanear.emit(yaEscanear);
    if (!yaEscanear)
    {
      this.cadenaEscaneada = "";
    }
  }
  rEscanear() {
    return this.escanear ;
  }
  
}

