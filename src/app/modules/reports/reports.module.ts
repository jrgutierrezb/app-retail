import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportComponent } from './components/report/report.component';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { BadgeModule, ButtonModule, CardModule, FormModule, GridModule, SharedModule, SpinnerModule, TableModule } from '@coreui/angular';
import { DocsComponentsModule } from '@docs-components/docs-components.module';
import { SharedRetailModule } from 'src/app/shared/shared-retail.module';
import { ReportStateComponent } from './pages/report-state/report-state.component';
import { ReportTypeRequestComponent } from './pages/report-type-request/report-type-request.component';
import { ReportPriorityComponent } from './pages/report-priority/report-priority.component';
import { GeneralReportComponent } from './pages/general-report/general-report.component';


@NgModule({
  declarations: [
    ReportComponent,
    ReportStateComponent,
    ReportPriorityComponent,
    ReportTypeRequestComponent,
    GeneralReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ButtonModule,
    ChartjsModule,
    FormModule,
    CardModule,
    GridModule,
    BadgeModule,
    SpinnerModule,
    TableModule,
    DocsComponentsModule,
    SharedModule,
    SharedRetailModule
  ]
})
export class ReportsModule { }
