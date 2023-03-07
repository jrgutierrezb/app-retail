import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IModule } from '../interfaces/IModule.interface';

@Injectable({
    providedIn: 'root'
})
export class ModuleService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    Modules(): Observable<BaseResponse<IModule[]>> {
        return this.httpClient.get<BaseResponse<IModule[]>>(`${this.APIEndpoint}modules`);
    }

    ModuleById(id:number): Observable<BaseResponse<IModule>> {
        return this.httpClient.get<BaseResponse<IModule>>(`${this.APIEndpoint}modules/${id}`);
    }

    public saveModule(module: IModule): Observable<BaseResponse> 
    {
        return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}modules`, module);
    }

    public UpdateModule(module: IModule): Observable<BaseResponse> 
    {
        return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}modules/${module.id}`, module);
    }
}