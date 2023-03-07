import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrEditMailSettingComponent } from './components/create-or-edit-mail-setting/create-or-edit-mail-setting.component';
import { UserComponent } from './pages/users/user.component';
import { ModuleComponent } from './pages/modules/modules.component';
import { TransactionComponent } from './pages/transactions/transaction.component';
import { ProfilePermissionComponent } from './pages/profilePermission/profile-permission.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Administración'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users'
      },
      {
        path: 'users',
        component: UserComponent,
        data: {
          title: 'Usuarios'
        }
      },
      {
        path: 'mailsettings',
        component: CreateOrEditMailSettingComponent,
        data: {
          title: 'Configuración Correo'
        }
      },
      {
        path: 'modules',
        component: ModuleComponent,
        data: {
          title: 'Modulos'
        },
      },
      {
        path: 'transactions',
        component: TransactionComponent,
        data: {
          title: 'Pantallas'
        },
      },
      {
        path: 'profilepermission',
        component: ProfilePermissionComponent,
        data: {
          title: 'Permisos perfiles'
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
