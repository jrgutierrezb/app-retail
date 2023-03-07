import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { Alert } from 'src/app/core/class/Alert';
import { IModule } from '../../interfaces/IModule.interface';
import { ModuleService } from '../../services/module.service';
import { CreateOrEditModuleComponent } from '../../components/create-or-edit-module/create-or-edit-module.component';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModuleComponent implements OnInit {

  @ViewChild('createOrEditModule')
  createOrEditModule!: CreateOrEditModuleComponent;
  @ViewChild('table') table!: TableComponent;

  alert = new Alert();

  headers: IHeaders[] = [
    {
      columnName: 'Nombre',
      field: 'name',
      type: 'string'
    },
    {
      columnName: 'Descripcion',
      field: 'description',
      type: 'string'
    },
    {
      columnName: 'Icono',
      field: 'icon',
      type: 'string'
    },
    {
      columnName: 'Ruta',
      field: 'url',
      type: 'string'
    }
  ]

  data:IModule[];

  eventsTable: IEventTable[] = [
    {
      permiso: 'WRITE',
      icon: 'cil-pencil',
      color: 'info',
      description: 'Editar'
    },
    {
      permiso: 'DELETE',
      icon: 'cil-trash',
      color: 'danger',
      description: 'Eliminar'
    }
  ];

  constructor(
    private moduleService: ModuleService
  ) {
    this.data = [];
   }

  ngOnInit(): void {
    this.consultar();
  }

  consultar() {
    this.moduleService.Modules().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.data = respuesta.data;
        setTimeout(() => {
          this.table.viewData();
        }, 500);
      }
    }, (error) => {
      this.alert.sweetAlert('Confirmación', 
        'Error', 
        'error',
        true,
        false,
        'OK'
      ).then((result) => {
              console.log(result);
      }).catch((error) => {
              console.log(error);
      });
    });
  }

  /** fucntion call modal */
  toggleLiveDemo(id?: number) {
    this.createOrEditModule.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'WRITE': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'DELETE': {
        this.alert.sweetAlert('Esta seguro de eliminar el módulo?', 'No podrá recuperar la informacón!', 
          'warning', true, true)
        .then((result) => {
          if(result.value) {
            //eliminar
            console.log('ELIMINAR');
          }
        })
        break;
      }
      default:{
        break;
      }
    }
  }
}
