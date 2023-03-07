import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Input, ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { User } from 'src/app/core/class/User';
import { StorageService } from 'src/app/shared/services/storage.service';
import { IWorkDepartment } from '../../interfaces/IWorkDepartment';
import { AssetRequestService } from '../../services/asset-request.service';
import { WorkDepartmentService } from '../../services/work-department.service';
import { AgencyService } from '../../services/agency.service';
import { ProcessStateService } from '../../services/process-state.service';
import { CompanyToBeBillingService } from '../../services/company-to-be-billing.service';
import { CatalogService } from '../../services/catalog-service';
import { IAgency } from '../../interfaces/IAgency';
import { IProcessState } from '../../interfaces/IProcessState';
import { ICompanyToBeBilling } from '../../interfaces/ICompanyToBeBilling';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { ICatalog } from '../../interfaces/ICatalog';
import { ThisReceiver } from '@angular/compiler';
import { IProduct } from '../../interfaces/IProduct';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { DataGridComponent } from 'src/app/shared/components/data-grid/data-grid.component';

@Component({
  selector: 'app-create-asset-request',
  templateUrl: './create-asset-request.component.html',
  styleUrls: ['./create-asset-request.component.css']
})
export class CreateAssetRequestComponent implements OnInit, AfterViewInit {

  @ViewChild(DataGridComponent) datagrid: DataGridComponent;

  @Output() refreshData = new EventEmitter<void>();
    
  assetRequest: IAssetRequest = null;
  productsData: IProduct[] = [];
  headers: IHeaders[] = [
    {
      field: 'catalogid',
      columnName: 'Producto',
      type: 'lookup',
      validate: 'required',
      isModify: true
    },
    {
      field: 'quantity',
      columnName: 'Cantidad',
      type: 'number',
      validate: 'required',
      isModify: true
    }
  ]

  public lookups = [
    {
      field: 'catalogid',
      lookup:[]
    }
  ]

  public liveDemoVisible = false;

  private user!: User | null;
  private file: any;
  private filerequest: any;

  public requestedName = '';
  private currentUserId: number;
  private currentAgencyId: number;
  private currentCompanyId: number;
  private currentWorkdepartmentId: number;

  alert = new Alert();
  isEdit = false;
  isRequired = false;
  namePage: string;

  form!: FormGroup;

  errorFormulario = new ErrorFormulario();

  public workDepartments: IWorkDepartment[];
  public agencies: IAgency[];
  public processStates: IProcessState[];
  public companyToBeBilling: ICompanyToBeBilling[];
  public products: ICatalog[];
  public invetoryProducts = [];
  public types: ICatalog[];
  public priorities: ICatalog[];

  constructor(
    private assetRequestService: AssetRequestService,
    private workDepartmentService: WorkDepartmentService,
    private AgencyService: AgencyService,
    private processStateService: ProcessStateService,
    private companyToBeBillingService: CompanyToBeBillingService,
    private catalogService: CatalogService,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.form = this.buildForm();
    this.user = this.storageService.getCurrentUser();
    this.workDepartments = [];
    this.agencies = [];
    this.processStates = [];
    this.companyToBeBilling = [];
    this.products = [];
    this.types = [];
    this.priorities = [];
    this.invetoryProducts = [];
  }

