import * as fromRoot from 'src/app/shared/state/app.state';
import {
    PimPurchaseOrderListModel,
    PimPurchaseOrderModel
} from 'src/app/purchaseorder/purchase-orders/purchase-order.model';
import {
    GoodsInwardActionTypes,
    GoodsInwardActions
} from './goods-inward.action';
import { InventoryTransactionGoodsInwardViewModel } from '../goods-inward.model';
import { InventoryTransactionStatusEnum } from 'src/app/shared/constant/inventory-transaction.constant';

export interface State extends fromRoot.State {
    goodsInwards: GoodsInwardState;
}

export interface GoodsInwardState {
    purchaseOrdersViewModel: PimPurchaseOrderListModel[];
    purchaseOrders: PimPurchaseOrderModel[];
    inventoryTransactionGoodsInwards: InventoryTransactionGoodsInwardViewModel[];
    inventoryTransactionGoodsInward: InventoryTransactionGoodsInwardViewModel;
}

const initialState: GoodsInwardState = {
    purchaseOrdersViewModel: [],
    purchaseOrders: [],
    inventoryTransactionGoodsInwards: [],
    inventoryTransactionGoodsInward: null
};

export const key = 'goodsInwards_reducer';

export function reducer(
    state = initialState,
    action: GoodsInwardActions
): GoodsInwardState {
    switch (action.type) {
        case GoodsInwardActionTypes.GetPurchaseOrdersByVendorSuccess:
            return {
                ...state,
                purchaseOrdersViewModel: action.payload
            };
        case GoodsInwardActionTypes.GetPurchaseOrdersByIdsSuccess:
            return {
                ...state,
                purchaseOrders: action.payload
            };
        case GoodsInwardActionTypes.ResetAllocationState:
            return {
                ...state,
                purchaseOrders: [],
                purchaseOrdersViewModel: []
            };
        case GoodsInwardActionTypes.GetGoodsInwardsSuccess:
            return {
                ...state,
                inventoryTransactionGoodsInwards: action.payload.data
            };
        case GoodsInwardActionTypes.UpdateGoodsInwardSuccess:
            const inventoryTransaction = state.inventoryTransactionGoodsInwards.find(x => x.id === action.payload.id);
            if (inventoryTransaction) {
                inventoryTransaction.status = action.payload.status === InventoryTransactionStatusEnum.Partial ? 'Partial' : 'Allocated';
            }
            const updatedinventoryTransaction = state.inventoryTransactionGoodsInwards.map(
                item => action.payload.id === item.id ? inventoryTransaction : item);
            return {
                ...state,
                inventoryTransactionGoodsInwards: updatedinventoryTransaction
            };
        case GoodsInwardActionTypes.GetGoodsInward:
            const inventoryTransactionGoodsInward = state.inventoryTransactionGoodsInwards.find(x => x.id === action.payload);
            return {
                ...state,
                inventoryTransactionGoodsInward: inventoryTransactionGoodsInward
            };
        case GoodsInwardActionTypes.GetGIWByInventoryTransactionIdSuccess:
            return {
                ...state,
                inventoryTransactionGoodsInward: action.payload
            };
        default:
            return state;
    }
}
