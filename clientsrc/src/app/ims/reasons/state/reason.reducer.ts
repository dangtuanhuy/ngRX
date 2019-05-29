import * as fromRoot from 'src/app/shared/state/app.state';
import { ReasonModel } from '../reason.model';
import { ReasonActions, ReasonActionTypes } from '../state/reason.action';

export interface State extends fromRoot.State {
    reasons: ReasonState;
}

export interface ReasonState {
    reasons: ReasonModel[];
    reason: ReasonModel;
}

const initialState: ReasonState = {
    reasons: [],
    reason: null
};

export const key = 'reasons_reducer';

export function reducer(state = initialState, action: ReasonActions): ReasonState {
    switch (action.type) {
        case ReasonActionTypes.GetReasonsSuccess:
            return {
                ...state,
                reasons: action.payload.data
            };
        case ReasonActionTypes.GetReasonSuccess:
            return {
                ...state,
                reason: action.payload
            };
        case ReasonActionTypes.AddReasonSuccess:
            return {
                ...state,
                reasons: [...state.reasons, action.payload]
            };
        case ReasonActionTypes.AddReasonFail: {
            return {
                ...state
            };
        }
        case ReasonActionTypes.UpdateReasonSuccess:
            const updatedReasons = state.reasons.map(item =>
                action.payload.id === item.id ? action.payload : item
            );
            return {
                ...state,
                reasons: updatedReasons
            };
        case ReasonActionTypes.UpdateReasonFail: {
            return {
                ...state
            };
        }
        case ReasonActionTypes.DeleteReasonSuccess:
            return {
                ...state,
                reasons: state.reasons.filter(
                    reason => reason.id !== action.payload
                )
            };
        case ReasonActionTypes.DeleteReasonFail:
            return {
                ...state
            };
        default:
            return state;
    }
}
