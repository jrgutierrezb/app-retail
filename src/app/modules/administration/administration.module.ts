import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { UserComponent } from './pages/users/user.component';
import { ModuleComponent } from './pages/modules/modules.component';
import { TransactionComponent } from './pages/transactions/transaction.component';
import { ProfilePermissionComponent } from './pages/profilePermission/profile-permission.component';

import { AccordionModule, AlertModule, BadgeModule, BreadcrumbModule, ButtonModule, CalloutModule, CardModule, CarouselModule, CollapseModule, DropdownModule, FormModule, GridModule, ListGroupModule, ModalModule, NavModule, PaginationModule, PlaceholderModule, PopoverModule, ProgressModule, SharedModule, SpinnerModule, TableModule, TabsModule, TooltipModule, UtilitiesModule } from '@coreui/angular';
import { SharedRetailModule } from '../../shared/shared-retail.module';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateOrEditModuleComponent } from './components/create-or-edit-module/create-or-edit-module.component';
import { CreateOrEditMailSettingComponent } from './components/create-or-edit-mail-setting/create-or-edit-mail-setting.component';
import { CreateOrEditTransactionComponent } from './components/create-or-edit-transaction/create-or-edit-transaction.component';
import { CreateOrEditProfilePermissionComponent } from './components/create-or-edit-profile-permission/create-or-edit-profile-permission.component';


@NgModule({
  declarations: [
    UserComponent,
    ModuleComponent,
    TransactionComponent,
    ProfilePermissionComponent,
    CreateUserComponent,
    CreateOrEditModuleComponent,
    CreateOrEditMailSettingComponent,
    CreateOrEditTransactionComponent,
    CreateOrEditProfilePermissionComponent
  ],
  imports: [
    CommonModule,
    AlertModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    CollapseModule,
    DropdownModule,
    FormModule,
    GridModule,
    ListGroupModule,
    ModalModule,
    NavModule,
    PaginationModule,
    PlaceholderModule,
    PopoverModule,
    ProgressModule,
    SharedModule,
    SharedRetailModule,
    SpinnerModule,
    TableModule,
    TabsModule,
    TooltipModule,
    UtilitiesModule,
    CalloutModule,
    AdministrationRoutingModule
  ],
  exports:[
    CreateUserComponent,
    CreateOrEditModuleComponent,
    CreateOrEditTransactionComponent,
    CreateOrEditProfilePermissionComponent
  ]
})
export class AdministrationModule { }
