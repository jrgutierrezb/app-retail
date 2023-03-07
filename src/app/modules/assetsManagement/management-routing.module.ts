import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetRequestComponent } from './pages/asset-request/asset-request.component';
import { RequestApprovedComponent } from './pages/request-approved/request-approved.component';
import { RequestDeniedComponent } from './pages/request-denied/request-denied.component';
import { ManagerApprovedRequestComponent } from './pages/manager-approved-request/manager-approved-request.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { WareHouseComponent } from './pages/ware-house/ware-house.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Solicitudes'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'solicitudes'
      },
      {
        path: 'solicitudes',
        component: AssetRequestComponent,
        data: {
          title: 'Solicitudes'
        }
      },
      {
        path: 'aprobacionTecnica',
        component: RequestApprovedComponent,
        data: {
          title: 'Aprobación Técnica'
        }
      },
      {
        path: 'proformaSolicitud',
        component: RequestDeniedComponent,
        data: {
          title: 'Proforma Solicitud'
        }
      },
      {
        path: 'aprobacionSolicitud',
        component: ManagerApprovedRequestComponent,
        data: {
          title: 'Aprobacion Gerencia'
        }
      },
      {
        path: 'inventarios',
        component: InventoryComponent,
        data: {
          title: 'CDI'
        }
      },
      {
        path: 'bodega',
        component: WareHouseComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
