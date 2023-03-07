import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { CreateUserComponent } from '../../components/create-user/create-user.component';
import { Alert } from 'src/app/core/class/Alert';
import { IUser } from '../../interfaces/IUser';
import { UserService } from '../../services/user.service';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @ViewChild('createUser')
  createUser!: CreateUserComponent;
  @ViewChild('table') table!: TableComponent;

  alert = new Alert();

  headers: IHeaders[] = [
    {
      columnName: 'Identificación',
      field: 'identification',
      type: 'string'
    },
    {
      columnName: 'Nombre',
      field: 'firstname',
      type: 'string'
    },
    {
      columnName: 'Apellido',
      field: 'lastname',
      type: 'string'
    },
    {
      columnName: 'Usuario',
      field: 'username',
      type: 'string'
    },
    {
      columnName: 'Correo Electrónico',
      field: 'mail',
      type: 'string'
    },
    {
      columnName: 'Teléfono',
      field: 'telephone',
      type: 'string'
    },
    {
      columnName: 'Celular',
      field: 'cellphone',
      type: 'string'
    },
  ]

  data:IUser[];

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
    private userService: UserService
  ) {
    this.data = [];
   }

  ngOnInit(): void {
    this.consultar();
  }

  consultar() {
    this.userService.Users().subscribe((respuesta) => {
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
    this.createUser.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    console.log(data);
    switch(data.permiso) {
      case 'WRITE': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'DELETE': {
        this.alert.sweetAlert('Esta seguro de eliminar el usuario?', 
          'No podrá recuperar la información!', 
          'warning',
          true,
          true
        ).then((result) => {
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
