import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CalloutModule, DropdownModule, GridModule, ModalModule, NavModule, PaginationModule, SpinnerModule, TableModule, TabsModule, TooltipModule, UtilitiesModule } from '@coreui/angular';
import { DxDataGridModule, DxListModule, DxDropDownBoxModule, DxTagBoxModule, DxFileUploaderModule, DxButtonModule } from 'devextreme-angular';
import { IconModule } from '@coreui/icons-angular';
import { RouterModule } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { DataGridComponent } from './components/data-grid/data-grid.component';
import { GridMasterDetailComponent } from './components/grid-master-detail/grid-master-detail.component';
import { GridDetailComponent } from './components/grid-master-detail/grid-detail/grid-detail.component';
import { ComponentContainerComponent } from './components/component-container/component-container.component';
import { ValidatorsModule } from "./directives/validators.module";
import { ShowFileComponent } from './components/show-file/show-file.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    ComponentContainerComponent,
    TableComponent,
    DataGridComponent,
    GridMasterDetailComponent,
    GridDetailComponent,
    ShowFileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    NavModule,
    IconModule,
    ModalModule,
    RouterModule,
    TabsModule,
    TableModule,
    UtilitiesModule,
    CalloutModule,
    DropdownModule,
    GridModule,
    DxDataGridModule,
    DxListModule,
    DxDropDownBoxModule,
    DxTagBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
    TooltipModule,
    ValidatorsModule,
    PdfViewerModule,
    SpinnerModule,
    PaginationModule,
    TabsModule,
    NavModule
  ],
  exports: [
    ComponentContainerComponent,
    TableComponent,
    DataGridComponent,
    GridMasterDetailComponent,
    GridDetailComponent,
    FormsModule,
    ReactiveFormsModule,
    DxFileUploaderModule,
    DxButtonModule,
    ValidatorsModule,
    ShowFileComponent,
    TabsModule,
    NavModule
  ]
})
export class SharedRetailModule { }
