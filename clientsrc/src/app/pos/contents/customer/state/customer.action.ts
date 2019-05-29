import { Action } from '@ngrx/store';

export enum CustomerActionTypes {
    GetCustomers = '[Customer] Get Customers',
    UpdateSearchInformation = '[Customer] Update Search Information',
    ClearSearchInformation = '[Customer] Clear Search Information'
}

export class GetCustomers implements Action {
    readonly type = CustomerActionTypes.GetCustomers;
    constructor() { }
}

export class UpdateSearchInformation implements Action {
    readonly type = CustomerActionTypes.UpdateSearchInformation;
    constructor(public payload: any) { }
}

export class ClearSearchInformation implements Action {
    readonly type = CustomerActionTypes.ClearSearchInformation;
    constructor() { }
}

export type CustomerActions =
    GetCustomers
    | UpdateSearchInformation
    | ClearSearchInformation;
