import { Action } from '@ngrx/store';
import { PaymentModeViewModel, PaymentModeModel } from 'src/app/pos/shared/models/payment-mode.model';

export enum PaymentModeActionTypes {
    AddPaymentMode = '[PaymentMode] Add PaymentMode.',
    AddPaymentModeSuccess = '[PaymentMode] Add PaymentMode Success.',

    DeletePaymentModeByCode = '[PaymentMode] Delete PaymentMode By Code.',
    DeletePaymentModeByCodeSuccess = '[PaymentMode] Delete PaymentMode By Code Success.',

    UpdatePaymentModeAmount = '[PaymentMode] Update PaymentMode Amount.',

    GetDefaultPaymentModes = '[PaymentMode] Get Default PaymentModes.',
    GetDefaultPaymentModesSuccess = '[PaymentMode] Get Default PaymentModes Success.',

    ClearPaymentModes = '[PaymentMode] Clear PaymentModes.'
}

export class AddPaymentMode implements Action {
    readonly type = PaymentModeActionTypes.AddPaymentMode;
    constructor(public payload: PaymentModeViewModel) { }
}

export class AddPaymentModeSuccess implements Action {
    readonly type = PaymentModeActionTypes.AddPaymentModeSuccess;
    constructor(public payload: PaymentModeViewModel) { }
}

export class DeletePaymentModeByCode implements Action {
    readonly type = PaymentModeActionTypes.DeletePaymentModeByCode;
    constructor(public payload: string) { }
}

export class DeletePaymentModeByCodeSuccess implements Action {
    readonly type = PaymentModeActionTypes.DeletePaymentModeByCodeSuccess;
    constructor(public payload: any) { }
}

export class UpdatePaymentModeAmount implements Action {
    readonly type = PaymentModeActionTypes.UpdatePaymentModeAmount;
    constructor(public payload: any) { }
}

export class GetDefaultPaymentModes implements Action {
    readonly type = PaymentModeActionTypes.GetDefaultPaymentModes;
    constructor() { }
}

export class GetDefaultPaymentModesSuccess implements Action {
    readonly type = PaymentModeActionTypes.GetDefaultPaymentModesSuccess;
    constructor(public payload: PaymentModeModel[]) { }
}

export class ClearPaymentModes implements Action {
    readonly type = PaymentModeActionTypes.ClearPaymentModes;
    constructor() { }
}

export type PaymentModeActions = AddPaymentMode
    | AddPaymentModeSuccess
    | DeletePaymentModeByCode
    | DeletePaymentModeByCodeSuccess
    | UpdatePaymentModeAmount
    | GetDefaultPaymentModes
    | GetDefaultPaymentModesSuccess
    | ClearPaymentModes;
