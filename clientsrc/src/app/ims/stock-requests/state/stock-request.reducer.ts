import { StockRequestListModel, StockRequestModel, StockTypeViewModel } from '../stock-request.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import { StockRequestActions, StockRequestActionTypes } from './stock-request.action';
import { ProductListModel, ProductModel } from '../../products/product';
import { LocationModel } from '../../locations/location.model';

export const key = 'stockrequests_reducer';

export interface StockRequestState {
    stockRequests: StockRequestListModel[];
    stockRequest: StockRequestModel;
    products: ProductListModel[];
    product: ProductModel;
    stockTypes: StockTypeViewModel[];
    locations: LocationModel[];
}

const initialState: StockRequestState = {
    stockRequests: [],
    stockRequest: null,
    products: [],
    product: {
        id: Guid.empty(),
        name: null,
        description: null,
        variants: [],
        sections: []
    },
    locations: [],
    stockTypes: []
};

export function reducer(
    state = initialState,
    action: StockRequestActions
): StockRequestState {
    switch (action.type) {
        case StockRequestActionTypes.GetStockRequestsSuccess:
            return {
                ...state,
                stockRequests: action.payload.data
            };
        case StockRequestActionTypes.GetStockRequestSuccess:
            return {
                ...state,
                stockRequest: action.payload
            };
        case StockRequestActionTypes.AddStockRequestSuccess:
            {
                return {
                    ...state,
                    stockRequests: [...state.stockRequests, action.payload]
                };
            }
        case StockRequestActionTypes.GetProductsWithoutPagingSuccess:
            return {
                ...state,
                products: action.payload
            };
        case StockRequestActionTypes.GetProductByIdSuccess:
            return {
                ...state,
                product: action.payload
            };
        case StockRequestActionTypes.GetLocationsByTypeSuccess:
            return {
                ...state,
                locations: action.payload
            };
        case StockRequestActionTypes.GetStockTypesSuccess:
            return {
                ...state,
                stockTypes: action.payload
            };
        case StockRequestActionTypes.EditStockRequestSuccess:

            const updatedStockRequests = state.stockRequests.map(item =>
                action.payload.id === item.id ? action.payload : item
            );
            return {
                ...state,
                stockRequests: updatedStockRequests,
                stockRequest: null
            };
        case StockRequestActionTypes.CancelUpdateSuccess:
            return {
                ...state,
                stockRequest: null
            };
        default:
            return state;
    }
}
