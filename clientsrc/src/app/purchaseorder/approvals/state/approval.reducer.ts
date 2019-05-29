import * as fromRoot from 'src/app/shared/state/app.state';
import { ApprovalModel } from '../approval.model';
import { ApprovalActions, ApprovalActionTypes } from './approval.action';
import { PurchaseOrderModel } from '../../purchase-orders/purchase-order.model';

export interface State extends fromRoot.State {
    approvals: ApprovalState;
}

export interface ApprovalState {
    approvals: ApprovalModel[];
    purchaseOrder: PurchaseOrderModel;
}

const initialState: ApprovalState = {
    approvals: [],
    purchaseOrder: null,
};

export const key = 'approvals_reducer';

export function reducer(state = initialState, action: ApprovalActions): ApprovalState {
    switch (action.type) {
        case ApprovalActionTypes.GetApprovalsSuccess:
            return {
                ...state,
                approvals: action.payload.data
            };

        case ApprovalActionTypes.GetPurchaseOrderSuccess:
            return {
                ...state,
                purchaseOrder: action.payload
            };
        case ApprovalActionTypes.ApprovePOSuccess:
            const updatedApprovals = state.approvals.map(item =>
                action.payload.purchaseOrderId === item.purchaseOrderId ? action.payload : item
            );
            return {
                ...state,
                approvals: updatedApprovals
            };
        case ApprovalActionTypes.RejectPOSuccess:
            const approvals = state.approvals.map(item =>
                action.payload.purchaseOrderId === item.purchaseOrderId ? action.payload : item
            );
            return {
                ...state,
                approvals: approvals
            };
        case ApprovalActionTypes.ConfirmPOSuccess:
            const Approvals = state.approvals.map(item =>
                action.payload.purchaseOrderId === item.purchaseOrderId ? action.payload : item
            );
            return {
                ...state,
                approvals: Approvals
            };
        case ApprovalActionTypes.ApprovePOFail:
            return {
                ...state
            };
        default:
            return state;
    }
}
