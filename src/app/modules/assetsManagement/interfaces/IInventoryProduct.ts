export interface IInventoryProduct {
    id: number;
    yearwarranty: number;
    inventoryid: number;
    productid: number;
    agencyid: number;
    billingid: number;
    workdepartmentid: number;
    productstateid: number;
    invoicenumber?: string;
    brand?: string;
    model?: string;
}
