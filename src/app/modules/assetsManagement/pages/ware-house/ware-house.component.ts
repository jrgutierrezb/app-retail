import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { User } from 'src/app/core/class/User';
import { Alert } from 'src/app/core/class/Alert';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { AssetRequestService } from '../../services/asset-request.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICatalog } from '../../interfaces/ICatalog';
import { IProcessState } from '../../interfaces/IProcessState';
import { CatalogService } from '../../services/catalog-service';
import { ProcessStateService } from '../../services/process-state.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';

@Component({
  selector: 'app-ware-house',
  templateUrl: './ware-house.component.html',
  styleUrls: ['./ware-house.component.css']
})
export class WareHouseComponent implements OnInit {

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
      columnName: 'Producto',
      field: 'codenameproduct',
      type: 'string',
      isModify: false
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
      permiso: 'MANTENIMIENTO',
      icon: 'cil-cog',
      color: 'success',
      description: 'Mantenimiento'
    },
    {
      permiso: 'DEVOLUCION',
      icon: 'cil-action-redo',
      color: 'warning',
      description: 'Devolucion'
    },
    {
      permiso: 'BAJA',
      icon: 'cil-level-down',
      color: 'danger',
      description: 'Dar baja'
    },
    
    
  ];
  currentUserId: number;

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
      this.currentUserId = this.user.id;
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
        this.processStates = respuesta.data.filter((item) => item.code == 'BODEGA');
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
    this.assetRequestService.RequestWareHouseFilters(params).subscribe((respuesta) => {
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

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'MANTENIMIENTO': {
        this.alert.sweetAlertWithInput('Mantenimiento',  'Observación',  'question', true, true, 'OK').then((result) => {
          console.log(result);
          if(result.isConfirmed) {
            let request = {
              id:data.item.id,
              inventoryproductid:data.item.inventoryproductid,
              userid:this.currentUserId,
              observation: result.value
            }

            this.MaintenanceRequest(request).subscribe(
              (respuesta) => {
                if(!respuesta.error) {
                  this.alert.sweetAlert('Confirmación', respuesta.message, 'success', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                  return;
                }
                else {
                  this.alert.sweetAlert('Información', respuesta.message, 'info', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                }
              }, (error) => {
                this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                  return;
              }
            );
          }
        }).catch((error) => {
          console.log(error);
        });
        break;
      }
      case 'BAJA': {
        this.alert.sweetAlertWithInput('Baja',  'Observación',  'question', true, true, 'OK').then((result) => {
          console.log(result);
          if(result.isConfirmed) {
            let request = {
              id:data.item.id,
              inventoryproductid:data.item.inventoryproductid,
              userid:this.currentUserId,
              observation: result.value
            }

            this.DownRequest(request).subscribe(
              (respuesta) => {
                if(!respuesta.error) {
                  this.alert.sweetAlert('Confirmación', respuesta.message, 'success', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                  return;
                }
                else {
                  this.alert.sweetAlert('Información', respuesta.message, 'info', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                }
              }, (error) => {
                this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                  return;
              }
            );
          }
        }).catch((error) => {
          console.log(error);
        });
        break;
      }
      case 'DEVOLUCION': {
        this.alert.sweetAlert('Devolución', '¿Desea devolver el producto?', 'question', true, true, 'OK').then((result) => {
          console.log(result);
          if(result.isConfirmed) {
            let request = {
              id:data.item.id,
              inventoryproductid:data.item.inventoryproductid,
              userid:this.currentUserId
            }
            this.DevolutionRequest(request).subscribe(
              (respuesta) => {
                if(!respuesta.error) {
                  this.alert.sweetAlert('Confirmación', respuesta.message, 'success', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                  return;
                }
                else {
                  this.alert.sweetAlert('Información', respuesta.message, 'info', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                }
              }, (error) => {
                this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK').then((result) => {
                      console.log(result);
                    }).catch((error) => {
                      console.log(error);
                    });
                  return;
              }
            );
          }
      }).catch((error) => {
              console.log(error);
      });
        break;
      }
      default:{
        break;
      }
    }
  }

  DownRequest(request: any): Observable<BaseResponse> {
    return this.assetRequestService.DownRequest(request);
  }

  MaintenanceRequest(request: any): Observable<BaseResponse> {
    return this.assetRequestService.MaintenanceRequest(request);
  }

  DevolutionRequest(request: any): Observable<BaseResponse> {
    return this.assetRequestService.DevolutionRequest(request);
  }

}
