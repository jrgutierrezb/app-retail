import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';

@Injectable({
    providedIn: 'root'
  })
  export class ReportsService {

    public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  ReportStates(params: any) {
    return this.httpClient.post<BaseResponse<any[]>>(`${this.APIEndpoint}report/states`, params);
  }

  ReportTypesRequests(year: number) {
    return this.httpClient.get<BaseResponse<any[]>>(`${this.APIEndpoint}report/years/${year}`);
  }

  GeneralReport(params: any) {
    return this.httpClient.post<BaseResponse<any[]>>(`${this.APIEndpoint}report/general`, params);
  }

}