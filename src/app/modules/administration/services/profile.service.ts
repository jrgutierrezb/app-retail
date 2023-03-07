import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    Profiles(): Observable<BaseResponse<Profile[]>> {
        return this.httpClient.get<BaseResponse<Profile[]>>(`${this.APIEndpoint}profiles`);
    }
}