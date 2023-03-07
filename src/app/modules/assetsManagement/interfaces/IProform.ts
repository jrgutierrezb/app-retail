import { IProductproform } from './IProductproform';

export interface IProform {
    id: number;
    fileproforma: string;
    productproforms: IProductproform[];
    assetrequestid: number;
    approved?: boolean;
    totalvalue?: number;
    supplier?: string;
}
