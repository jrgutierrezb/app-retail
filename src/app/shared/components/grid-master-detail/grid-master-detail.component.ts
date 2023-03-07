import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { DxFileUploaderComponent } from 'devextreme-angular';
import { OutputFileType } from 'typescript/lib/tsserverlibrary';
import { IHeaders } from '../../interfaces/headers';

@Component({
  selector: 'app-grid-master-detail',
  templateUrl: './grid-master-detail.component.html',
  styleUrls: ['./grid-master-detail.component.css']
})
export class GridMasterDetailComponent implements OnInit {

  @Output() saved = new EventEmitter<any>();
  @Output() rowInserting = new EventEmitter<any>();
  @Output() editorPreparing = new EventEmitter<any>();
  @Output() editorPreparingDetail = new EventEmitter<any>();
  @Output() rowInserted = new EventEmitter<any>();
  @Output() showFile = new EventEmitter<any>();
  @Output() selectionChanged = new EventEmitter<any>();

  retryButtonVisible = false;
  @ViewChild('fileUploader') fileUploaderRef: DxFileUploaderComponent;

  public nameEditorOptions: Object;

  @Input() headers!: IHeaders[];

  @Input() dataSource!: any[];
  @Input() mode: 'row' | 'popup' = 'row';
  @Input() titlePopup: string = '';
  @Input() lookups: any[];

  @Input() allowAdding: boolean = false;
  @Input() allowUpdating: boolean = false;
  @Input() allowDeleting: boolean = false;
  @Input() isSelect: boolean = false;
  @Input() modeSelect: 'single' | 'multiple' = 'single';

  /** Inputs Detalle */

  @Input() hasDetail: boolean = false;
  @Input() titleDetail: string;
  @Input() keyDetail: string;
  @Input() headerDetail!: IHeaders[];
  @Input() modeDetail: 'row' | 'popup' = 'row';
  @Input() titlePopupDetail: string = '';
  @Input() lookupDetail: any[];

  @Input() allowAddingDetail: boolean = false;
  @Input() allowUpdatingDetail: boolean = false;
  @Input() allowDeletingDetail: boolean = false;
  
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

  onClick(e: any): void {
    // The retry UI/API is not implemented. Use a private API as shown at T611719.
    const fileUploaderInstance = this.fileUploaderRef.instance;
    // @ts-ignore
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < fileUploaderInstance._files.length; i++) {
      // @ts-ignore
      delete fileUploaderInstance._files[i].uploadStarted;
    }
    // @ts-ignore
    fileUploaderInstance.upload();
  }

  async onValueChanged(e: any, cellInfo: any) {
    const reader: FileReader = new FileReader();
    reader.onload = (args) => {
      if (typeof args.target.result === 'string') {
        console.log(args.target.result);
      }
    };
     
     if(e.value.length > 0) {
      // convert to base64 string
      let file = await this.convertBase64(e.value[0]);
      cellInfo.setValue(file);
      return;
     }
    
    cellInfo.setValue('');
  }

  async convertBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
  }

  onUploaded(e: any, cellInfo: any): void {
    cellInfo.setValue('images/employees/' + e.request.responseText);
    this.retryButtonVisible = false;
  }

  onUploadError(e: any): void {
    const xhttp = e.request;
    if (xhttp.status === 400) {
      e.message = e.error.responseText;
    }
    if (xhttp.readyState === 4 && xhttp.status === 0) {
      e.message = 'Connection refused';
    }
    this.retryButtonVisible = true;
  }

  onEditCanceled(e: any): void {
    if (this.retryButtonVisible) {
      this.retryButtonVisible = false;
    }
  }

  onSaved(e: any): void {
    this.saved.emit(e);
  }

  onRowInserting(e: any) {
    e.data[this.keyDetail] = [];;
    this.rowInserting.emit(e);
  }

  onRowInserted(e: any) {
    this.rowInserted.emit(e);
  }

  onEditorPreparing(e: any) {
    console.log(e);
    this.editorPreparing.emit(e);
  }

  onEditorPreparingDetail(e: any) {
    console.log(e);
    this.editorPreparingDetail.emit(e);
  }

  fileOpen(data:any) {
    this.showFile.emit(data);
  }

  onSelectionChanged(event: any) {
    this.selectionChanged.emit(event);
  }

  getLookup(field: string) {
    return this.lookups.find(item => item.field === field).lookup;
  }

}

