import * as fromRoot from 'src/app/shared/state/app.state';
import { BrandModel } from '../brand.model';
import { BrandActions, BrandActionTypes } from '../state/brand.action';

export interface State extends fromRoot.State {
    brands: BrandState;
}

export interface BrandState {
    brands: BrandModel[];
    brand: BrandModel;
}

const initialState: BrandState = {
    brands: [],
    brand: null
};

export const key = 'brands_reducer';

export function reducer(state = initialState, action: BrandActions): BrandState {
    switch (action.type) {
        case BrandActionTypes.GetBrandsSuccess:
            return {
                ...state,
                brands: action.payload.data
            };
        case BrandActionTypes.GetBrandSuccess:
            return {
                ...state,
                brand: action.payload
            };
        case BrandActionTypes.AddBrandSuccess:
            return {
                ...state,
                brands: [...state.brands, action.payload]
            };
        case BrandActionTypes.AddBrandFail: {
            return {
                ...state
            };
        }
        case BrandActionTypes.UpdateBrandSuccess:
            const updatedBrands = state.brands.map(item =>
                action.payload.id === item.id ? action.payload : item
            );
            return {
                ...state,
                brands: updatedBrands
            };
        case BrandActionTypes.UpdateBrandFail: {
            return {
                ...state
            };
        }
        case BrandActionTypes.DeleteBrandSuccess:
            return {
                ...state,
                brands: state.brands.filter(
                    brand => brand.id !== action.payload
                )
            };
        case BrandActionTypes.DeleteBrandFail:
            return {
                ...state
            };
        default:
            return state;
    }
}
