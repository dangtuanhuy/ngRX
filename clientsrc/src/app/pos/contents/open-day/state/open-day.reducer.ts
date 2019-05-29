
import * as fromRoot from 'src/app/shared/state/app.state';
import { OpenDayActions, OpenDayActionTypes } from './open-day.action';
import { AppSettingModel } from 'src/app/shared/base-model/appsetting.model';
import { DenominationViewModel } from 'src/app/pos/shared/models/denomination-view.model';

export interface State extends fromRoot.State {
    openday: OpenDayState;
}

export interface OpenDayState {
    appSettingDenominations: AppSettingModel[];
    denominations: DenominationViewModel[];
}

const initialState: OpenDayState = {
    appSettingDenominations: [
        { id: '$100', key: '$100', value: '100' },
        { id: '$50', key: '$50', value: '50' },
        { id: '$20', key: '$20', value: '20' },
        { id: '$10', key: '$10', value: '10' },
        { id: '$5', key: '$5', value: '5' },
        { id: '$1', key: '$1', value: '1' },
        { id: '$0.50', key: '$0.50', value: '0.5' },
        { id: '$0.10', key: '$0.10', value: '0.1' },
        { id: '$0.05', key: '$0.05', value: '0.05' },
        { id: '$0.01', key: '$0.01', value: '0.01' }
    ],
    denominations: []
};

export function reducer(state = initialState, action: OpenDayActions): OpenDayState {
    switch (action.type) {
        case OpenDayActionTypes.LoadDenominations: {
            const denominations = state.appSettingDenominations.map(x => new DenominationViewModel({
                id: x.id,
                name: x.key,
                value: parseFloat(x.value),
                quantity: null
            }));

            return {
                ...state,
                denominations: denominations
            };
        }
        case OpenDayActionTypes.ChangeDenomination: {
            return AddDenomination(state, action.payload);
        }
        default:
            return state;
    }
}

function AddDenomination(state: OpenDayState, payload: any) {
    const updatedDenomination = state.denominations.find(x => x.id === payload.id);
    if (updatedDenomination) {
        updatedDenomination.quantity = payload.value;
    }

    return {
        ...state,
        denominations: [...state.denominations]
    };
}
