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
import { InventoryRegisterComponent } from '../../components/inventory-register/inventory-register.component';
import { ShowFileComponent } from 'src/app/shared/components/show-file/show-file.component';
import { DispathRequestComponent } from '../../components/dispath-request/dispath-request.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  @ViewChild('showFileModal') showFileModal!: ShowFileComponent;
  @ViewChild('inventoryRegisterRequest') inventoryRegisterRequest!: InventoryRegisterComponent;
  @ViewChild('dispathRequest') dispathRequest!: DispathRequestComponent;
  @ViewChild('table') table!: TableComponent;
  assetRequest: IAssetRequest = null;

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
      columnName: 'Prioridad',
      field: 'priority',
      type: 'string'
    },
    {
      columnName: 'Estado',
      field: 'state',
      type: 'string',
      isModify: false
    },
    {
      columnName: 'Nro. Guia',
      field: 'numberguide',
      type: 'string',
      isModify: false
    }
  ]

  eventsTable: IEventTable[] = [
    {
      permiso: 'VER',
      icon: 'cil-find-in-page',
      color: 'warning',
      description: 'Ver guia'
    },
    {
      permiso: 'REGISTRAR',
      icon: 'cil-clipboard',
      color: 'success',
      description: 'Registrar'
    },
    {
      permiso: 'DESPACHO',
      icon: 'cil-truck',
      color: 'info',
      description: 'Despachar'
    }
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
      numberguide: new FormControl(null),
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

  consultar() {
    this.consultando = true;
    let endDate = new Date(this.form.get('dateend').value)
    endDate.setDate(endDate.getDate() + 1);
    let params = {
      "p_datefrom": new Date(this.form.get('datefrom').value).toISOString(),
      "p_dateend": endDate,
      "p_catalogid": this.form.get('catalogid').value ? Number.parseInt(this.form.get('catalogid').value)  : this.form.get('catalogid').value,
      "p_prioritytypeid": this.form.get('prioritytypeid').value ? Number.parseInt(this.form.get('prioritytypeid').value)  : this.form.get('prioritytypeid').value,
      "p_numberguide": this.form.get('numberguide').value ? this.form.get('numberguide').value : null
    };
    this.assetRequestService.RequestInventoryFilters(params).subscribe((respuesta) => {
      this.consultando = false;
      if(!respuesta.error) {
        this.data = respuesta.data;
        setTimeout(() => {
          this.table.viewData();
        }, 500);
      }
    }, (error) => {
      this.consultando = false;
      this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK').then((result) => {
              console.log(result);
      }).catch((error) => {
              console.log(error);
      });
    });
  }


  /** fucntion call modal */
  toggleLiveDemo(id?: number) {
    this.inventoryRegisterRequest.toggleLiveDemo(id);
  }

  toggleLiveDemoGuide(id?: number) {
    this.dispathRequest.toggleLiveDemo(id);
  }

  showFile(id:number) {
    this.assetRequestService.AssetRequestById(id)
      .subscribe((respuesta) => {
        if(!respuesta.error) {
          this.assetRequest = respuesta.data;
          if(this.assetRequest && this.assetRequest.filereferralguide) {
            this.showFileModal.toggleLiveDemo(this.assetRequest.filereferralguide);
          }
        }
      }, (error) => {
        this.alert.sweetAlert('Error', 'Error', 'error', true, false, 'OK'
        ).then((result) => {
          console.log(result);
        }).catch((error) => {
          console.log(error);
        });
      });
  }

  EditOrDelete(data: any) {
    switch(data.permiso) {
      case 'VER': {
        this.showFile(data.item.id);
        break;
      }
      case 'REGISTRAR': {
        this.toggleLiveDemo(data.item.id);
        break;
      }
      case 'DESPACHO': {
        this.toggleLiveDemoGuide(data.item.id);
        //this.printer();
        break;
      }
      default:{
        break;
      }
    }
  }

  printer() {
    let zpl = [];
    zpl.push("^XA");
    zpl.push("^FO10, 110^ADN, 12, 7^FD Nombre Corporacion ^FS");
    zpl.push("^FO10, 150^ADN, 12, 7^FD Fecha^FS");
    zpl.push("^FO10, 190^ADN, 12, 7^FD "  + new Date().toLocaleString() + "^FS");
    zpl.push("^FO10, 230^ADN, 12, 7^FD Producto: ^FS");
    zpl.push("^FO10, 270^ADN, 12, 7^FD Descripcion: ^FS");
    zpl.push("^FO400,40^BQN,2,10^FDQA,{id:1}^FS");
    zpl.push("^XZ");
    let zpllist = "";
    for(let i = 0; i<2; i++) {
      zpllist+=zpl.join();
    }
    const request = new Request(`http://192.168.100.26:6101`, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            body:zpllist,
        });
    const print = Promise.race([
          fetch(request),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000)),
      ]);
      print.then((res) => {
        console.log(res);
      }, (error) => {
        console.log(error);
      })
  }

}
