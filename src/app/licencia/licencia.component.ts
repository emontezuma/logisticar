import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-licencia',
  templateUrl: './licencia.component.html',
  styleUrls: ['./licencia.component.css']
})
export class LicenciaComponent implements OnInit {

  clave: string = "";
  licencia: string = "";
  palabraClave: string = "LogisticarcronosI2019";
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  

  constructor(
    private servicio: ServicioService,
    public dialogRef: MatDialogRef<LicenciaComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) 
  {
    
  }

  ngOnInit() {

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

  validar(id: number)
  {
    if (id == 1)
    {
      this.validarLicencia(1);      
    }
    else if (id == 2)
    {
      let mensajeCompleto: any = [];
      mensajeCompleto.clase = "snack-error";
      mensajeCompleto.mensaje = "No se ha aplicado la licencia";
      mensajeCompleto.tiempo = 2000;
      this.servicio.mensajeToast.emit(mensajeCompleto);
      this.datos.accion = 2;
      this.dialogRef.close(this.datos);
    }
  }

  validarLicencia(paso: number)
  {
      
      let licencia = this.licencia.substr(0, 2)
      licencia = licencia + this.licencia.substr(3, 3);
      licencia = licencia + this.licencia.substr(7, 2);
      licencia = licencia + this.licencia.substr(10, 2);
      licencia = licencia + this.licencia.substr(13, 5);
      licencia = licencia + this.licencia.substr(19, 2);
      licencia = licencia + this.licencia.substr(22, 2);
      licencia = licencia + this.licencia.substr(25, 2);
      licencia = licencia + this.licencia.substr(28, 2);

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
      for (var i = 0; i < this.clave.length; i++) 
      {
        let numero = (palabra[i].charCodeAt(0) ^ this.clave[i].charCodeAt(0)).toString();
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
      let mensaje = "";
      if (!validada) 
      {
        //Comparar fechas
        let licencia = this.licencia;
        let anyo = licencia.substr(2,1) + licencia.substr(6,1) + licencia.substr(9,1) + licencia.substr(12,1);
        let mes = licencia.substr(18,1) + licencia.substr(21,1);
        let dia = licencia.substr(24,1) + licencia.substr(27,1);
        let desde= new Date(anyo + "/" + mes + "/" + dia);
        
        if (desde.getTime() === desde.getTime())
        {
          
          let vctoDemo = this.servicio.fecha(2, (anyo + "/" + mes + "/" + dia), "dd-MM-yyyy")
          let diferencia = ((desde.getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);            
          if (+diferencia <= 0)
          {
            mensaje = "La licencia que intenta introducir ya está vencida"
          }
          else if (+diferencia > 1)
          {
            mensaje = "+Ha ingresado una licencia válida para " + diferencia + " día(s)";
          }
        }
        else
        {
          mensaje = "La licencia que intenta introducir no es válida";
        }
      }
      else
      {
        mensaje = "+Licencia correcta!";
      }
      if (mensaje.substr(0, 1) == "+")
      {
        let sentencia = "UPDATE " + this.servicio.rBD() + ".configuracion SET licencia = '" + this.licencia + "'";
        let campos = {accion: 200, sentencia: sentencia};
        this.servicio.consultasBD(campos).subscribe( resp =>
        {});
                 
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-normal";
        mensajeCompleto.mensaje = mensaje.substr(1);
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
        this.datos.accion = 1;
        this.dialogRef.close(this.datos);
      }
      else
      {
        let mensajeCompleto: any = [];
        mensajeCompleto.clase = "snack-error";
        mensajeCompleto.mensaje = mensaje;
        mensajeCompleto.tiempo = 2000;
        this.servicio.mensajeToast.emit(mensajeCompleto);
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

}
