import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { User } from 'src/app/core/class/User';
import { Alert } from 'src/app/core/class/Alert';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { AssetRequestService } from '../../services/asset-request.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ProformRequestComponent } from '../../components/proform-request/proform-request.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICatalog } from '../../interfaces/ICatalog';
import { IProcessState } from '../../interfaces/IProcessState';
import { CatalogService } from '../../services/catalog-service';
import { ProcessStateService } from '../../services/process-state.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { GuideRequestComponent } from '../../components/guide-request/guide-request.component';

@Component({
  selector: 'app-request-denied',
  templateUrl: './request-denied.component.html',
  styleUrls: ['./request-denied.component.css']
})
export class RequestDeniedComponent implements OnInit {

  @ViewChild('proformRequest') proformRequest!: ProformRequestComponent;
  @ViewChild('guideRequest') guideRequest!: GuideRequestComponent;
  @ViewChild('table') table!: TableComponent;

  consultando: boolean = false;
  
  form!: FormGroup;

  public types: ICatalog[];
  public priorities: ICatalog[];
  public processStates: IProcessState[];
  public catalogStates: ICatalog[];
  
  private user!: User | null;
  private currentAgencyId: number;
  data:IAssetRequest[];

  alert = new Alert();

  title: string = 'Listado de Solicitudes';

  headers: IHeaders[] = [
    {
      columnName: 'Fecha Hora',
      field: 'datecreate',
      type: 'datetime'
    },
    {
      columnName: 'Sociedad Facturada',
      field: 'companydescription',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Agencia',
      field: 'agencydescripcion',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Area',
      field: 'derparmentdescription',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Tipo Solicitud',
      field: 'type',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Prioridad',
      field: 'priority',
      type: 'string'
    },
    {
      columnName: 'Estado',
      field: 'state',
      type: 'string',
      isModify: false
    }
  ]

  eventsTable: IEventTable[] = [
    {
      permiso: 'PROFORMA',
      icon: 'cil-file',
      color: 'success',
      description: 'Cargar proforma'
    },
    {
      permiso: 'GUIA',
      icon: 'cil-description',
      color: 'info',
      description: 'Guia de remision'
    },
    
  ];
  currentUserId: any;

  constructor(
    private assetRequestService: AssetRequestService,
    private catalogService: CatalogService,
    private processStateService: ProcessStateService,
    private storageService: StorageService,
  ) {
    this.user = this.storageService.getCurrentUser();
    this.data = [];

    this.types = [];
    this.priorities = [];
    this.processStates = [];
    let currentdate = new Date();
    let currentDateEnd = new Date();
    currentDateEnd.setMonth(currentDateEnd.getMonth() - 1);
    this.form = new FormGroup({
      datefrom: new FormControl(currentDateEnd.getFullYear() + "-" + (currentDateEnd.getMonth() + 1).toString().padStart(2, '0') + "-" + currentDateEnd.getDate().toString().padStart(2, '0'), Validators.required),
      dateend: new FormControl(  currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1).toString().padStart(2, '0') + "-" + currentdate.getDate().toString().padStart(2, '0'), Validators.required),
      processstateid: new FormControl(null),
      catalogid: new FormControl(null),
      prioritytypeid: new FormControl(null)
    });
    this.getProcessStates();
    this.getTypes('TPS');
    this.getPriorities('TP');
    this.getCatalogStates('EP');
   }

  ngOnInit() {
    if(this.user) {
      this.currentAgencyId = this.user.agencyid;
    }
    this.consultar();
  }

  refreshData() {
    this.consultar()
  }

  getProcessStates() {
    this.processStateService.getProcessStates().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.processStates = respuesta.data.filter((item) => item.code == 'APROBADO' || item.code == 'ENVIO_PROFORMA' || item.code == 'PROFORMA_APROBADA' || item.code == 'PROFORMA_RECHAZADA' || item.code == 'GUIA_REMISION');;
        this.processStates.unshift({
          id: null,
          name: 'Todos',
          code: 'Todos',
          description: 'Todos'
        });
      }
      else {
        this.processStates = [];
      }
    }, (error) => {
      this.processStates = [];
    });
  }

  getTypes(code: string) {
    this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.types = respuesta.data;
        this.types.unshift({
          id: null,
          name: 'Todos',
          code: 'Todos',
          description: 'Todos'
        })
      }
      else {
        this.types =  [];
      }
    }, (error) => {
      this.types =  [];
    });
  }

  getPriorities(code: string) {
    this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.priorities = respuesta.data;
        this.priorities.unshift({
          id: null,
          name: 'Todos',
          code: 'Todos',
          description: 'Todos'
        })
      }
      else {
        this.priorities =  [];
      }
    }, (error) => {
      this.priorities =  [];
    });
  }

  getCatalogStates(code: string) {
    return this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.catalogStates = respuesta.data;
      }
      else {
        this.catalogStates = [];
      }
    }, (error) => {
      this.catalogStates = [];
    });
  }

  consultar() {
    this.consultando = true;
    let endDate = new Date(this.form.get('dateend').value)
    endDate.setDate(endDate.getDate() + 1);
    let params = {
      "p_datefrom": new Date(this.form.get('datefrom').value).toISOString(),
      "p_dateend": endDate,
      "p_agencyid": this.currentAgencyId,
      "p_catalogid": this.form.get('catalogid').value ? Number.parseInt(this.form.get('catalogid').value)  : this.form.get('catalogid').value,
      "p_prioritytypeid": this.form.get('prioritytypeid').value ? Number.parseInt(this.form.get('prioritytypeid').value)  : this.form.get('prioritytypeid').value,
      "p_state": this.form.get('processstateid').value ? Number.parseInt(this.form.get('processstateid').value)  : this.form.get('processstateid').value
    };
    this.assetRequestService.RequestDeniedFilters(params).subscribe((respuesta) => {
      this.consultando = false;
      if(!respuesta.error) {
        this.data = respuesta.data;
        setTimeout(() => {
          this.table.viewData();
        }, 500);
      }
    }, (error) => {
      this.consultando = false;
      this.alert.sweetAlert('Confirmación', 
        'Error', 
        'error',
        true,
        false,
        'OK'
      ).then((result) => {
              console.log(result);
      }).catch((error) => {
              console.log(error);
      });
    });
  }


  /** fucntion call modal */
  toggleLiveDemo(id?: number) {
    this.proformRequest.toggleLiveDemo(id);
  }

  toggleLiveDemoGuide(id?: number) {
    this.guideRequest.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'PROFORMA': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      
      case 'GUIA': {
        this.toggleLiveDemoGuide(data.item.id);
        break;
      }
      default:{
        break;
      }
    }
  }
}
