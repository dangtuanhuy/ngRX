import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PurchaseOrderModel, RequestPurchaseOrderModel, UpdatePurchaseOrderModel, CurrencyModel,
  UserManagerModel,
  SubmitPurchaseOrderModel,
  GetPurchaseOrderModel,
  UpdatePurchaseOrderDateModel,
  InvoiceInfo} from '../purchase-order.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { VendorModel } from '../../vendors/vendor.model';
import { PurchaseOrderTypeEnum } from 'src/app/shared/constant/purchase-order.constant';

export enum PurchaseOrderActionTypes {
  GetPurchaseOrders = '[PurchaseOrder] Get Purchase Orders',
  GetPurchaseOrder = '[PurchaseOrder] Get Purchase Order',
  GetPurchaseOrdersSuccess = '[PurchaseOrder] Get Purchase Orders Success',
  GetPurchaseOrderSuccess = '[PurchaseOrder] Get Purchase Order Success',
  GetPurchaseOrdersFail = '[PurchaseOrder] Get Purchase Orders Fail',
  AddPurchaseOrder = '[PurchaseOrder] Add Purchase Order',
  AddPurchaseOrderSuccess = '[PurchaseOrder] Add Purchase Order Success',
  AddPurchaseOrderFail = '[PurchaseOrder] Add Purchase Order Fail',
  UpdatePurchaseOrder = '[PurchaseOrder] Update Purchase Order',
  UpdatePurchaseOrderSuccess = '[PurchaseOrder] Update Purchase Order Success',
  UpdatePurchaseOrderFail = '[PurchaseOrder] Update Purchase Order Fail',
  UpdatePurchaseOrderDate = '[PurchaseOrder] Update Purchase Order Date',
  UpdatePurchaseOrderDateSuccess = '[PurchaseOrder] Update Purchase Order Date Success',
  UpdatePurchaseOrderDateFail = '[PurchaseOrder] Update Purchase Order Date Fail',
  DeletePurchaseOrder = '[PurchaseOrder] Delete Purchase Order',
  DeletePurchaseOrderSuccess = '[PurchaseOrder] Delete Purchase Order Success',
  DeletePurchaseOrderFail = '[PurchaseOrder] Delete Purchase Order Fail',
  ConvertPurchaseOrder = '[PurchaseOrder] Convert Purchase Order',
  ConvertPurchaseOrderSuccess = '[PurchaseOrder] Convert Purchase Order Success',
  ConvertPurchaseOrderFail = '[PurchaseOrder] Convert Purchase Order Fail',
  ByPassPurchaseOrder = '[PurchaseOrder] By Pass Purchase Order',
  ByPassPurchaseOrderSuccess = '[PurchaseOrder] By Pass Purchase Order Success',
  ByPassPurchaseOrderFail = '[PurchaseOrder] By Pass Purchase Order Fail',
  SubmitPurchaseOrderFail = '[PurchaseOrder] Submit Purchase Order Fail',
  SubmitPurchaseOrder = '[PurchaseOrder] Submit Purchase Order',
  SubmitPurchaseOrderSuccess = '[PurchaseOrder] Submit Purchase Order Success',
  SelectPurchaseOrder = '[PurchaseOrder] Select Purchase Order',
  GetAllVendors = '[PurchaseOrder] Get All Vendors',
  GetAllVendorsSuccess = '[PurchaseOrder] Get All Vendors Success',
  GetCurrencies = '[PurchaseOrder] Get All Currencies',
  GetCurrenciesSuccess = '[PurchaseOrder] Get All Currencies Success',
  GetUsersManager = '[PurchaseOrder] Get All Users Manager',
  GetUserManagerSuccess = '[PurchaseOrder] Get All Users Manager Success',
  PurchaseOrderType = '[PurchaseOrder] Purchase Order Type',
  ResetPurchaseOrder = '[PurchaseOrder] Reset Purchase Order',
  ConfirmInvoiceInfo = '[PurchaseOrder] Confirm Invoice Info'
  }

export class GetPurchaseOrders implements Action {
  readonly type = PurchaseOrderActionTypes.GetPurchaseOrders;
  constructor(public payload: PagingFilterCriteria, public purchaseOrder: GetPurchaseOrderModel ) { }
}

export class GetPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.GetPurchaseOrder;
  constructor(public payload: string) { }
}

export class GetPurchaseOrdersSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.GetPurchaseOrdersSuccess;
  constructor(public payload: PagedResult<PurchaseOrderModel>) { }
}

export class GetPurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.GetPurchaseOrderSuccess;
  constructor(public payload: PurchaseOrderModel) { }
}

export class GetPurchaseOrdersFail implements Action {
  readonly type = PurchaseOrderActionTypes.GetPurchaseOrdersFail;
  constructor(public payload: null) { }
}

export class AddPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.AddPurchaseOrder;
  constructor(public payload: RequestPurchaseOrderModel, public purchaseOrderType: string) { }
}

export class AddPurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.AddPurchaseOrderSuccess;
  constructor(public payload: PurchaseOrderModel) { }
}

export class AddPurchaseOrderFail implements Action {
  readonly type = PurchaseOrderActionTypes.AddPurchaseOrderFail;
  constructor(public payload: string) { }
}

export class UpdatePurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.UpdatePurchaseOrder;
  constructor(public payload: UpdatePurchaseOrderModel,  public purchaseOrderType: string) { }
}

export class UpdatePurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.UpdatePurchaseOrderSuccess;
  constructor(public payload: PurchaseOrderModel) { }
}

