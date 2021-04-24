import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { ServicioService } from '../servicio/servicio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-opciones',
  templateUrl: './opciones.component.html',
  styleUrls: ['./opciones.component.css']
})
export class OpcionesComponent implements OnInit {

  @ViewChild("txtNotas", { static: false }) txtNotas: ElementRef;

  conceptos = [];
  areas = [];
  val = [];
  movil: boolean = false;
  validar01: boolean = false;
  validar02: boolean = false;
  validar03: boolean = false;
  tipoResumen: string = "";

  constructor(
    private servicio: ServicioService,
    public dialogRef: MatDialogRef<OpcionesComponent>, 
    @Inject(MAT_DIALOG_DATA) public datos: any
  ) 
  {
    
  }

  ngOnInit()
   {
    this.val[0] = true; 
  }

  verOpciones()
 {
  }


  validar(id: number)
  {
    
    this.datos.accion = id;
    this.dialogRef.close(this.datos);
  }

}


