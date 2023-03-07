import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetRequestComponent } from './pages/asset-request/asset-request.component';
import { RequestApprovedComponent } from './pages/request-approved/request-approved.component';
import { RequestDeniedComponent } from './pages/request-denied/request-denied.component';
import { InventoryComponent } from './pages/inventory/inventory.component';

import { ManagementRoutingModule } from './management-routing.module';

import { AccordionModule, AlertModule, BadgeModule, BreadcrumbModule, ButtonModule, CalloutModule, CardModule, CarouselModule, CollapseModule, DropdownModule, FormModule, GridModule, ListGroupModule, ModalModule, NavModule, PaginationModule, PlaceholderModule, PopoverModule, ProgressModule, SharedModule, SpinnerModule, TableModule, TabsModule, TooltipModule, UtilitiesModule } from '@coreui/angular';
import { SharedRetailModule } from '../../shared/shared-retail.module';
import { CreateAssetRequestComponent } from './components/create-asset-request/create-asset-request.component';
import { ApproveRequestComponent } from './components/approve-request/approve-request.component';
import { DeniedRequestComponent } from './components/denied-request/denied-request.component';
import { ProformRequestComponent } from './components/proform-request/proform-request.component';
import { ManagerApprovedRequestComponent } from './pages/manager-approved-request/manager-approved-request.component';
import { ApprovedProformRequestComponent } from './components/approved-proform-request/approved-proform-request.component';
import { DeniedProformRequestComponent } from './components/denied-proform-request/denied-proform-request.component';
import { GuideRequestComponent } from './components/guide-request/guide-request.component';
import { InventoryRegisterComponent } from './components/inventory-register/inventory-register.component';
import { DispathRequestComponent } from './components/dispath-request/dispath-request.component';
import { WarehouseRequestComponent } from './components/warehouse-request/warehouse-request.component';
import { WareHouseComponent } from './pages/ware-house/ware-house.component';
import { ReceivedRequestComponent } from './components/received-request/received-request.component';
 

@NgModule({
  declarations: [
    AssetRequestComponent,
    CreateAssetRequestComponent,
    RequestApprovedComponent,
    ApproveRequestComponent,
    DeniedRequestComponent,
    RequestDeniedComponent,
    ProformRequestComponent,
    ManagerApprovedRequestComponent,
    ApprovedProformRequestComponent,
    DeniedProformRequestComponent,
    GuideRequestComponent,
    InventoryComponent,
    InventoryRegisterComponent,
    DispathRequestComponent,
    WarehouseRequestComponent,
    WareHouseComponent,
    ReceivedRequestComponent
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
    ManagementRoutingModule
  ],
  exports:[
    CreateAssetRequestComponent,
    ApproveRequestComponent,
    DeniedRequestComponent,
    ProformRequestComponent,
    ApprovedProformRequestComponent,
    DeniedProformRequestComponent,
    GuideRequestComponent,
    InventoryRegisterComponent,
    DispathRequestComponent,
    WarehouseRequestComponent,
    ReceivedRequestComponent
  ]
})
export class ManagementModule { }
