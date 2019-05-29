import * as fromRoot from 'src/app/shared/state/app.state';
import { User } from 'src/app/shared/base-model/user.model';
import { IndexModel } from '../search.model';
import { SearchActionTypes, SearchActions } from './search.action';

export interface State extends fromRoot.State {
    search: SearchState;
}

export interface SearchState {
    indexes: IndexModel[];
    index: IndexModel;
    users: User[];
}

const initialState: SearchState = {
    indexes: [],
    index: null,
    users: []
};

export const key = 'search_reducer';

export function reducer(
    state = initialState,
    action: SearchActions
): SearchState {
    switch (action.type) {
        case SearchActionTypes.GetIndexesSuccess:
            return {
                ...state,
                indexes: action.payload.data
            };
        case SearchActionTypes.RebuildIndexSuccess:
            return {
                ...state,
                // indexes: [...state.indexes, action.payload]
            };
        case SearchActionTypes.RebuildIndexFail: {
            return {
                ...state
            };
        }
        default:
            return state;
    }
}
