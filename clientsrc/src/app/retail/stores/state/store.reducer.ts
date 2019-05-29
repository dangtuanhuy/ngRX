import * as fromRoot from 'src/app/shared/state/app.state';
import { StoreModel } from '../stores.component';
import { StoreActions, StoreActionTypes } from './store.action';

export interface State extends fromRoot.State {
    stores: StoreState;
}

export interface StoreState {
    stores: StoreModel[];
    store: StoreModel;
}

const initialState: StoreState = {
    stores: [],
    store: null,
};

export const key = 'stores_reducer';

export function reducer(state = initialState, action: StoreActions): StoreState {
    switch (action.type) {
        case StoreActionTypes.GetStoresSuccess:
            return {
                ...state,
                stores: action.payload.data
            };
        case StoreActionTypes.GetStoreSuccess:
            return {
                ...state,
                store: action.payload
            };
        case StoreActionTypes.UpdateStoreSuccess:
            const updatedStores = state.stores.map(
                item => action.payload.id === item.id ? action.payload : item);
            return {
                ...state,
                stores: updatedStores
            };
        default:
            return state;
    }
}
