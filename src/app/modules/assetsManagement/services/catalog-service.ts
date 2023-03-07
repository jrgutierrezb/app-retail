import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { ICatalog } from '../interfaces/ICatalog';
import { IInventory } from '../interfaces/IInventory';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  Catalogs(code:string): Observable<BaseResponse<ICatalog[]>> {
    return this.httpClient.get<BaseResponse<ICatalog[]>>(`${this.APIEndpoint}catalog/${code}`);
  }

  Inventories(code:string): Observable<BaseResponse<IInventory[]>> {
    return this.httpClient.get<BaseResponse<IInventory[]>>(`${this.APIEndpoint}inventory/${code}`);
  }

  InventoriesReg( companyid:number, agencyid:number, departmentid:number) {
    return this.httpClient.get<BaseResponse<ICatalog[]>>(`${this.APIEndpoint}catalog/inventory?companyid=${companyid}&agencyid=${agencyid}&departmentid=${departmentid}`);
  }

}