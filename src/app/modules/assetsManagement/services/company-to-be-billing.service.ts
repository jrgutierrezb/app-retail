import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { ICompanyToBeBilling } from '../interfaces/ICompanyToBeBilling';

@Injectable({
  providedIn: 'root'
})
export class CompanyToBeBillingService {

  public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  CompanyToBeBilling(): Observable<BaseResponse<ICompanyToBeBilling[]>> {
    return this.httpClient.get<BaseResponse<ICompanyToBeBilling[]>>(`${this.APIEndpoint}companytobebilling`);
  }

}
