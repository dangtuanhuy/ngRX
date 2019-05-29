import * as fromRoot from 'src/app/shared/state/app.state';
import { SaleModel } from 'src/app/pos/shared/models/sale.model';
import { PendingSaleActions, PendingSaleActionTypes } from './pending-sales.action';
import { PendingSaleModel } from 'src/app/pos/shared/models/pending-sale';

export interface State extends fromRoot.State {
    pendingSales: PendingSalesState;
}

export interface PendingSalesState {
    pageIndex: number;
    pageSize: number;
    totalItem: number;
    sales: PendingSaleModel[];
    sale: PendingSaleModel;
}

const initialState: PendingSalesState = {
    pageIndex: 0,
    pageSize: 10,
    totalItem: 0,
    sales: [],
    sale: null
};

export function reducer(state = initialState, action: PendingSaleActions): PendingSalesState {
    switch (action.type) {
        case PendingSaleActionTypes.GetPendingSalesSuccess: {
            return {
                ...state,
                pageIndex: action.payload.pageNumber,
                pageSize: action.payload.pageSize,
                totalItem: action.payload.totalItem,
                sales: action.payload.pendingSales
            };
        }
        case PendingSaleActionTypes.GetPendingSaleSuccess: {
            return {
                ...state,
                sale: action.payload
            };
        }
        case PendingSaleActionTypes.DeletePendingSaleSuccess: {
            return {
                ...state,
                sales: state.sales.filter(
                    sale => sale.id !== action.payload
                )
            };
        }
        default:
            return state;
    }
}
