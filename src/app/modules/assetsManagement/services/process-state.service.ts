import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IProcessState } from '../interfaces/IProcessState';

@Injectable({
  providedIn: 'root'
})
export class ProcessStateService {

  public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  getProcessStates(): Observable<BaseResponse<IProcessState[]>> {
    return this.httpClient.get<BaseResponse<IProcessState[]>>(`${this.APIEndpoint}processStates/all`);
  }

  ProcessStates(code: string): Observable<BaseResponse<IProcessState[]>> {
    return this.httpClient.get<BaseResponse<IProcessState[]>>(`${this.APIEndpoint}processStates/${code}`);
  }

}
