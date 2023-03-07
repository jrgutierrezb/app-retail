import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { IAgency } from 'src/app/modules/assetsManagement/interfaces/IAgency';
import { ICompanyToBeBilling } from 'src/app/modules/assetsManagement/interfaces/ICompanyToBeBilling';
import { IWorkDepartment } from 'src/app/modules/assetsManagement/interfaces/IWorkDepartment';
import { AgencyService } from 'src/app/modules/assetsManagement/services/agency.service';
import { CompanyToBeBillingService } from 'src/app/modules/assetsManagement/services/company-to-be-billing.service';
import { WorkDepartmentService } from 'src/app/modules/assetsManagement/services/work-department.service';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { User } from '../../class/User';
import { IUser } from '../../interfaces/IUser';
import { Profile } from '../../interfaces/profile.interface';
import { ProfileService } from '../../services/profile.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public liveDemoVisible = false;
  user: User;
  iuser: IUser;
  alert = new Alert();
  isEdit = false;
  namePage: string;

  form!: FormGroup;

  errorFormulario = new ErrorFormulario();

  profiles: Profile[];
  public workDepartments: IWorkDepartment[];
  public agencies: IAgency[];
  public companyToBeBilling: ICompanyToBeBilling[];

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private workDepartmentService: WorkDepartmentService,
    private agencyService: AgencyService,
    private companyToBeBillingService: CompanyToBeBillingService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.workDepartments = [];
    this.agencies = [];
    this.companyToBeBilling = [];
   }

  ngOnInit(): void {
    this.form = this.buildForm();
    this.getProfiles();
    this.getWorkDeparments();
    this.getAgencies();
    this.getCompanyToBeBilling();
  }

  buildForm() {
    return new FormGroup({
      id: new FormControl(null),
      identification: new FormControl('', [Validators.required]),
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      profileid: new FormControl(1, [Validators.required]),
      agencyid: new FormControl(1, [Validators.required]),
      companyid: new FormControl(null, [Validators.required]),
      workdepartmentid: new FormControl(null, [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      telephone: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      cellphone: new FormControl('', [Validators.required])
    });
  }

  toggleLiveDemo(id?: number) {
    this.liveDemoVisible = !this.liveDemoVisible;
    this.form = this.buildForm();
    this.isEdit = false;
    this.namePage = 'Crear Usuario';
    if(id) {
      this.isEdit = true;
      this.namePage = 'Editar Usuario';
      this.userService.UserById(id)
      .subscribe((respuesta) => {
        if(!respuesta.error) {
          this.user = new User(respuesta.data.id, respuesta.data.cellphone, respuesta.data.firstname, 
            respuesta.data.identification, respuesta.data.lastname, respuesta.data.profileid,
            respuesta.data.mail, respuesta.data.telephone, respuesta.data.username, respuesta.data.agencyid,
            respuesta.data.companyid, respuesta.data.workdepartmentid);
          this.form.setValue(this.user);
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
    this.changeDetectorRef.detectChanges();
  }

  handleLiveDemoChange(event: boolean) {
    this.liveDemoVisible = event;
    this.changeDetectorRef.detectChanges();
  }

  save() {
    if (this.form.invalid) {
      this.alert.sweetAlert('Formulario inválido', 
          'Existen campos vacíos o con datos inválidos', 
          'warning',
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

    this.CreateOrEdit(this.form.value).subscribe(
      (respuesta) => {
        if(!respuesta.error) {
          this.iuser = respuesta.data;
          //this.form.setValue(this.iuser);
          this.alert.sweetAlert('Confirmación', 
              respuesta.message, 
              'success',
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
        else {
          this.alert.sweetAlert('Información', 
              respuesta.message, 
              'info',
              true,
              false,
              'OK'
            ).then((result) => {
              console.log(result);
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

  CreateOrEdit(mailSetting:  IUser): Observable<BaseResponse> {
    if(mailSetting.id) {
      return this.userService.UpdateUser(mailSetting);
    }
    else {
      return this.userService.saveUser(mailSetting);
    }
  }

  getProfiles() {
    this.profileService.Profiles().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.profiles = respuesta.data;
      }
      else {
        this.profiles = [];
      }
    }, (error) => {
      this.profiles = [];
    });
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

}
