import { IProduct } from './IProduct';
import { IProform } from './IProform';

export interface IAssetRequest {
    id: number;
    casenumber: string;
    description: string;
    filerequest: string;
    filereferralguide?: string;
    numberguide?: string;
    sapcode: string;
    useridrequested: number;
    useridapproved?: number;
    useriddenied?: number;
    useridwarehouse?: number;
    deniedobservation?: string;
    useridproform?: number;
    useridapprovedproform?: number;
    useriddeniedproform?: number;
    deniedproformobservation?: string;
    useridguide?: number;
    useridregister?: number;
    useridexited?: number;
    useridreceived?: number;
    usernamerequested?: string;
    catalogid: number;
    prioritytypeid: number;
    agencyid: number;
    billingid: number;
    processstateid: number;
    workdepartmentid: number;
    inventoryproductid?: number;
    products: IProduct[];
    proforms:IProform[];
}