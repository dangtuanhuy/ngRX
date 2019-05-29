import * as fromRoot from 'src/app/shared/state/app.state';
import { InventoryTransactionGoodsReturnViewModel, ReturnOrderListModel, ReturnOrderModel } from '../goods-return.model';
import { GoodsReturnActions, GoodsReturnActionTypes } from './goods-return.action';
export interface State extends fromRoot.State {
    goodsReturns: GoodsReturnState;
}

export interface GoodsReturnState {
    inventoryTransactionGoodsReturns: InventoryTransactionGoodsReturnViewModel[];
    returnOrdersViewModel: ReturnOrderListModel[];
    returnOrders: ReturnOrderModel[];
}

const initialState: GoodsReturnState = {
    inventoryTransactionGoodsReturns: [],
    returnOrdersViewModel: [],
    returnOrders: []
};

export const key = 'goodsReturns_reducer';

export function reducer(
    state = initialState,
    action: GoodsReturnActions
): GoodsReturnState {
    switch (action.type) {
        case GoodsReturnActionTypes.GetGoodsReturnsSuccess:
            return {
                ...state,
                inventoryTransactionGoodsReturns: action.payload.data
            };
        case GoodsReturnActionTypes.GetReturnOrdersByVendorSuccess:
            return {
                ...state,
                returnOrdersViewModel: action.payload
            };
        case GoodsReturnActionTypes.GetReturnOrdersByIdsSuccess:
            return {
                ...state,
                returnOrders: action.payload
            };
        case GoodsReturnActionTypes.ResetState:
            return {
                ...state,
                inventoryTransactionGoodsReturns: [],
                returnOrders: [],
                returnOrdersViewModel: []
            };
        default:
            return state;
    }
}
