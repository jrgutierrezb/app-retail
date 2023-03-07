import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportComponent } from './components/report/report.component';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { BadgeModule, CardModule, GridModule, SharedModule } from '@coreui/angular';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { SharedRetailModule } from 'src/app/shared/shared-retail.module';
import { ReportStateComponent } from './pages/report-state/report-state.component';
import { ReportTypeRequestComponent } from './pages/report-type-request/report-type-request.component';
import { ReportPriorityComponent } from './pages/report-priority/report-priority.component';


@NgModule({
  declarations: [
    ReportComponent,
    ReportStateComponent,
    ReportPriorityComponent,
    ReportTypeRequestComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ChartjsModule,
    CardModule,
    GridModule,
    BadgeModule,
    DocsComponentsModule,
    SharedRetailModule
  ]
})
export class ReportsModule { }