export class UpdatePurchaseOrderFail implements Action {
  readonly type = PurchaseOrderActionTypes.UpdatePurchaseOrderFail;
  constructor(public payload: string) { }
}

export class UpdatePurchaseOrderDate implements Action {
  readonly type = PurchaseOrderActionTypes.UpdatePurchaseOrderDate;
  constructor(public payload: UpdatePurchaseOrderDateModel, public purchaseOrderType: string) { }
}

export class UpdatePurchaseOrderDateSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.UpdatePurchaseOrderDateSuccess;
  constructor(public payload: UpdatePurchaseOrderDateModel) { }
}

export class UpdatePurchaseOrderDateFail implements Action {
  readonly type = PurchaseOrderActionTypes.UpdatePurchaseOrderDateFail;
  constructor(public payload: string) { }
}

export class DeletePurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.DeletePurchaseOrder;
  constructor(public payload: string, public purchaseOrderType: string) { }
}

export class DeletePurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.DeletePurchaseOrderSuccess;
  constructor(public payload: string) { }
}

export class DeletePurchaseOrderFail implements Action {
  readonly type = PurchaseOrderActionTypes.DeletePurchaseOrderFail;
  constructor(public payload: string) { }
}

export class SelectPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.SelectPurchaseOrder;
  constructor(public payload: string) { }
}

export class ConvertPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.ConvertPurchaseOrder;
  constructor(public payload: string, public purchaseOrderType: string) { }
}

export class ConvertPurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.ConvertPurchaseOrderSuccess;
  constructor(public payload: PurchaseOrderModel) { }
}

export class ConvertPurchaseOrderFail implements Action {
  readonly type = PurchaseOrderActionTypes.ConvertPurchaseOrderFail;
  constructor(public payload: string) { }
}

export class ByPassPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.ByPassPurchaseOrder;
  constructor(public payload: string, public purchaseOrderType: string) { }
}

export class ByPassPurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.ByPassPurchaseOrderSuccess;
  constructor(public payload: PurchaseOrderModel) { }
}

export class ByPassPurchaseOrderFail implements Action {
  readonly type = PurchaseOrderActionTypes.ByPassPurchaseOrderFail;
  constructor(public payload: string) { }
}

export class SubmitPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.SubmitPurchaseOrder;
  constructor(public payload: SubmitPurchaseOrderModel, public purchaseOrderType: string) { }
}

export class SubmitPurchaseOrderSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.SubmitPurchaseOrderSuccess;
  constructor(public payload: string) { }
}

export class SubmitPurchaseOrderFail implements Action {
  readonly type = PurchaseOrderActionTypes.SubmitPurchaseOrderFail;
  constructor(public payload: string) { }
}

export class GetAllVendors implements Action {
  readonly type = PurchaseOrderActionTypes.GetAllVendors;
  constructor() { }
}

export class GetAllVendorsSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.GetAllVendorsSuccess;
  constructor(public payload: Array<VendorModel>) { }
}

export class GetUsersManager implements Action {
  readonly type = PurchaseOrderActionTypes.GetUsersManager;
  constructor(public payload: string[]) { }
}

export class GetUsersManagerSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.GetUserManagerSuccess;
  constructor(public payload: Array<UserManagerModel>) { }
}

export class GetCurrencies implements Action {
  readonly type = PurchaseOrderActionTypes.GetCurrencies;
  constructor() { }
}

export class GetCurrenciesSuccess implements Action {
  readonly type = PurchaseOrderActionTypes.GetCurrenciesSuccess;
  constructor(public payload: Array<CurrencyModel>) { }
}

export class PurchaseOrderType implements Action {
  readonly type = PurchaseOrderActionTypes.PurchaseOrderType;
  constructor(public payload: string) { }
}

export class ResetPurchaseOrder implements Action {
  readonly type = PurchaseOrderActionTypes.ResetPurchaseOrder;
  constructor() { }
}

export class ConfirmInvoiceInfo implements Action {
  readonly type = PurchaseOrderActionTypes.ConfirmInvoiceInfo;
  constructor(public payload: InvoiceInfo) { }
}

export type PurchaseOrderActions =
  GetPurchaseOrders
  | GetPurchaseOrder
  | GetPurchaseOrdersSuccess
  | GetPurchaseOrderSuccess
  | GetPurchaseOrdersFail
  | AddPurchaseOrder
  | AddPurchaseOrderSuccess
  | AddPurchaseOrderFail
  | UpdatePurchaseOrder
  | UpdatePurchaseOrderSuccess
  | UpdatePurchaseOrderFail
  | UpdatePurchaseOrderDate
  | UpdatePurchaseOrderDateSuccess
  | UpdatePurchaseOrderDateFail
  | DeletePurchaseOrder
  | DeletePurchaseOrderSuccess
  | DeletePurchaseOrderFail
  | ConvertPurchaseOrder
  | ConvertPurchaseOrderSuccess
  | ConvertPurchaseOrderFail
  | ByPassPurchaseOrder
  | ByPassPurchaseOrderSuccess
  | ByPassPurchaseOrderFail
  | SubmitPurchaseOrder
  | SubmitPurchaseOrderSuccess
  | SubmitPurchaseOrderFail
  | SelectPurchaseOrder
  | GetAllVendors
  | GetAllVendorsSuccess
  | GetCurrencies
  | GetCurrenciesSuccess
  | GetUsersManager
  | GetUsersManagerSuccess
  | PurchaseOrderType
  | ResetPurchaseOrder
  | ConfirmInvoiceInfo;
