import * as fromRoot from 'src/app/shared/state/app.state';
import { SaleTargetActions, SaleTargetActionTypes } from './sale-target.action';
import { StoreSaleTargetModel, SaleTargetModel, ReportSaleTargetModel } from '../sale-target.model';

export interface State extends fromRoot.State {
    stores: SaleTargetState;
}

export interface SaleTargetState {
    selectedPage: number;
    totalItems: number;
    state: boolean;
    stores: StoreSaleTargetModel[];
    reports: ReportSaleTargetModel[];
}

const initialState: SaleTargetState = {
    selectedPage: null,
    totalItems: null,
    state: false,
    stores: [],
    reports: [],
};

export const key = 'sale_target_reducer';

export function reducer(state = initialState, action: SaleTargetActions): SaleTargetState {
    switch (action.type) {
        case SaleTargetActionTypes.GetStoresSuccess:
            return {
                ...state,
                stores: action.payload.data
            };
        case SaleTargetActionTypes.AddSaleTargetSuccess:
            const newState = state.stores;
            newState.forEach(item => {
                if (item.id === action.payload.storeId) {
                    item.saleTargets.push(new SaleTargetModel(action.payload));
                }
            });

            return {
                ...state,
                stores: newState
            };
        case SaleTargetActionTypes.UpdateSaleTargetSuccess:
            state.stores.forEach(item => {
                if (item.id === action.payload.storeId) {

                    item.saleTargets.forEach(saleTarget => {
                        if (saleTarget.id === action.payload.id) {
                            saleTarget.target = action.payload.target;
                        }
                    });
                }
            });

            return {
                ...state,
                stores: state.stores
            };
        case SaleTargetActionTypes.DeleteSaleTargetSuccess:
            state.stores.forEach(item => {
                item.saleTargets = item.saleTargets.filter(x => x.id !== action.payload);
            });
            return {
                ...state,
                stores: state.stores
            };
        case SaleTargetActionTypes.GetReportSaleTargetSuccess:
            return {
                ...state,
                reports: action.payload
            };
        case SaleTargetActionTypes.ListPage:
            return {
                ...state,
                selectedPage: action.payload.currentPage,
                totalItems: action.payload.totalItems,
            };
        case SaleTargetActionTypes.ChangeState:
            return {
                ...state,
                state: action.payload
            };
        default:
            return state;
    }
}
