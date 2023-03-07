import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IMailSetting } from './../interfaces/IMailSetting.interface';

@Injectable({
    providedIn: 'root'
})
export class MailSettingService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    public MailSetting() : Observable<BaseResponse<IMailSetting>> {
        return this.httpClient.get<BaseResponse<IMailSetting>>(`${this.APIEndpoint}mailsettings`);
    }

    public saveMailSetting(mailSetting: IMailSetting): Observable<BaseResponse> 
    {
        return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}mailsettings`, mailSetting);
    }

    public UpdateMailSetting(mailSetting: IMailSetting): Observable<BaseResponse> 
    {
        return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}mailsettings/${mailSetting.id}`, mailSetting);
    }
}