import { Component, OnInit, ViewChild } from '@angular/core';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { User } from 'src/app/core/class/User';
import { Alert } from 'src/app/core/class/Alert';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { CreateAssetRequestComponent } from '../../components/create-asset-request/create-asset-request.component';
import { IEventTable } from 'src/app/shared/interfaces/event-table';
import { AssetRequestService } from '../../services/asset-request.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import Swal from 'sweetalert2';
import { ICatalog } from '../../interfaces/ICatalog';
import { IProcessState } from '../../interfaces/IProcessState';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogService } from '../../services/catalog-service';
import { ProcessStateService } from '../../services/process-state.service';
import { TableComponent } from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-asset-request',
  templateUrl: './asset-request.component.html',
  styleUrls: ['./asset-request.component.css']
})
export class AssetRequestComponent implements OnInit {

  @ViewChild('createAssetRequest') createAssetRequest!: CreateAssetRequestComponent;
  @ViewChild('table') table!: TableComponent;

  consultando: boolean = false;

  form!: FormGroup;

  public types: ICatalog[];
  public priorities: ICatalog[];
  public processStates: IProcessState[];

  private user!: User | null;
  private currentUserId: number;
  data:IAssetRequest[];

  alert = new Alert();

  title: string = 'Listado de Solicitudes';

  headers: IHeaders[] = [
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
    },
    {
      columnName: 'Prioridad',
      field: 'priority',
      type: 'string'
    }
  ]

  eventsTable: IEventTable[] = [
    {
      permiso: 'WRITE',
      icon: 'cil-pencil',
      color: 'info',
      description: 'Editar'
    },
    {
      permiso: 'DELETE',
      icon: 'cil-trash',
      color: 'danger',
      description: 'Eliminar'
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
        this.processStates = respuesta.data;
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
      "p_useridrequested": this.currentUserId,
      "p_catalogid": this.form.get('catalogid').value ? Number.parseInt(this.form.get('catalogid').value)  : this.form.get('catalogid').value,
      "p_prioritytypeid": this.form.get('prioritytypeid').value ? Number.parseInt(this.form.get('prioritytypeid').value)  : this.form.get('prioritytypeid').value,
      "p_state": this.form.get('processstateid').value ? Number.parseInt(this.form.get('processstateid').value)  : this.form.get('processstateid').value
    }
    this.assetRequestService.AssetRequestFilters(params).subscribe((respuesta) => {
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
    this.createAssetRequest.toggleLiveDemo(id);
  }

  EditOrDelete(data: any) {
    let state = data.item.state;
    switch(data.permiso) {
      case 'WRITE': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'DELETE': {
        this.alert.sweetAlert('Esta seguro de eliminar la Solicitud?', 'No podrá recuperar la información!', 
          'warning', true, true)
        .then((result) => {
          if(result.value) {
              this.assetRequestService.DeleteAssetRequest(data.item.id).subscribe(
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
                  //eliminar
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
