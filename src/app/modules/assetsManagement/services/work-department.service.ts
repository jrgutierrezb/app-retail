import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IWorkDepartment } from '../interfaces/IWorkDepartment';

@Injectable({
  providedIn: 'root'
})
export class WorkDepartmentService {

  public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  WorkDeparments(): Observable<BaseResponse<IWorkDepartment[]>> {
    return this.httpClient.get<BaseResponse<IWorkDepartment[]>>(`${this.APIEndpoint}workDepartments`);
  }

}
