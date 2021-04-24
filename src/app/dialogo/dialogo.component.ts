import { Component, OnInit, Inject } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SesionComponent } from '../sesion/sesion.component';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

  
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  cadBoton1: string = this.datos.boton1STR;
  tiempoFalta: number = 0;
  mostrarTiempo: boolean = false;
  turnoViene: number = -1;

  constructor(
    private servicio: ServicioService,
    public dialogRef: MatDialogRef<DialogoComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
    
  ) 
  {
    this.servicio.cadaSegundo.subscribe((accion: boolean)=>
    {
      this.cadaSegundo();
    });
    this.tiempoFalta =  + this.servicio.rConfig().limitar_respuestas;
    if (this.tiempoFalta && this.datos.tiempo != -1)
    {
      this.mostrarTiempo = true;
      this.datos.boton1STR =  this.cadBoton1 + " (" + this.tiempoFalta + ")";      
    }
    this.servicio.esMovil.subscribe((accion: boolean)=>
    {
      this.movil = accion;
      document.documentElement.style.setProperty("--ancho_campo", this.movil ? "300px" : "400px");
      
    });

    
  }

  turnos: any = [];
  mostrarCancelar: boolean = this.servicio.rConfig().turno_modo != 2;
  tActual: string = "";
  mensajeTurno: string = "";

  ngOnInit() {
    this.listarTurnos();
    this.movil = this.servicio.rMovil(); 
  }

  listarTurnos()
  {
    this.tActual = "TURNO ACTUAL: (NO ASOCIADO)";
    let sentencia = "SELECT id, nombre, inicia, termina, secuencia FROM " + this.servicio.rBD() + ".cat_turnos ORDER BY secuencia;"
    this.turnos = [];
    let campos = {accion: 100, sentencia: sentencia};  
    this.servicio.consultasBD(campos).subscribe( resp =>
    {
      this.turnos = resp;
      
      if (this.datos.id == 0)
      {
        this.mensajeTurno = "La aplicación ha detectado un cambio de turno, por favor seleccione el turno que entra en vigor a partir de ahora"
        if (resp.length > 0)
        {
          for (var i = 0; i < resp.length; i++) 
          {
            if (resp[i].id == this.servicio.rTurno().id)
            {
              this.tActual = "Actual: " +  resp[i].nombre + " (" + resp[i].inicia + "-" + resp[i].termina + ")";
            }
            if (+resp[i].secuencia > +this.servicio.rTurno().secuencia)
            {
              this.datos.idTurno = resp[i].id;
              this.turnoViene = 1;
            }
          }
          if (this.turnoViene == -1)
          {
            this.datos.idTurno = resp[0].id;
          } 
        }
      }
      else if (this.datos.id != -1)
      {
        this.mensajeTurno = "La aplicación ha detectado un cambio de turno, por favor seleccione el turno que entra en vigor a partir de ahora"
        this.datos.idTurno = this.datos.id;
      }
      else
      {
        this.datos.idTurno = this.servicio.rTurno().id;
        this.mensajeTurno = "El cambio de turno afectará las funciones de ANDON, KANBAN y OEE"
        this.tActual = "Actual: " +  this.servicio.rTurno().nombre + " (" + this.servicio.rTurno().inicia + "-" + this.servicio.rTurno().termina + ")";
      }
    });
  }
  
  validar(id: number)
  {
    this.datos.accion = id;
    this.datos.idturno = 
    this.dialogRef.close(this.datos);
  }

  cadaSegundo()
  {
    if (this.tiempoFalta >= 0 && this.mostrarTiempo)
    {      
      this.tiempoFalta = this.tiempoFalta - 1;
      if (this.tiempoFalta == -1)
      {
        if (this.datos.mensaje.length==0 && this.servicio.rConfig().turno_modo == 2)
        {
          this.datos.accion = 1;  
        }
        else
        {
          this.datos.accion = 3;
        }
        
        this.dialogRef.close(this.datos);
      }
      else
      {
        this.datos.boton1STR =  this.cadBoton1 + " (" + this.tiempoFalta + ")";
      }
      
      
    }
  }  

}