  ngOnInit() {
    if(this.user) {
      this.requestedName = this.user.firstname + ' ' + this.user.lastname;
      this.currentUserId = this.user.id;
      this.currentAgencyId = this.user.agencyid;
      this.currentWorkdepartmentId = this.user.workdepartmentid;
      this.currentCompanyId = this.user.companyid;
    }
    this.getWorkDeparments();
    this.getAgencies();
    this.getProcessStates('INGRESADO');
    this.getCompanyToBeBilling();
    this.getTypes('TPS');
    this.getProducts('PRO');
    this.getPriorities('TP');
    this.InventoriesReg();
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  buildForm() {
    return new FormGroup({
      id: new FormControl(this.assetRequest ? this.assetRequest.id : null),
      description: new FormControl(this.assetRequest ? this.assetRequest.description : ''),
      casenumber: new FormControl(this.assetRequest ? this.assetRequest.casenumber : ''),
      useridrequested: new FormControl(this.assetRequest ? this.assetRequest.useridrequested : this.currentUserId, [Validators.required]),
      agencyid: new FormControl(this.assetRequest ? this.assetRequest.agencyid : this.currentAgencyId, [Validators.required]),
      billingid: new FormControl(this.assetRequest ? this.assetRequest.billingid : this.currentCompanyId, [Validators.required]),
      processstateid: new FormControl(this.assetRequest ? this.assetRequest.processstateid : null),
      workdepartmentid: new FormControl(this.assetRequest ? this.assetRequest.workdepartmentid : this.currentWorkdepartmentId, [Validators.required]),
      filerequest: new FormControl(this.assetRequest ? this.assetRequest.filerequest : ''),
      catalogid: new FormControl(this.assetRequest ? this.assetRequest.catalogid : null, [Validators.required]),
      prioritytypeid: new FormControl(this.assetRequest ? this.assetRequest.prioritytypeid : null, [Validators.required]),
      inventoryproductid: new FormControl(this.assetRequest ? this.assetRequest.inventoryproductid : null, [Validators.required]),
    });
  }

  onChange() {
    let catalogid = this.form.get('catalogid').value;
    let catalog = this.types.find(item => item.id == catalogid);
    this.isRequired = catalog.name == 'Requerimiento';
    this.form.get('inventoryproductid').setValue(null);
    this.productsData = [];
    if(this.isRequired){ 
      this.form.get('inventoryproductid').setValidators(null);
    }
    else {
      this.form.get('inventoryproductid').setValidators(Validators.required);
    }
    this.form.get('inventoryproductid').updateValueAndValidity();
  }

  selectProduct() {
    this.productsData = [];
  }

  toggleLiveDemo(id?: number) {
    this.LimpiarModal();
    this.namePage = 'Crear Solicitud';
    this.liveDemoVisible = !this.liveDemoVisible;
    if(id) {
      this.isEdit = true;
      this.namePage = 'Editar Solicitud';
      //this.enableState();
      this.assetRequestService.AssetRequestById(id)
      .subscribe((respuesta) => {
        if(!respuesta.error) {
          this.assetRequest = respuesta.data;
          if(this.assetRequest) {
            this.productsData = this.assetRequest.products;
            this.isRequired = true
          }
          this.form = this.buildForm();
          this.onChange();
          this.changeDetectorRef.detectChanges();
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

  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
    this.changeDetectorRef.detectChanges();
  }

  getWorkDeparments() {
    this.workDepartmentService.WorkDeparments().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.workDepartments = respuesta.data;
      }
      else {
        this.workDepartments = [];
      }
    }, (error) => {
      this.workDepartments = [];
    });
  }

  getAgencies() {
    this.AgencyService.Agencies().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.agencies = respuesta.data;
      }
      else {
        this.agencies = [];
      }
    }, (error) => {
      this.agencies = [];
    });
  }

  getProcessStates(code: string) {
    this.processStateService.ProcessStates(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.processStates = respuesta.data;
      }
      else {
        this.processStates = [];
      }
    }, (error) => {
      this.processStates = [];
    });
  }

  getCompanyToBeBilling() {
    this.companyToBeBillingService.CompanyToBeBilling().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.companyToBeBilling = respuesta.data;
      }
      else {
        this.companyToBeBilling = [];
      }
    }, (error) => {
      this.companyToBeBilling = [];
    });
  }

  getProducts(code: string) {
    return this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.products = respuesta.data;
        this.lookups[0].lookup = this.products;
      }
      else {
        this.products = [];
      }
    }, (error) => {
      this.products = [];
    });
  }

  getTypes(code: string) {
    this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.types = respuesta.data;
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
      }
      else {
        this.priorities =  [];
      }
    }, (error) => {
      this.priorities =  [];
    });
  }

  InventoriesReg() {
    this.catalogService.InventoriesReg(this.currentCompanyId, this.currentAgencyId, this.currentWorkdepartmentId).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.invetoryProducts = respuesta.data;
      }
      else {
        this.invetoryProducts =  [];
      }
    }, (error) => {
      this.invetoryProducts =  [];
    });
  }

  async upLoadFile(event: any) {
    this.file = null;
    if(event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
    if(this.file) {
      this.filerequest = await this.convertBase64(this.file);
      
    }
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

  isDisabled(): boolean {
    return (this.form.invalid || (!this.isRequired && this.filerequest == null) || (this.isRequired && this.productsData.length == 0));
  }

  onInitNewRow(event: any) {
    //this.datagrid.cancelNewRow();
  }

  save() {
    this.form.get('processstateid').patchValue(this.processStates[0].id);
    if(this.form.invalid) {
      this.alert.sweetAlert('Formulario inválido', 'Existen campos vacíos o con datos inválidos',  'warning', true, false, 'OK').then((result) => {
        console.log(result);
      }).catch((error) => {
        console.log(error);
      });
      return;
    }

    

    this.form.get('filerequest').setValue(this.filerequest);

    let request: IAssetRequest = {
      id: this.form.get('id').value,
      casenumber: this.form.get('casenumber').value,
      description: this.form.get('description').value,
      filerequest: this.form.get('filerequest').value,
      sapcode: null,
      useridrequested: this.form.get('useridrequested').value,
      catalogid: this.form.get('catalogid').value,
      prioritytypeid: this.form.get('prioritytypeid').value,
      agencyid: this.form.get('agencyid').value,
      billingid: this.form.get('billingid').value,
      processstateid: this.form.get('processstateid').value,
      workdepartmentid: this.form.get('workdepartmentid').value,
      products: this.productsData,
      proforms:[]
    };

    if(!this.isRequired) {
      request.inventoryproductid = this.form.get('inventoryproductid').value;
    }

    this.CreateOrEdit(request).subscribe(
      (respuesta) => {
        if(!respuesta.error) {
          this.alert.sweetAlert('Confirmación', 
              respuesta.message, 
              'success',
              true,
              false,
              'OK'
            ).then((result) => {
              console.log(result);
              this.LimpiarModal();
              this.refreshData.emit();
              this.handleLiveDemoChange(false);
            }).catch((error) => {
              console.log(error);
            });
          return;
        }
        else {
          this.alert.sweetAlert('Información', 
              respuesta.message, 
              'info',
              true,
              false,
              'OK'
            ).then((result) => {
              console.log(result);
              this.LimpiarModal();
              this.handleLiveDemoChange(true);
            }).catch((error) => {
              console.log(error);
            });
        }
      }, (error) => {
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
          return;
      }
    );
  }

  CreateOrEdit(assetRequest:  IAssetRequest): Observable<BaseResponse> {
    if(assetRequest.id) {
      return this.assetRequestService.UpdateAssetRequest(assetRequest);
    }
    else{
      return this.assetRequestService.saveAssetRequest(assetRequest);
    }
    
  }

  LimpiarModal() {
    this.assetRequest = null;
    this.form = this.buildForm();
    this.productsData = [];
    this.isEdit = false;
    this.isRequired = false;
  }

}
