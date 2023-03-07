import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { User } from 'src/app/core/class/User';
import { ShowFileComponent } from 'src/app/shared/components/show-file/show-file.component';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IHeaders } from 'src/app/shared/interfaces/headers';
import { StorageService } from 'src/app/shared/services/storage.service';
import { IAgency } from '../../interfaces/IAgency';
import { IAssetRequest } from '../../interfaces/IAssetRequest';
import { ICatalog } from '../../interfaces/ICatalog';
import { ICompanyToBeBilling } from '../../interfaces/ICompanyToBeBilling';
import { IProcessState } from '../../interfaces/IProcessState';
import { IProduct } from '../../interfaces/IProduct';
import { IProform } from '../../interfaces/IProform';
import { IWorkDepartment } from '../../interfaces/IWorkDepartment';
import { AgencyService } from '../../services/agency.service';
import { AssetRequestService } from '../../services/asset-request.service';
import { CatalogService } from '../../services/catalog-service';
import { CompanyToBeBillingService } from '../../services/company-to-be-billing.service';
import { ProcessStateService } from '../../services/process-state.service';
import { WorkDepartmentService } from '../../services/work-department.service';

@Component({
  selector: 'app-guide-request',
  templateUrl: './guide-request.component.html',
  styleUrls: ['./guide-request.component.css']
})
export class GuideRequestComponent implements OnInit {

  @ViewChild('showFileModal') showFileModal!: ShowFileComponent;
  
  @Output() refreshData = new EventEmitter<boolean>();
  assetRequest: IAssetRequest = null;
  productsData: IProduct[] = [];
  proforms: IProform[] = [];
  proformApproved: IProform = null;

  headers: IHeaders[] = [
    {
      field: 'catalogid',
      columnName: 'Producto',
      type: 'lookup',
      validate: 'required',
      isModify: false
    },
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
      field: 'technicaldescription',
      columnName: 'Descripcion Tecnica',
      type: 'string',
      validate: 'required',
      isModify: true
    }
  ]

  headerProform: IHeaders[] = [
    {
      field: 'fileproforma',
      columnName: 'File',
      type: 'file',
      validate: 'required',
      isModify: false
    },
    {
      field: 'supplier',
      columnName: 'Provedor',
      type: 'string',
      validate: 'required',
      isModify: false
    },
    {
      field: 'totalvalue',
      columnName: 'Valor total',
      type: 'number',
      validate: 'required',
      isModify: false,
      format: 'money'
    }
  ]

  headerProformDetail: IHeaders[] = [
    {
      field: 'productid',
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
      field: 'value',
      columnName: 'Valor unitario',
      type: 'number',
      validate: 'required',
      isModify: true,
      format: 'money'
    },
    {
      field: 'totalvalue',
      columnName: 'Valor total',
      type: 'number',
      validate: 'required',
      isModify: false,
      format: 'money'
    }

    
  ]

  public lookups = [
    {
      field: 'catalogid',
      lookup:[]
    },
    {
      field: 'catalogproductid',
      lookup:[]
    },
    {
      field: 'productid', 
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

  alert = new Alert();
  isEdit = false;
  isRequired = false;

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
    private agencyService: AgencyService,
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
    this.getPriorities('TP');
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
      useridguide:  new FormControl(this.currentUserId, [Validators.required]),
      filereferralguide: new FormControl(this.assetRequest ? this.assetRequest.filereferralguide : ''),
      numberguide: new FormControl(this.assetRequest ? this.assetRequest.numberguide : '', [Validators.required]),
      agencyid: new FormControl(this.assetRequest ? this.assetRequest.agencyid : this.currentAgencyId, [Validators.required]),
      billingid: new FormControl(this.assetRequest ? this.assetRequest.billingid : null, [Validators.required]),
      processstateid: new FormControl(this.assetRequest ? this.assetRequest.processstateid : null, [Validators.required]),
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
            this.proforms = this.assetRequest.proforms.filter(fil => fil.approved).map(item => {
              return {
                ...item,
                totalvalue: item.productproforms.reduce((a,b) => a + b.totalvalue, 0),
                productproforms: item.productproforms.map(element => {
                  return {
                    ...element,
                    quantity: this.productsData.find(x => x.id === element.productid).quantity
                  }
                })
              }
            });
            if(!this.isRequired) {
              this.form.get('productid').setValue(this.assetRequest.products[0].catalogid)
            }
          }
          this.changeDetectorRef.detectChanges();
        }
      }, (error) => {
        this.alert.sweetAlert('Error', 'Error', 'error', true, false, 'OK').then((result) => {
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
    this.refreshData.emit(event);
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
        this.lookups[2].lookup = this.products;
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

  showFile(data: any) {
    console.log(data.value);
    this.showFileModal.toggleLiveDemo(data.value);
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

    this.form.get('filereferralguide').setValue(this.filerequest);

    let request: IAssetRequest = {
      id: this.form.get('id').value,
      casenumber: this.form.get('casenumber').value,
      description: null,
      filerequest: null,
      filereferralguide: this.form.get('filereferralguide').value,
      numberguide: this.form.get('numberguide').value,
      sapcode: null,
      useridrequested: this.form.get('useridrequested').value,
      useridguide: this.form.get('useridguide').value,
      catalogid: this.form.get('catalogid').value,
      prioritytypeid: this.form.get('prioritytypeid').value,
      agencyid: this.form.get('agencyid').value,
      billingid: this.form.get('billingid').value,
      processstateid: this.form.get('processstateid').value,
      workdepartmentid: this.form.get('workdepartmentid').value,
      products: this.productsData,
      proforms: []
    };

    this.GuideAssetRequest(request).subscribe(
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

  GuideAssetRequest(assetRequest:  IAssetRequest): Observable<BaseResponse> {
    return this.assetRequestService.GuideAssetRequest(assetRequest);
  }

}
