import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { Alert } from 'src/app/core/class/Alert';
import { ProfilePermissionList } from '../../interfaces/profilepermissionlist.interface';
import { ProfilePermissionService } from '../../services/profile-permission.service';
import { ProfileTransacction } from '../../interfaces/profiletransacction.interface';
import { ProfileService } from '../../services/profile.service';
import { ModuleService } from '../../services/module.service';
import { IModule } from '../../interfaces/IModule.interface';
import { Profile } from '../../interfaces/profile.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { CreateOrEditTransactionComponent } from '../../components/create-or-edit-transaction/create-or-edit-transaction.component';
import { CreateOrEditProfilePermissionComponent } from '../../components/create-or-edit-profile-permission/create-or-edit-profile-permission.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-profile-permission',
  templateUrl: './profile-permission.component.html',
  styleUrls: ['./profile-permission.component.scss']
})
export class ProfilePermissionComponent implements OnInit, AfterViewInit {

  @ViewChild('createOrEditProfilePermission') createOrEditProfilePermission!: CreateOrEditProfilePermissionComponent;
  @ViewChild('table') table!: TableComponent;

  title = 'Lista de permisos';

  alert = new Alert();

  headers: IHeaders[] = [
    {
      columnName: 'Perfil',
      field: 'profilename',
      type: 'string'
    },
    {
      columnName: 'Modulo',
      field: 'modulename',
      type: 'string'
    },
    {
      columnName: 'Pantalla',
      field: 'transactionname',
      type: 'string'
    }
  ];

  data:ProfileTransacction[];

  eventsTable: IEventTable[] = [
    {
      permiso: 'WRITE',
      icon: 'cil-pencil',
      color: 'primary',
      description: 'Editar'
    },
    {
      permiso: 'DELETE',
      icon: 'cil-trash',
      color: 'danger',
      description: 'Eliminar'
    }
  ];

  modules:IModule[];
  profiles: Profile[];

  form!: FormGroup;

  constructor(
    private profileService: ProfileService,
    private moduleService: ModuleService,
    private profilePermissionService: ProfilePermissionService
  ) {
    this.data = [];
   }
   
  ngAfterViewInit(): void {
    this.consultar();
  }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.getProfiles();
    this.getModules();
    
  }

  buildForm() {
    return new FormGroup({
      idprofile:new FormControl(0, [Validators.required]), 
      idmodule: new FormControl(0, [Validators.required]),
    });
  }

  getProfiles() {
    this.profileService.Profiles().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.profiles = respuesta.data;
      }
      else {
        this.profiles = [];
      }
    }, (error) => {
      this.profiles = [];
    });
  }

  getModules() {
    this.moduleService.Modules().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.modules = respuesta.data;
      }
      else {
        this.modules = [];
      }
    }, (error) => {
      this.modules = [];
    });
  }

  consultar() {
    this.data = [];
    this.profilePermissionService.ProfilePermissions(this.form.get('idprofile').value,this.form.get('idmodule').value).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.data = respuesta.data;
        setTimeout(() => {
          this.table.viewData();
        }, 500);
      }
    }, (error) => {
      this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK'
      ).then((result) => {
              console.log(result);
      }).catch((error) => {
              console.log(error);
      });
    });
  }

  /** fucntion call modal */
  toggleLiveDemo(id?: number) {
    this.createOrEditProfilePermission.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'WRITE': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'DELETE': {
        this.alert.sweetAlert('Estas seguro eliminar modulo?', 'No podras recuperar el modulo!', 
          'warning', true, true)
        .then((result) => {
          if(result.value) {
            //eliminar
            this.profilePermissionService.DeleteProfilePermission(data.item.id).subscribe(
              (respuesta) => {
                if(!respuesta.error) {
                  this.alert.sweetAlert('Confirmación', respuesta.message, 
                    'success', true, false, 'OK'
                  ).then((result) => {
                    console.log(result);
                    this.consultar();
                  }).catch((error) => {
                    console.log(error);
                  });
                }
                else {
                  this.alert.sweetAlert('Información', 
                  respuesta.message, 
                  'info',
                  true,
                  false,
                  'OK'
                ).then((result) => {
                  console.log(result);
                }).catch((error) => {
                  console.log(error);
                });
                }
              }, (error) => {
                this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK'
                ).then((result) => {
                  console.log(result);
                }).catch((error) => {
                  console.log(error);
                });
              }
            )
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
