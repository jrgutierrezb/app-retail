import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alert } from 'src/app/core/class/Alert';
import { User } from 'src/app/core/class/User';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ApprovedProformRequestComponent } from '../../components/approved-proform-request/approved-proform-request.component';
import { DeniedProformRequestComponent } from '../../components/denied-proform-request/denied-proform-request.component';
import { ReceivedRequestComponent } from '../../components/received-request/received-request.component';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { ICatalog } from '../../interfaces/ICatalog';
import { IProcessState } from '../../interfaces/IProcessState';
import { AssetRequestService } from '../../services/asset-request.service';
import { CatalogService } from '../../services/catalog-service';
import { ProcessStateService } from '../../services/process-state.service';

@Component({
  selector: 'app-manager-approved-request',
  templateUrl: './manager-approved-request.component.html',
  styleUrls: ['./manager-approved-request.component.css']
})
export class ManagerApprovedRequestComponent implements OnInit {

  @ViewChild('approveproformRequest') approveproformRequest!: ApprovedProformRequestComponent;
  @ViewChild('deniedproformRequest') deniedproformRequest!: DeniedProformRequestComponent;
  @ViewChild('receivedRequest') receivedRequest!: ReceivedRequestComponent;
  @ViewChild('table') table!: TableComponent;

  consultando: boolean = false;
  
  form!: FormGroup;

  public types: ICatalog[];
  public priorities: ICatalog[];
  public processStates: IProcessState[];

  private user!: User | null;
  private currentAgencyId: number;
  data:IAssetRequest[];

  alert = new Alert();

  title: string = 'Listado de Solicitudes';

  headers: IHeaders[] = [
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
      columnName: 'Estado',
      field: 'state',
      type: 'string',
      isModify: false
    }
  ]

  eventsTable: IEventTable[] = [
    {
      permiso: 'PROFORMA',
      icon: 'cil-check-circle',
      color: 'success',
      description: 'Aprobar'
    },
    {
      permiso: 'RECIBIR',
      icon: 'cil-level-up',
      color: 'warning',
      description: 'Recibir'
    },
    {
      permiso: 'RECHAZAR',
      icon: 'cil-x-circle',
      color: 'danger',
      description: 'Rechazar'
    }
  ];

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
   }

  ngOnInit() {
    if(this.user) {
      this.currentAgencyId = this.user.agencyid;
    }
    this.consultar();
  }

  refreshData(refresh: boolean) {
    if(!refresh) {
      this.consultar()
    }
  }

  getProcessStates() {
    this.processStateService.getProcessStates().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.processStates = respuesta.data.filter((item) => item.code == 'APROBADO' || item.code == 'ENVIO_PROFORMA' || item.code == 'PROFORMA_APROBADA' || 
                                                              item.code == 'PROFORMA_RECHAZADA' || item.code == 'DESPACHADO' || item.code == 'DEVOLUCION');;
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
    this.assetRequestService.RequestApprovedManagerFilters(params).subscribe((respuesta) => {
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
    this.approveproformRequest.toggleLiveDemo(id);
  }

  toggleLiveDemoDenied(id?: number) {
    this.deniedproformRequest.toggleLiveDemo(id);
  }

  toggleLiveDemoReceived(id?: number) {
    this.receivedRequest.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'PROFORMA': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'RECHAZAR': {
        this.toggleLiveDemoDenied(data.item.id);
        break;
      }
      case 'RECIBIR': {
        this.toggleLiveDemoReceived(data.item.id);
        break;
      }
      default:{
        break;
      }
    }
  }

}
