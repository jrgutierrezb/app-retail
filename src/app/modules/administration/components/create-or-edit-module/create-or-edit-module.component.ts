import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Alert } from 'src/app/core/class/Alert';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IModule } from '../../interfaces/IModule.interface';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-create-or-edit-module',
  templateUrl: './create-or-edit-module.component.html',
  styleUrls: ['./create-or-edit-module.component.scss']
})
export class CreateOrEditModuleComponent implements OnInit {

  public liveDemoVisible = false;
  module:IModule;

  alert = new Alert();
  isEdit = false;
  namePage: string;

  form!: FormGroup;

  errorFormulario = new ErrorFormulario();

  constructor(
    private moduleService: ModuleService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  buildForm() {
    return new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      icon: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      idmodule: new FormControl(null)
    });
  }

  toggleLiveDemo(id?: number) {
    this.liveDemoVisible = !this.liveDemoVisible;
    this.form = this.buildForm();
    this.isEdit = false;
    this.namePage = 'Crear Modulo';
    if(id) {
      this.isEdit = true;
      this.namePage = 'Editar Modulo';
      this.moduleService.ModuleById(id)
      .subscribe((respuesta) => {
        if(!respuesta.error) {
          this.module = respuesta.data;
          this.form.setValue(this.module);
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
          this.module = respuesta.data;
          this.form.setValue(this.module);
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

  CreateOrEdit(module:  IModule): Observable<BaseResponse> {
    if(module.id) {
      return this.moduleService.UpdateModule(module);
    }
    else {
      return this.moduleService.saveModule(module);
    }
  }

}
