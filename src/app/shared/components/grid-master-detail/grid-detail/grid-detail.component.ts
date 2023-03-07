import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';

@Component({
  selector: 'app-grid-detail',
  templateUrl: './grid-detail.component.html',
  styleUrls: ['./grid-detail.component.css']
})
export class GridDetailComponent implements OnInit {

  @Output() editorPreparing = new EventEmitter<any>();

  public nameEditorOptions: Object;

  @Input() titleDetail: string;
  @Input() headers!: IHeaders[];

  @Input() dataSource!: any[];
  @Input() mode: 'row' | 'popup' = 'row';
  @Input() titlePopup: string = '';
  @Input() lookups: any[];

  @Input() allowAdding: boolean = false;
  @Input() allowUpdating: boolean = false;
  @Input() allowDeleting: boolean = false;

  editorOptions: any;

  constructor() {
    this.nameEditorOptions = { readonly: true };
    this.editorOptions = {
      format: 'currency',
    };
   }

  ngOnInit() {
  }

  logEvent(eventname:string, event: any) {
    console.log(eventname, event);
  }

  onEditorPreparing(e: any) {
    console.log(e);
    this.editorPreparing.emit(e);
  }

  getLookup(field: string) {
    return this.lookups.find(item => item.field === field).lookup;
  }

}
