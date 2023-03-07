import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { Permission } from '../interfaces/permission.interface';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    Permissions(): Observable<BaseResponse<Permission[]>> {
        return this.httpClient.get<BaseResponse<Permission[]>>(`${this.APIEndpoint}permissions`);
    }

}