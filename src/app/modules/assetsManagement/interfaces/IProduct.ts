import { IProductproform } from './IProductproform';
import { IInventoryProduct } from './IInventoryProduct';

export interface IProduct {
    id: number;
    adquisiondate: Date;
    quantity: number;
    technicaldescription: string;
    totalvalue: number;
    value: number;
    productproforms: IProductproform[];
    inventoryproducts:IInventoryProduct[];
    assetrequestid: number;
    catalogid: number;
    catalogproductid?: number;
    yearwarranty: number;
    invoicenumber?: string;
    brand?: string;
    model?: string;
}
