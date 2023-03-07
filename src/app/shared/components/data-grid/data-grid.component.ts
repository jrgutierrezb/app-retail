import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { IHeaders } from '../../interfaces/headers';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {

  @ViewChild(DxDataGridComponent) grid: DxDataGridComponent;

  public nameEditorOptions: Object;

  @Input() headers!: IHeaders[];

  @Input() dataSource!: any[];
  @Input() mode: 'row' | 'popup' = 'row';
  @Input() titlePopup: string = '';
  @Input() lookups: any[];

  @Input() allowAdding: boolean = false;
  @Input() allowUpdating: boolean = false;
  @Input() allowDeleting: boolean = false;

  @Output() initNewRow = new EventEmitter<any>();

  constructor() {
    this.nameEditorOptions = { readonly: true };
   }

  ngOnInit() {
  }

  logEvent(eventname:string, event: any) {
    console.log(eventname, event);
  }

  onInitNewRow(event: any) {
    this.initNewRow.emit(event);
  }

  cancelNewRow() {
  }

  getLookup(field: string) {
    return this.lookups.find(item => item.field === field).lookup;
  }

}
