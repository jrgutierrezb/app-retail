import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { StorageService } from 'src/app/shared/services/storage.service';
import { Alert } from "../class/Alert";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  alert = new Alert();

    constructor(
        private s_storage: StorageService
    ) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      
        let headers: HttpHeaders;
        // * si esta autenticado
        if (this.s_storage.isAuthenticated()) {
          headers = this.createHeader();
        } else {
          headers = new HttpHeaders({
          });
        }

        const newRequest = request.clone({ headers: headers });
        return next.handle(newRequest).pipe(
            finalize(() => {
              //this.snack_bar.dismiss();
            }),
            catchError((err) => {
              
              //this.snack_bar.dismiss();
              switch (err.status) {
                case 401:
                  this.s_storage.logout();
                  this.alert.sweetAlert('Error', 'Error', 'error', true, false, 'OK')
                  .then((result) => {
                    console.log(result);
                  }).catch((error) => {
                    console.log(error);
                  });
                  break;
                case 403:
                  /*SweetAlertService.swalToast(
                    err?.error?.message || 'No posee los permisos necesarios para este contenido',
                    'warning'
                  );*/
                  if (this.s_storage.isAuthenticated()) { this.s_storage.logout(); }
                  break;
                case 422:
                  // if (err?.error.hasOwnProperty('success')) {
                  //   SweetAlertService.swalToast(err.error.data, 'warning');
                  // } else {
                    /*SweetAlertService.swalToast(
                     err?.error?.message || 'Contenido no valido código',
                      'warning'
                    );*/
                  // }
                  break;
                case 404:
                  /*SweetAlertService.swalToast(
                    err?.error?.message || 'El servidor no pudo encontrar el contenido solicitado.',
                    'warning'
                  );*/
                  break;
                case 500:
                  /*SweetAlertService.swalToast(
                    'Error del servidor, intentalo otra vez',
                    'warning'
                  );*/
                  break;
  
                default:
                  // if (err?.error.hasOwnProperty('success')) {
                  //   SweetAlertService.swalToast(err?.error?.data, 'warning');
                  // } else {
  
                    /*SweetAlertService.swalToast(
                      err?.error?.message || 'Ups! Ocurrió un problema intentalo de nuevo',
                      'warning'
                    );*/
                  // }
                  break;
              }
              return throwError(err);
            })
          );
    }

    createHeader() {
        const token = this.s_storage.getCurrentToken();
        const Header = new HttpHeaders({
          accept: 'application/json',
          canal: 'WEB',
          Authorization: 'Bearer ' + token || ''
        });
        return Header;
    }
}