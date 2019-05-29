import { LocationModel } from '../../locations/location.model';
import {
    StockInitialActions,
    StockInitialActionTypes
} from './stock-initial.actions';
import * as fromRoot from 'src/app/shared/state/app.state';

export interface State extends fromRoot.State {
    stockInitial: StockInitialState;
}

export interface StockInitialState {
    locations: LocationModel[];
}

const initialState: StockInitialState = {
    locations: []
};

export const key = 'stock-initial_reducer';

export function reducer(
    state = initialState,
    action: StockInitialActions
): StockInitialState {
    switch (action.type) {
        case StockInitialActionTypes.GetLocationsSuccess:
            return {
                ...state,
                locations: action.payload
            };
        default:
            return state;
    }
}
