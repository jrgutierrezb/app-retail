import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorFormulario } from 'src/app/core/class/ErrorFormulario';
import { IMailSetting } from '../../interfaces/IMailSetting.interface';
import { Alert } from 'src/app/core/class/Alert';

import { MailSettingService } from './../../services/mail-setting.service';
import { Observable } from 'rxjs';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';

@Component({
  selector: 'app-create-or-edit-mail-setting',
  templateUrl: './create-or-edit-mail-setting.component.html',
  styleUrls: ['./create-or-edit-mail-setting.component.scss']
})
export class CreateOrEditMailSettingComponent implements OnInit {

  form!: FormGroup;

  errorFormulario = new ErrorFormulario();

  alert = new Alert();

  mailSetting?:IMailSetting;

  validar = false;

  constructor(
    private mailSettingService: MailSettingService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      host: new FormControl('', [Validators.required]),
      usermail: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      starttls: new FormControl(true, [Validators.required]),
      auth: new FormControl(true, [Validators.required])
    });

    this.mailSettingService.MailSetting()
    .subscribe((respuesta) => {
      if(!respuesta.error) {
        this.mailSetting = respuesta.data;
        this.form.setValue(this.mailSetting);
      }
    }, (error) => {
      console.log(error);
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

  onSubmit() {
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
          this.mailSetting = respuesta.data;
          this.form.setValue(this.mailSetting);
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

  CreateOrEdit(mailSetting:  IMailSetting): Observable<BaseResponse> {
    if(mailSetting.id) {
      return this.mailSettingService.UpdateMailSetting(mailSetting);
    }
    else {
      return this.mailSettingService.saveMailSetting(mailSetting);
    }
  }

}
