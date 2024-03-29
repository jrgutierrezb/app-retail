import { AfterViewInit, ChangeDetectorRef, Component, OnInit, Output, EventEmitter  } from '@angular/core';
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
import { IAgency } from '../../interfaces/IAgency';
import { IProcessState } from '../../interfaces/IProcessState';
import { ICompanyToBeBilling } from '../../interfaces/ICompanyToBeBilling';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { CatalogService } from '../../services/catalog-service';
import { ICatalog } from '../../interfaces/ICatalog';
import { IProduct } from '../../interfaces/IProduct';
import { IHeaders } from 'src/app/shared/interfaces/headers';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit, AfterViewInit {

  @Output() refreshData = new EventEmitter<void>();
  assetRequest: IAssetRequest = null;
  productsData: IProduct[] = [];
  headers: IHeaders[] = [
    {
      field: 'catalogid',
      columnName: 'Producto',
      type: 'lookup',
      validate: 'required',
      isModify: false
    },
    {
      field: 'quantity',
      columnName: 'Cantidad',
      type: 'number',
      validate: 'required',
      isModify: false
    },
    {
      field: 'catalogproductid',
      columnName: 'Producto',
      type: 'lookup',
      validate: 'required',
      isModify: true
    },
    {
      field: 'technicaldescription',
      columnName: 'Descripcion Tecnica',
      type: 'string',
      validate: 'required',
      isModify: true
    }
  ];

  public lookups = [
    {
      field: 'catalogid',
      lookup:[]
    },
    {
      field: 'catalogproductid',
      lookup:[]
    }
  ]

  public liveDemoVisible = false;

  private user!: User | null;

  public requestedName = '';
  private currentUserId: number;
  private currentAgencyId: number;

  alert = new Alert();
  isEdit = false;
  isRequired = true;

  form!: FormGroup;

  errorFormulario = new ErrorFormulario();

  public workDepartments: IWorkDepartment[];
  public agencies: IAgency[];
  public processStates: IProcessState[];
  public companyToBeBilling: ICompanyToBeBilling[];
  public products: ICatalog[];
  public catalogproducts: ICatalog[];
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
    this.catalogproducts = [];
    this.types = [];
    this.priorities = [];
  }

  ngOnInit() {
    if(this.user) {
      //this.requestedName = this.user.firstname + ' ' + this.user.lastname;
      this.currentUserId = this.user.id;
      this.currentAgencyId = this.user.agencyid;
    }
    this.getWorkDeparments();
    this.getAgencies();
    this.getProcessStates('INGRESADO');
    this.getCompanyToBeBilling();
    this.getTypes('TPS');
    this.getProducts('PRO');
    this.getCatalogProducts('IPR');
    this.getPriorities('TP');
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  buildForm() {
    return new FormGroup({
      id: new FormControl(this.assetRequest ? this.assetRequest.id : null),
      //productname: new FormControl(this.assetRequest ? this.assetRequest.productname : '', [Validators.required]),
      description: new FormControl(this.assetRequest ? this.assetRequest.description : ''),
      //daterequirement: new FormControl(this.assetRequest ? this.assetRequest.daterequirement : null, [Validators.required]),
      //requiredquantity: new FormControl(this.assetRequest ? this.assetRequest.requiredquantity : '', [Validators.required]),
      casenumber: new FormControl(this.assetRequest ? this.assetRequest.casenumber : ''),
      useridrequested: new FormControl(this.assetRequest ? this.assetRequest.useridrequested : this.currentUserId, [Validators.required]),
      useridapproved:  new FormControl(this.currentUserId, [Validators.required]),
      useriddenied:  new FormControl(this.currentUserId, [Validators.required]),
      agencyid: new FormControl(this.assetRequest ? this.assetRequest.agencyid : this.currentAgencyId, [Validators.required]),
      billingid: new FormControl(this.assetRequest ? this.assetRequest.billingid : null, [Validators.required]),
      processstateid: new FormControl(this.assetRequest ? this.assetRequest.processstateid : null),
      workdepartmentid: new FormControl(this.assetRequest ? this.assetRequest.workdepartmentid : null, [Validators.required]),
      productid: new FormControl(this.assetRequest ? this.assetRequest.catalogid : null),
      catalogid: new FormControl(this.assetRequest ? this.assetRequest.catalogid : null, [Validators.required]),
      prioritytypeid: new FormControl(this.assetRequest ? this.assetRequest.prioritytypeid : null, [Validators.required]),
    });
  }

  toggleLiveDemo(id?: number) {
    this.liveDemoVisible = !this.liveDemoVisible;
    this.form = this.buildForm();
    this.isEdit = false;
    this.assetRequest = null;
    if(id) {
      this.isEdit = true;
      this.assetRequestService.AssetRequestById(id)
      .subscribe((respuesta) => {
        if(!respuesta.error) {
          this.assetRequest = respuesta.data;
          this.form = this.buildForm();
          this.onchange();
          if(this.assetRequest) {
            this.requestedName = this.assetRequest.usernamerequested;
            this.productsData = this.assetRequest.products;
          }
          
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

  onchange() {
    let catalogid = this.form.get('catalogid').value;
    let catalog = this.types.find(item => item.id == catalogid);
    this.isRequired = catalog.name == 'Requerimiento';
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

  getCatalogProducts(code: string) {
    return this.catalogService.Catalogs(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.catalogproducts = respuesta.data;
        this.lookups[1].lookup = this.catalogproducts;
      }
      else {
        this.products = [];
      }
    }, (error) => {
      this.products = [];
    });
  }

  isDisabled(): boolean {
    return this.form.invalid || this.productsData.some(item => item.technicaldescription == null || item.technicaldescription == '');
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

    let request: IAssetRequest = {
      id: this.form.get('id').value,
      casenumber: this.form.get('casenumber').value,
      description: this.form.get('description').value,
      filerequest: null,
      sapcode: null,
      useridrequested: this.form.get('useridrequested').value,
      useridapproved: this.form.get('useridapproved').value,
      catalogid: this.form.get('catalogid').value,
      prioritytypeid: this.form.get('prioritytypeid').value,
      agencyid: this.form.get('agencyid').value,
      billingid: this.form.get('billingid').value,
      processstateid: this.form.get('processstateid').value,
      workdepartmentid: this.form.get('workdepartmentid').value,
      products: this.productsData,
      proforms:[]
    };

    this.ApproveRequest(request).subscribe(
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

  ApproveRequest(assetRequest:  IAssetRequest): Observable<BaseResponse> {
    return this.assetRequestService.ApproveRequest(assetRequest);
  }

}
