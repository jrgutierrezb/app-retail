import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { ITransaction } from '../../interfaces/ITransaction.interface';
import { Profile } from '../../interfaces/profile.interface';
import { ProfileTransacction } from '../../interfaces/profiletransacction.interface';
import { ProfileService } from '../../services/profile.service';
import { Permission } from '../../interfaces/permission.interface';
import { TransactionService } from '../../services/transaction.service';
import { ProfilePermissionService } from '../../services/profile-permission.service';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
@Component({
    selector: 'app-create-or-edit-profile-permission',
    templateUrl: './create-or-edit-profile-permission.component.html',
    styleUrls: ['./create-or-edit-profile-permission.component.scss']
})
export class CreateOrEditProfilePermissionComponent implements OnInit {

    public liveDemoVisible = false;

    profilePermission: ProfileTransacction;

    
    profiles: Profile[];
    transactions: ITransaction[];
    permissions: Permission[];

    alert = new Alert();
    isEdit = false;

    form!: FormGroup;

    errorFormulario = new ErrorFormulario();

    constructor(
        private profileService: ProfileService,
        private transactionService: TransactionService,
        private profilePermissionService: ProfilePermissionService,
        private changeDetectorRef: ChangeDetectorRef
      ) { }
    
    
    ngOnInit(): void {
        this.form = this.buildForm();
        this.getProfiles();
        this.getTransacctions();
    }

    toggleLiveDemo(id?: number) {
        this.liveDemoVisible = !this.liveDemoVisible;
        this.form = this.buildForm();
        this.isEdit = false;
        if(id) {
            this.getById(id);
        }
        this.changeDetectorRef.detectChanges();
    }

    getById(id:number) {
        this.profilePermissionService.getById(id).subscribe(
            (respuesta) => {
                if(!respuesta.error) {
                    this.profilePermission = respuesta.data;
                    this.form = this.buildForm();
                }
            }, (errot) => {
                this.alert.sweetAlert('Error', 'Error', 'error', true, false, 'OK'
                ).then((result) => {
                  console.log(result);
                }).catch((error) => {
                  console.log(error);
                });
            }
        )
    }

    handleLiveDemoChange(event: boolean) {
        this.liveDemoVisible = event;
        this.changeDetectorRef.detectChanges();
    }

    buildForm() {
        return new FormGroup({
            id: new FormControl(this.profilePermission ? this.profilePermission.id : null),
            profileid: new FormControl(this.profilePermission ? this.profilePermission.profileid  : null, [Validators.required]),
            transactionid: new FormControl(this.profilePermission ? this.profilePermission.transactionid : null, [Validators.required])
        });
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

    getTransacctions() {
        this.transactionService.Transactions().subscribe((respuesta) => {
            if(!respuesta.error) {
                this.transactions = respuesta.data;
            }
            else {
                this.transactions = [];
            }
        }, (error) => {
              this.transactions = [];
        });
    }

    save() {
        if (this.form.invalid) {
            this.alert.sweetAlert('Formulario inválido', 'Existen campos vacíos o con datos inválidos', 
                'warning', true, false, 'OK'
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
                this.profilePermission = respuesta.data;
                this.form = this.buildForm();
                this.alert.sweetAlert('Confirmación', respuesta.message, 
                    'success', true, false, 'OK'
                  ).then((result) => {
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
                    this.handleLiveDemoChange(false);
                  }).catch((error) => {
                    console.log(error);
                  });
              }
            }, (error) => {
              this.alert.sweetAlert('Confirmación', 'Error', 'error', true, false, 'OK'
                ).then((result) => {
                  console.log(result);
                }).catch((error) => {
                  console.log(error);
                });
              return;
            }
          );
    }

    CreateOrEdit(profileTransacction:  ProfileTransacction): Observable<BaseResponse> {
        if(profileTransacction.id) {
          return this.profilePermissionService.UpdateProfilePermission(profileTransacction);
        }
        else {
          return this.profilePermissionService.saveProfilePermission(profileTransacction);
        }
      }
  
}