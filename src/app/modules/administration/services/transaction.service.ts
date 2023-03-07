import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { ITransaction } from '../interfaces/ITransaction.interface';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {

    public defaultHeaders = new HttpHeaders();
    APIEndpoint = environment.baseUrl;

    constructor(
        protected httpClient: HttpClient
    ) { }

    Transactions(): Observable<BaseResponse<ITransaction[]>> {
        return this.httpClient.get<BaseResponse<ITransaction[]>>(`${this.APIEndpoint}transactions`);
    }

    TransactionById(id:number): Observable<BaseResponse<ITransaction>> {
        return this.httpClient.get<BaseResponse<ITransaction>>(`${this.APIEndpoint}transactions/${id}`);
    }

    public saveTransaction(module: ITransaction): Observable<BaseResponse> 
    {
        return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}transactions`, module);
    }

    public UpdateTransaction(module: ITransaction): Observable<BaseResponse> 
    {
        return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}transactions/${module.id}`, module);
    }
}