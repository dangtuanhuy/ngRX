import * as fromRoot from 'src/app/shared/state/app.state';
import { RecentSaleActions, RecentSaleActionTypes } from './recent-sales.action';
import { OrderModel } from 'src/app/pos/shared/models/order';

export interface State extends fromRoot.State {
    recentSales: RecentSalesState;
}

export interface RecentSalesState {
    pageIndex: number;
    pageSize: number;
    totalItem: number;
    sales: OrderModel[];
    sale: OrderModel;
}

const initialState: RecentSalesState = {
    pageIndex: 0,
    pageSize: 10,
    totalItem: 0,
    sales: [],
    sale: null
};

export function reducer(state = initialState, action: RecentSaleActions): RecentSalesState {
    switch (action.type) {
        case RecentSaleActionTypes.GetRecentSalesSuccess: {

            return {
                ...state,
                pageIndex: action.payload.pageNumber,
                pageSize: action.payload.pageSize,
                totalItem: action.payload.totalItem,
                sales: action.payload.recentOrders
            };
        }
        case RecentSaleActionTypes.GetRecentSaleSuccess: {
            return {
                ...state,
                sale: action.payload
            };
        }
        default:
            return state;
    }
}
