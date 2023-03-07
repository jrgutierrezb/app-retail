import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { User } from 'src/app/core/class/User';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { StorageService } from 'src/app/shared/services/storage.service';
import { IAgency } from '../../interfaces/IAgency';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { ICatalog } from '../../interfaces/ICatalog';
import { ICompanyToBeBilling } from '../../interfaces/ICompanyToBeBilling';
import { IInventory } from '../../interfaces/IInventory';
import { IProcessState } from '../../interfaces/IProcessState';
import { IProduct } from '../../interfaces/IProduct';
import { IWorkDepartment } from '../../interfaces/IWorkDepartment';
import { AgencyService } from '../../services/agency.service';
import { AssetRequestService } from '../../services/asset-request.service';
import { CatalogService } from '../../services/catalog-service';
import { CompanyToBeBillingService } from '../../services/company-to-be-billing.service';
import { ProcessStateService } from '../../services/process-state.service';
import { WorkDepartmentService } from '../../services/work-department.service';

@Component({
  selector: 'app-inventory-register',
  templateUrl: './inventory-register.component.html',
  styleUrls: ['./inventory-register.component.css']
})
export class InventoryRegisterComponent implements OnInit {

  @Output() refreshData = new EventEmitter<boolean>();
  assetRequest: IAssetRequest = null;
  productsData: any[] = [];
  headers: IHeaders[] = [
    {
      field: 'catalogproductid',
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
      field: 'invoicenumber',
      columnName: 'Nro. Factura',
      type: 'number',
      validate: 'required',
      isModify: true
    },
    {
      field: 'brand',
      columnName: 'Marca',
      type: 'string',
      validate: 'required',
      isModify: true
    },
    {
      field: 'model',
      columnName: 'Modelo',
      type: 'string',
      validate: 'required',
      isModify: true
    },
    {
      field: 'yearwarranty',
      columnName: 'Años Garantia',
      type: 'number',
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
  public inventories: IInventory[];
  public catalogStates: ICatalog[];

  constructor(private assetRequestService: AssetRequestService,
    private workDepartmentService: WorkDepartmentService,
    private agencyService: AgencyService,
    private processStateService: ProcessStateService,
    private companyToBeBillingService: CompanyToBeBillingService,
    private catalogService: CatalogService,
    private storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef) {
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
      this.inventories = [];
      this.catalogStates = [];
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
    this.getInventories('IPR');
    this.getCatalogStates('EP');
  }

  buildForm() {
    return new FormGroup({
      id: new FormControl(this.assetRequest ? this.assetRequest.id : null),
      description: new FormControl(this.assetRequest ? this.assetRequest.description : ''),
      casenumber: new FormControl(this.assetRequest ? this.assetRequest.casenumber : ''),
      useridrequested: new FormControl(this.assetRequest ? this.assetRequest.useridrequested : this.currentUserId, [Validators.required]),
      useridapproved:  new FormControl(this.currentUserId, [Validators.required]),
      useridregister:  new FormControl(this.currentUserId, [Validators.required]),
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
          //this.onchange();
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
    this.agencyService.Agencies().subscribe((respuesta) => {
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
        this.catalogproducts = [];
      }
    }, (error) => {
      this.catalogproducts = [];
    });
  }

  getInventories(code: string) {
    return this.catalogService.Inventories(code).subscribe((respuesta) => {
      if(!respuesta.error) {
        this.inventories = respuesta.data;
      }
      else {
        this.inventories = [];
      }
    }, (error) => {
      this.inventories = [];
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

    for( let item of this.productsData) {
      if(!item.inventoryproducts) {
        item.inventoryproducts = [];
      }
      for(let i = 0; i < item.quantity; i++) {
        item.inventoryproducts.push({
          id: null,
          yearwarranty: item.yearwarranty,
          inventoryid: this.inventories.find((inv) => inv.catalogid === item.catalogproductid).id,
          productid: item.id,
          agencyid: this.assetRequest.agencyid,
          billingid: this.assetRequest.billingid,
          workdepartmentid: this.assetRequest.workdepartmentid,
          productstateid: this.catalogStates.find((st) => st.name === 'RECIBIDO').id,
          invoicenumber: item.invoicenumber,
          brand: item.brand,
          model: item.model
        });
      }
    }

    let request: IAssetRequest = {
      id: this.form.get('id').value,
      casenumber: this.form.get('casenumber').value,
      description: null,
      filerequest: null,
      sapcode: null,
      useridrequested: this.form.get('useridrequested').value,
      useridregister: this.form.get('useridregister').value,
      catalogid: this.form.get('catalogid').value,
      prioritytypeid: this.form.get('prioritytypeid').value,
      agencyid: this.form.get('agencyid').value,
      billingid: this.form.get('billingid').value,
      processstateid: this.form.get('processstateid').value,
      workdepartmentid: this.form.get('workdepartmentid').value,
      products: this.productsData,
      proforms: []
    };

    this.RegisterAssetRequest(request).subscribe(
      (respuesta) => {
        if(!respuesta.error) {
          this.alert.sweetAlert('Confirmación', respuesta.message, 'success', true, false, 'OK').then((result) => {
              console.log(result);
              this.handleLiveDemoChange(false);
            }).catch((error) => {
              console.log(error);
            });
          return;
        }
        else {
          this.alert.sweetAlert('Información', respuesta.message, 'info', true, false, 'OK').then((result) => {
              console.log(result);
              this.handleLiveDemoChange(true);
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

  RegisterAssetRequest(assetRequest:  IAssetRequest): Observable<BaseResponse> {
    return this.assetRequestService.RegisterAssetRequest(assetRequest);
  }

}
