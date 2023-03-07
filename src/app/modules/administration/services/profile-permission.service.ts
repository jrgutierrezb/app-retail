import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { ProfileTransacction } from '../interfaces/profiletransacction.interface';

@Injectable({
    providedIn: 'root'
})
export class ProfilePermissionService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    ProfilePermissions(idProfile: number, idModule: number): Observable<BaseResponse<any[]>> {
        return this.httpClient.get<BaseResponse<ProfileTransacction[]>>(`${this.APIEndpoint}profilePermissions/all/${idProfile}/${idModule}`);
    }

    getById(id: number) {
        return this.httpClient.get<BaseResponse<ProfileTransacction>>(`${this.APIEndpoint}profilePermissions/${id}`);
    }
    
    public saveProfilePermission(profilePermission: ProfileTransacction): Observable<BaseResponse> 
    {
        return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}profilePermissions`, profilePermission);
    }

    public UpdateProfilePermission(profilePermission: ProfileTransacction): Observable<BaseResponse> 
    {
        return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}profilePermissions/${profilePermission.id}`, profilePermission);
    }

    public DeleteProfilePermission(id: number): Observable<BaseResponse> 
    {
        return this.httpClient.delete<BaseResponse>(`${this.APIEndpoint}profilePermissions/${id}`);
    }
}