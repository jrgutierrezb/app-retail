import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { User } from 'src/app/core/class/User';
import { Alert } from 'src/app/core/class/Alert';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { AssetRequestService } from '../../services/asset-request.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ApproveRequestComponent } from '../../components/approve-request/approve-request.component';
import { DeniedRequestComponent } from '../../components/denied-request/denied-request.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../services/catalog-service';
import { ProcessStateService } from '../../services/process-state.service';
import { ICatalog } from '../../interfaces/ICatalog';
import { IProcessState } from '../../interfaces/IProcessState';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { WarehouseRequestComponent } from '../../components/warehouse-request/warehouse-request.component';

@Component({
  selector: 'app-request-approved',
  templateUrl: './request-approved.component.html',
  styleUrls: ['./request-approved.component.css']
})
export class RequestApprovedComponent implements OnInit {

  @ViewChild('approveRequest') approveRequest!: ApproveRequestComponent;
  @ViewChild('deniedRequest') deniedRequest!: DeniedRequestComponent;
  @ViewChild('wareHouseRequest') wareHouseRequest!: WarehouseRequestComponent;
  @ViewChild('table') table!: TableComponent;

  private user!: User | null;
  
  data:IAssetRequest[];

  alert = new Alert();

  consultando: boolean = false;

  title: string = 'Listado Solicitudes'

  form!: FormGroup;
  public types: ICatalog[];
  public priorities: ICatalog[];
  public processStates: IProcessState[];
  private currentUserId: number;
  private currentAgencyId: number;

  headers: IHeaders[] = [
    {
      columnName: 'Fecha Hora',
      field: 'datecreate',
      type: 'datetime'
    },
    {
      columnName: 'Sociedad Facturada',
      field: 'companydescription',
      type: 'string'
    },
    {
      columnName: 'Agencia',
      field: 'agencydescripcion',
      type: 'string'
    },
    {
      columnName: 'Area',
      field: 'derparmentdescription',
      type: 'string'
    },
    {
      columnName: 'Tipo Solicitud',
      field: 'type',
      type: 'string'
    },
    {
      columnName: 'Prioridad',
      field: 'priority',
      type: 'string'
    },
    {
      columnName: 'Estado',
      field: 'state',
      type: 'string'
    }
  ]

  eventsTable: IEventTable[] = [
    {
      permiso: 'ASIGNAR',
      icon: 'cil-arrow-circle-right',
      color: 'info',
      description: 'Asignar'
    },
    {
      permiso: 'APROBAR',
      icon: 'cil-check-circle',
      color: 'success',
      description: 'Aprobar'
    },
    {
      permiso: 'MANTENIMIENTO',
      icon: 'cil-settings',
      color: 'warning',
      description: 'Mantenimiento'
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
      this.currentUserId = this.user.id;
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
        this.processStates = respuesta.data.filter((item) => item.code == 'INGRESADO' || item.code == 'PENDIENTE' || item.code == 'APROBADO' || item.code == 'RECHAZADO');;
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
      "p_catalogid": this.form.get('catalogid').value ? Number.parseInt(this.form.get('catalogid').value)  : this.form.get('catalogid').value,
      "p_prioritytypeid": this.form.get('prioritytypeid').value ? Number.parseInt(this.form.get('prioritytypeid').value)  : this.form.get('prioritytypeid').value,
      "p_datefrom2": new Date(this.form.get('datefrom').value).toISOString(),
      "p_dateend2": endDate,
      "p_useridassigned": this.currentUserId,
      "p_catalogid2": this.form.get('catalogid').value ? Number.parseInt(this.form.get('catalogid').value)  : this.form.get('catalogid').value,
      "p_prioritytypeid2": this.form.get('prioritytypeid').value ? Number.parseInt(this.form.get('prioritytypeid').value)  : this.form.get('prioritytypeid').value,
      "p_state": this.form.get('processstateid').value ? Number.parseInt(this.form.get('processstateid').value)  : this.form.get('processstateid').value
    };
    this.assetRequestService.RequestAssignedFilters(params).subscribe((respuesta) => {
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
    this.approveRequest.toggleLiveDemo(id);
  }

  toggleLiveDemoDenied(id?: number) {
    this.deniedRequest.toggleLiveDemo(id);
  }

  toggleLiveDemoWareHouse(id?: number) {
    this.wareHouseRequest.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'APROBAR': {
        if(data.item.type === 'Mantenimiento') {
          this.alert.sweetAlert('Información', 'Las solicitudes por mantenimiento se verifican en bodega',  'warning', true, false, 'OK').then((result) => {
            console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          return;
        }
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'MANTENIMIENTO': {
        if(data.item.type === 'Requerimiento') {
          this.alert.sweetAlert('Información', 'Las solicitudes por requerimiento se aprueban o rechazan',  'warning', true, false, 'OK').then((result) => {
            console.log(result);
          }).catch((error) => {
            console.log(error);
          });
          return;
        }
        this.toggleLiveDemoWareHouse(data.item.id);
        break;
      }
      case 'RECHAZAR': {
        this.toggleLiveDemoDenied(data.item.id);
        break;
      }
      case 'ASIGNAR': {
        this.alert.sweetAlert('Esta seguro de asignar la solicitud?', '', 
          'warning', true, true)
        .then((result) => {
          if(result.value) {
            //eliminar
            let request = {
              id: data.item.id,
              useridassigned: this.user.id
            }
            this.assetRequestService.AssignRequest(request).subscribe(
              (respuesta) => {
                if(!respuesta.error) {
                  this.alert.sweetAlert('Confirmación', respuesta.message, 
                      'success', true, false, 'OK'
                    ).then((result) => {
                      this.consultar();
                    }).catch((error) => {
                      console.log(error);
                    });
                }
                else {
                  this.alert.sweetAlert('Información', 
                      respuesta.message, 
                      'info',
                      true,
                      false,
                      'OK'
                    ).then((result) => {
                      this.consultar();
                    }).catch((error) => {
                      console.log(error);
                    });
                }
              }, (error) => {
                this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK'
                  ).then((result) => {
                    this.consultar();
                    console.log(result);
                  }).catch((error) => {
                    console.log(error);
                  });
              }
            )
          }
        })
        break;
      }
      default:{
        break;
      }
    }
  }
}
