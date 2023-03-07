import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IModule } from '../../interfaces/IModule.interface';
import { ITransaction } from '../../interfaces/ITransaction.interface';
import { ModuleService } from '../../services/module.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-create-or-edit-transaction',
  templateUrl: './create-or-edit-transaction.component.html',
  styleUrls: ['./create-or-edit-transaction.component.scss']
})
export class CreateOrEditTransactionComponent implements OnInit {

  public liveDemoVisible = false;
  transaction:ITransaction;

  modules:IModule[];

  alert = new Alert();
  isEdit = false;

  form!: FormGroup;

  namePage: string = 'Crear Pantalla';

  errorFormulario = new ErrorFormulario();

  constructor(
    private transactionService: TransactionService,
    private moduleService: ModuleService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getModules();
    this.form = this.buildForm();
  }

  buildForm() {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      idmodule: new FormControl(null, [Validators.required]),
      url: new FormControl('', [Validators.required])
    });
  }

  getModules() {
    this.moduleService.Modules().subscribe((respuesta) => {
      if(!respuesta.error) {
        this.modules = respuesta.data;
      }
      else {
        this.modules = [];
      }
    }, (error) => {
      this.modules = [];
    });
  }

  toggleLiveDemo(id?: number) {
    this.liveDemoVisible = !this.liveDemoVisible;
    this.form = this.buildForm();
    this.isEdit = false;
    this.namePage = 'Crear Pantalla';
    if(id) {
      this.isEdit = true;
      this.namePage = 'Editar Pantalla';
      this.transactionService.TransactionById(id)
      .subscribe((respuesta) => {
        if(!respuesta.error) {
          this.transaction = respuesta.data;
          this.form.setValue(this.transaction);
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
          this.transaction = respuesta.data;
          this.form.setValue(this.transaction);
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
              console.log(result);
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

  CreateOrEdit(transaction:  ITransaction): Observable<BaseResponse> {
    if(transaction.id) {
      return this.transactionService.UpdateTransaction(transaction);
    }
    else {
      return this.transactionService.saveTransaction(transaction);
    }
  }

}
