import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IAgency } from '../interfaces/IAgency';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {

  public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  Agencies(): Observable<BaseResponse<IAgency[]>> {
    return this.httpClient.get<BaseResponse<IAgency[]>>(`${this.APIEndpoint}agencies`);
  }

}
