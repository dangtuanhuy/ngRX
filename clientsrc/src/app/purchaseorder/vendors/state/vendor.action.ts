import { Action } from '@ngrx/store';
import { VendorModel, VendorViewModel, PaymentTermModel, VendorFilterRequestModel } from '../vendor.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { CurrencyModel, TaxTypeModel } from '../../purchase-orders/purchase-order.model';

export enum VendorActionTypes {
  GetVendors = '[Vendor] Get Vendors',
  GetVendor = '[Vendor] Get Vendor',
  GetVendorsSuccess = '[Vendor] Get Vendors Success',
  GetVendorSuccess = '[Vendor] Get Vendor Success',
  GetVendorsFail = '[Vendor] Get Vendors Fail',
  AddVendor = '[Vendor] Add Vendor',
  AddVendorSuccess = '[Vendor] Add Vendor Success',
  AddVendorFail = '[Vendor] Add Vendor Fail',
  UpdateVendor = '[Vendor] Update Vendor',
  UpdateVendorSuccess = '[Vendor] Update Vendor Success',
  UpdateVendorFail = '[Vendor] Update Vendor Fail',
  DeleteVendor = '[Vendor] Delete Vendor',
  DeleteVendorSuccess = '[Vendor] Delete Vendor Success',
  DeleteVendorFail = '[Vendor] Delete Vendor Fail',
  GetCurrencies = '[Vendor] Get All Currencies',
  GetCurrenciesSuccess = '[Vendor] Get All Currencies Success',
  GetPaymentTerms = '[Vendor] Get All PaymentTerms',
  GetPaymentTermsSuccess = '[Vendor] Get All PaymentTerms Success',
  GetTaxTypes = '[Vendor] Get All TaxTypes',
  GetTaxTypesSuccess = '[Vendor] Get All TaxTypes Success'
}


export class GetVendors implements Action {
  readonly type = VendorActionTypes.GetVendors;
  constructor(public payload: PagingFilterCriteria, public filterRequest: VendorFilterRequestModel) { }
}

export class GetVendor implements Action {
  readonly type = VendorActionTypes.GetVendor;
  constructor(public payload: string) { }
}

export class GetVendorsSuccess implements Action {
  readonly type = VendorActionTypes.GetVendorsSuccess;
  constructor(public payload: PagedResult<VendorViewModel>) { }
}

export class GetVendorSuccess implements Action {
  readonly type = VendorActionTypes.GetVendorSuccess;
  constructor(public payload: VendorModel) { }
}

export class GetVendorsFail implements Action {
  readonly type = VendorActionTypes.GetVendorsFail;
  constructor(public payload: null) { }
}

export class AddVendor implements Action {
  readonly type = VendorActionTypes.AddVendor;
  constructor(public payload: VendorModel) { }
}

export class AddVendorSuccess implements Action {
  readonly type = VendorActionTypes.AddVendorSuccess;
  constructor(public payload: VendorModel) { }
}

export class AddVendorFail implements Action {
  readonly type = VendorActionTypes.AddVendorFail;
  constructor(public payload: string) { }
}

export class UpdateVendor implements Action {
  readonly type = VendorActionTypes.UpdateVendor;
  constructor(public payload: VendorModel) { }
}

export class UpdateVendorSuccess implements Action {
  readonly type = VendorActionTypes.UpdateVendorSuccess;
  constructor(public payload: VendorModel) { }
}

export class UpdateVendorFail implements Action {
  readonly type = VendorActionTypes.UpdateVendorFail;
  constructor(public payload: string) { }
}

export class DeleteVendor implements Action {
  readonly type = VendorActionTypes.DeleteVendor;
  constructor(public payload: string) { }
}

export class DeleteVendorSuccess implements Action {
  readonly type = VendorActionTypes.DeleteVendorSuccess;
  constructor(public payload: string) { }
}

export class DeleteVendorFail implements Action {
  readonly type = VendorActionTypes.DeleteVendorFail;
  constructor(public payload: string) { }
}

export class GetCurrencies implements Action {
  readonly type = VendorActionTypes.GetCurrencies;
  constructor() { }
}

export class GetCurrenciesSuccess implements Action {
  readonly type = VendorActionTypes.GetCurrenciesSuccess;
  constructor(public payload: Array<CurrencyModel>) { }
}

export class GetPaymentTerms implements Action {
  readonly type = VendorActionTypes.GetPaymentTerms;
  constructor() { }
}

export class GetPaymentTermsSuccess implements Action {
  readonly type = VendorActionTypes.GetPaymentTermsSuccess;
  constructor(public payload: Array<PaymentTermModel>) { }
}

export class GetTaxTypes implements Action {
  readonly type = VendorActionTypes.GetTaxTypes;
  constructor() { }
}

export class GetTaxTypesSuccess implements Action {
  readonly type = VendorActionTypes.GetTaxTypesSuccess;
  constructor(public payload: Array<TaxTypeModel>) { }
}

export type VendorActions =
  GetVendors
  | GetVendor
  | GetVendorsSuccess
  | GetVendorSuccess
  | GetVendorsFail
  | AddVendor
  | AddVendorSuccess
  | AddVendorFail
  | UpdateVendor
  | UpdateVendorSuccess
  | UpdateVendorFail
  | DeleteVendor
  | DeleteVendorSuccess
  | DeleteVendorFail
  | GetCurrencies
  | GetCurrenciesSuccess
  | GetPaymentTerms
  | GetPaymentTermsSuccess
  | GetTaxTypes
  | GetTaxTypesSuccess;
