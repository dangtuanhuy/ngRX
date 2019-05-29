import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { Action } from '@ngrx/store';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { ApprovalModel, GetApprovalRequestModel, SubmitPurchaseOrderModel, RejectPurchaseOrderModel } from '../approval.model';
import { PurchaseOrderModel } from '../../purchase-orders/purchase-order.model';


export enum ApprovalActionTypes {
    GetApprovals = '[Approval] Get Approvals',
    GetApprovalsSuccess = '[Approval] Get Approvals Success',
    GetApproval = '[PurchaseOrder] Get Purchase Order',
    GetApprovalSuccess = '[PurchaseOrder] Get Purchase Order Success',
    ApprovePO = '[Approval] Approve Purchase Order',
    ApprovePOSuccess = '[Approval] Approve Purchase Order Success',
    ApprovePOFail = '[Approval] Approve Purchase Order Fail',
    RejectPO = '[Approval] Reject Purchase Order',
    RejectPOSuccess = '[Approval] Reject Purchase Order Success',
    RejectPOFail = '[Approval] Reject Purchase Order Fail',
    ConfirmPO = '[Approval] Confirm Purchase Order',
    ConfirmPOSuccess = '[Approval] Confirm Purchase Order Success',
    ConfirmPOFail = '[Approval] Confirm Purchase Order Fail',
    GetPurchaseOrder = '[Approval] Get Purchase Order',
    GetPurchaseOrderSuccess = '[Approval] Get Purchase Order Success'
}

export class GetApprovals implements Action {
    readonly type = ApprovalActionTypes.GetApprovals;
    constructor(public payload: GetApprovalRequestModel, public queryText: string) { }
}

export class GetApprovalsSuccess implements Action {
    readonly type = ApprovalActionTypes.GetApprovalsSuccess;
    constructor(public payload: PagedResult<ApprovalModel>) { }
}

export class GetApproval implements Action {
    readonly type = ApprovalActionTypes.GetApproval;
    constructor(public payload: string) { }
}

export class ApprovePurchaseOrder implements Action {
    readonly type = ApprovalActionTypes.ApprovePO;
    constructor(public payload: SubmitPurchaseOrderModel) { }
}

export class ApprovePurchaseOrderSuccess implements Action {
    readonly type = ApprovalActionTypes.ApprovePOSuccess;
    constructor(public payload: ApprovalModel) { }
}

export class ApprovePurchaseOrderFail implements Action {
    readonly type = ApprovalActionTypes.ApprovePOFail;
    constructor(public payload: string) { }
}

export class RejectPurchaseOrder implements Action {
    readonly type = ApprovalActionTypes.RejectPO;
    constructor(public payload: RejectPurchaseOrderModel) { }
}

export class RejectPurchaseOrderSuccess implements Action {
    readonly type = ApprovalActionTypes.RejectPOSuccess;
    constructor(public payload: ApprovalModel) { }
}

export class RejectPurchaseOrderFail implements Action {
    readonly type = ApprovalActionTypes.RejectPOFail;
    constructor(public payload: string) { }
}

export class ConfirmPurchaseOrder implements Action {
    readonly type = ApprovalActionTypes.ConfirmPO;
    constructor(public payload: SubmitPurchaseOrderModel) { }
}

export class ConfirmPurchaseOrderSuccess implements Action {
    readonly type = ApprovalActionTypes.ConfirmPOSuccess;
    constructor(public payload: ApprovalModel) { }
}

export class ConfirmPurchaseOrderFail implements Action {
    readonly type = ApprovalActionTypes.ConfirmPOFail;
    constructor(public payload: string) { }
}

export class GetPurchaseOrder implements Action {
    readonly type = ApprovalActionTypes.GetPurchaseOrder;
    constructor(public payload: string) { }
}

export class GetPurchaseOrderSuccess implements Action {
    readonly type = ApprovalActionTypes.GetPurchaseOrderSuccess;
    constructor(public payload: PurchaseOrderModel) { }
}


export type ApprovalActions = GetApprovals
| GetApprovalsSuccess
| GetApproval
| ApprovePurchaseOrder
| ApprovePurchaseOrderSuccess
| ApprovePurchaseOrderFail
| RejectPurchaseOrder
| RejectPurchaseOrderSuccess
| RejectPurchaseOrderFail
| ConfirmPurchaseOrder
| ConfirmPurchaseOrderSuccess
| ConfirmPurchaseOrderFail
| GetPurchaseOrder
| GetPurchaseOrderSuccess;
