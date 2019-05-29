import * as fromRoot from 'src/app/shared/state/app.state';
import { PurchaseOrderActions, PurchaseOrderActionTypes } from './purchase-order.action';
import { PurchaseOrderModel, CurrencyModel, UserManagerModel, InvoiceInfo } from '../purchase-order.model';
import { VendorModel } from '../../vendors/vendor.model';
import { PurchaseOrderTypeEnum, PurchaseOrderStatusEnum } from 'src/app/shared/constant/purchase-order.constant';
import { ApprovalStatusEnum } from 'src/app/shared/constant/approval.constant';

export interface State extends fromRoot.State {
    purchaseOders: PurchaseOrderState;
}

export interface PurchaseOrderState {
    purchaseOrders: PurchaseOrderModel[];
    purchaseOrder: PurchaseOrderModel;
    purchaseOrderType: string;
    vendors: VendorModel[];
    currencies: CurrencyModel[];
    usersManager: UserManagerModel[];
    invoiceInfo: InvoiceInfo;
}

const initialState: PurchaseOrderState = {
    purchaseOrders: [],
    purchaseOrder: null,
    purchaseOrderType: null,
    vendors: [],
    currencies: [],
    usersManager: [],
    invoiceInfo: null
};

export const key = 'purchase_orders_reducer';

export function reducer(
    state = initialState,
    action: PurchaseOrderActions
): PurchaseOrderState {
    switch (action.type) {
        case PurchaseOrderActionTypes.GetPurchaseOrdersSuccess:
            return {
                ...state,
                purchaseOrders: action.payload.data
            };
        case PurchaseOrderActionTypes.GetPurchaseOrderSuccess:
            return {
                ...state,
                purchaseOrder: action.payload
            };
        case PurchaseOrderActionTypes.PurchaseOrderType:
            return {
                ...state,
                purchaseOrderType: action.payload
            };
        case PurchaseOrderActionTypes.AddPurchaseOrderSuccess:
            return {
                ...state,
                purchaseOrders: [...state.purchaseOrders, action.payload]
            };
        case PurchaseOrderActionTypes.AddPurchaseOrderFail: {
            return {
                ...state
            };
        }
        case PurchaseOrderActionTypes.UpdatePurchaseOrderSuccess: {
            const updatedPurchaseOrders = state.purchaseOrders.map(item =>
                action.payload.id === item.id ? action.payload : item
            );
            return {
                ...state,
                purchaseOrders: updatedPurchaseOrders,
                purchaseOrder: null
            };
        }

        case PurchaseOrderActionTypes.UpdatePurchaseOrderDateSuccess: {
            const purchaseOrderDate = state.purchaseOrders.find(item => item.id === action.payload.id);
            purchaseOrderDate.date = action.payload.date;
            const updatedPurchaseOrders = state.purchaseOrders.map(item =>
                action.payload.id === item.id ? purchaseOrderDate : item
            );
            return {
                ...state,
                purchaseOrders: updatedPurchaseOrders,
                purchaseOrder: null
            };
        }
        case PurchaseOrderActionTypes.ConvertPurchaseOrderSuccess: {
            const convertPurchaseOrders = state.purchaseOrders.find(purchaseOrder => purchaseOrder.id === action.payload.id);
            convertPurchaseOrders.type = action.payload.type;
            convertPurchaseOrders.status = action.payload.status;
            convertPurchaseOrders.poNumber = action.payload.poNumber;
            const updatedPurchaseOrders = state.purchaseOrders.map(item =>
                action.payload.id === item.id ? convertPurchaseOrders : item
            );
            return {
                ...state,
                purchaseOrders: updatedPurchaseOrders,
                purchaseOrder: null
            };
        }
        case PurchaseOrderActionTypes.ByPassPurchaseOrderSuccess: {
            const bypassPurchaseOrders = state.purchaseOrders.find(purchaseOrder => purchaseOrder.id === action.payload.id);
            bypassPurchaseOrders.type = action.payload.type;
            bypassPurchaseOrders.status = action.payload.status;
            bypassPurchaseOrders.poNumber = action.payload.poNumber;
            bypassPurchaseOrders.approvalStatus = action.payload.approvalStatus;
            const updatedPurchaseOrders = state.purchaseOrders.map(item =>
                action.payload.id === item.id ? bypassPurchaseOrders : item
            );
            return {
                ...state,
                purchaseOrders: updatedPurchaseOrders,
                purchaseOrder: null
            };
        }
        case PurchaseOrderActionTypes.SubmitPurchaseOrderSuccess: {
            const submitPurchaseOrders = state.purchaseOrders.find(purchaseOrder => purchaseOrder.id === action.payload);
            submitPurchaseOrders.status = PurchaseOrderStatusEnum.pending;
            submitPurchaseOrders.approvalStatus = ApprovalStatusEnum.pending;
            const updatedPurchaseOrders = state.purchaseOrders.map(item =>
                action.payload === item.id ? submitPurchaseOrders : item
            );
            return {
                ...state,
                purchaseOrders: updatedPurchaseOrders,
                purchaseOrder: null
            };
        }
        case PurchaseOrderActionTypes.UpdatePurchaseOrderFail: {
            return {
                ...state
            };
        }
        case PurchaseOrderActionTypes.DeletePurchaseOrderSuccess:
            return {
                ...state,
                purchaseOrders: state.purchaseOrders.filter(
                    purchaseOrder => purchaseOrder.id !== action.payload
                ),
                purchaseOrder: null
            };
        case PurchaseOrderActionTypes.SelectPurchaseOrder:
            return {
                ...state,
                purchaseOrder: state.purchaseOrders.find(
                    purchaseOrder => purchaseOrder.id === action.payload
                )
            };
        case PurchaseOrderActionTypes.DeletePurchaseOrderFail:
            return {
                ...state
            };
        case PurchaseOrderActionTypes.GetAllVendorsSuccess:
            return {
                ...state,
                vendors: action.payload
            };
        case PurchaseOrderActionTypes.GetCurrenciesSuccess:
            return {
                ...state,
                currencies: action.payload
            };
        case PurchaseOrderActionTypes.GetUserManagerSuccess:
            return {
                ...state,
                usersManager: action.payload
            };
        case PurchaseOrderActionTypes.ResetPurchaseOrder:
            return {
                ...state,
                purchaseOrder: null
            };
        case PurchaseOrderActionTypes.ConfirmInvoiceInfo: {
            return {
                ...state,
                invoiceInfo: Object.create(action.payload)
            };
        }
        default:
            return state;
    }
}
