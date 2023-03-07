import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/shared/interfaces/baseresponse.interface';
import { IAssetRequest } from '../interfaces/IAssetRequest';
import { IAssignRequest } from '../interfaces/IAssignRequest';
import { IProform } from '../interfaces/IProform';

@Injectable({
  providedIn: 'root'
})
export class AssetRequestService {

  public defaultHeaders = new HttpHeaders();
  APIEndpoint = environment.baseUrl;

  constructor(
    protected httpClient: HttpClient
  ) { }

  AssetRequests(userid: number): Observable<BaseResponse<IAssetRequest[]>> {
    return this.httpClient.get<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/0/${userid}`);
  }

  AssetRequestFilters(params:any): Observable<BaseResponse<any[]>> {
    return this.httpClient.post<BaseResponse<any[]>>(`${this.APIEndpoint}assetRequests/filters`, params);
  }

  RequestAssigned(): Observable<BaseResponse<IAssetRequest[]>> {
    return this.httpClient.get<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/assigned`);
  }
  RequestAssignedFilters(params:any): Observable<BaseResponse<any[]>> {
    return this.httpClient.post<BaseResponse<any[]>>(`${this.APIEndpoint}assetRequests/assigned/filters`, params);
  }

  RequestDenied(): Observable<BaseResponse<IAssetRequest[]>> {
    return this.httpClient.get<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/denied`);
  }

  RequestDeniedFilters(params:any): Observable<BaseResponse<any[]>> {
    return this.httpClient.post<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/denied/filters`, params);
  }

  RequestWareHouseFilters(params:any): Observable<BaseResponse<any[]>> {
    return this.httpClient.post<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/warehouse/filters`, params);
  }

  RequestApprovedManager(): Observable<BaseResponse<IAssetRequest[]>> {
    return this.httpClient.get<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/manager`);
  }

  RequestApprovedManagerFilters(params:any): Observable<BaseResponse<IAssetRequest[]>> {
    return this.httpClient.post<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/manager/filters`, params);
  }

  RequestInventoryFilters(params:any): Observable<BaseResponse<IAssetRequest[]>> {
    return this.httpClient.post<BaseResponse<IAssetRequest[]>>(`${this.APIEndpoint}assetRequests/inventory/filters`, params);
  }

  public saveAssetRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}assetRequests`, assetRequest);
  }

  AssetRequestById(id:number): Observable<BaseResponse<IAssetRequest>> {
    return this.httpClient.get<BaseResponse<IAssetRequest>>(`${this.APIEndpoint}assetRequests/${id}`);
  }

  public UpdateAssetRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/${assetRequest.id}`, assetRequest);
  }

  public AssignRequest(assetRequest: any): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/assigned/${assetRequest.id}`, assetRequest);
  }

  public ApproveRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/approve/${assetRequest.id}`, assetRequest);
  }

  public DeniedRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/denied/${assetRequest.id}`, assetRequest);
  }

  public WareHouseRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/warehouse/${assetRequest.id}`, assetRequest);
  }

  public ReceivedRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/received/${assetRequest.id}`, assetRequest);
  }

  public ProformRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}assetRequests/proform`, assetRequest);
  }

  public ApproveProformRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}assetRequests/approveproform`, assetRequest);
  }

  public DeniedProformAssetRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}assetRequests/deniedproform`, assetRequest);
  }

  public GuideAssetRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}assetRequests/guide`, assetRequest);
  }

  public RegisterAssetRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.post<BaseResponse>(`${this.APIEndpoint}assetRequests/register`, assetRequest);
  }

  public DispathAssetRequest(assetRequest: IAssetRequest): Observable<BaseResponse> 
  {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/dispath/${assetRequest.id}`, assetRequest);
  }

  public MaintenanceRequest(assetRequest: any): Observable<BaseResponse> {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/maintenance/${assetRequest.id}`, assetRequest);
  }

  public DownRequest(assetRequest: any): Observable<BaseResponse> {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/down/${assetRequest.id}`, assetRequest);
  }

  public DevolutionRequest(assetRequest: any): Observable<BaseResponse> {
    return this.httpClient.put<BaseResponse>(`${this.APIEndpoint}assetRequests/devolution/${assetRequest.id}`, assetRequest);
  }

  public DeleteAssetRequest(assetRequestId: number): Observable<BaseResponse> 
  {
    return this.httpClient.delete<BaseResponse>(`${this.APIEndpoint}assetRequests/${assetRequestId}`);
  }
}
