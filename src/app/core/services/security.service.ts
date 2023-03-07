import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { LoginDto } from '../interfaces/login.interface';
import { User } from '../class/User';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    /**
    *
    *
    * @param data 
    */
    public Login(data: LoginDto): Observable<BaseResponse>
    {
        return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}login`, data);
    }

    public Menu(profileid: number | null) : Observable<BaseResponse> {
        return this.httpClient.get<BaseResponse>(`${this.APIEndpoint}menu/${profileid}`);
    }
}