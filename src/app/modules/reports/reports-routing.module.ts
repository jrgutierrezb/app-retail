import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './components/report/report.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reportes'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reportes'
      },
      {
        path: 'report',
        component: ReportComponent,
        data: {
          title: 'Reporte'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
