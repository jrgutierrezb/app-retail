import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IUser } from '../interfaces/IUser';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    Users(): Observable<BaseResponse<IUser[]>> {
        return this.httpClient.get<BaseResponse<IUser[]>>(`${this.APIEndpoint}users`);
    }

    UserById(id:number): Observable<BaseResponse<IUser>> {
        return this.httpClient.get<BaseResponse<IUser>>(`${this.APIEndpoint}users/${id}`);
    }

    public saveUser(user: IUser): Observable<BaseResponse> 
    {
        return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}users`, user);
    }

    public UpdateUser(user: IUser): Observable<BaseResponse> 
    {
        return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}users/${user.id}`, user);
    }
}