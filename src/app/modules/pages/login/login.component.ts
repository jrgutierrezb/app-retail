import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/core/class/Alert';
import { Session } from 'src/app/core/class/Session';
import { User } from 'src/app/core/class/User';
import { SecurityService } from 'src/app/core/services/security.service'
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;

  alert = new Alert();


  constructor(
    private router: Router,
    private securityService: SecurityService,
    private storageService: StorageService,
  ) { }
  ngOnInit(): void {
    this.form = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  Login() { 
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
    this.securityService.Login(this.form.value)
    .subscribe((respuesta) => {
      if(!respuesta.error) {
        let credenciales = {
          token:respuesta.data.token,
          user:respuesta.data.user
        };
        this.storageSession(respuesta);
        this.router.navigate(['/admin']);
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
    })
  }

  storageSession(response: any): void {
    const _user = response.data.user;
    const user = new User(_user.mail, _user.firstname, _user.lastname, _user.username, 
                          _user.identification, _user.id, _user.profileid);
    const session = new Session(response.data.token, user, null);
    this.storageService.setCurrentSession(session);
  }

}
