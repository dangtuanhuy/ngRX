import * as fromRoot from 'src/app/shared/state/app.state';
import { AssortmentModel } from '../../assortments/assortment.model';
import { AssortmentAssignmentActions, AssortmentActionTypes } from './assortment-assignment.action';

export interface State extends fromRoot.State {
    assortments: AssortmentAssignmentState;
}

export interface AssortmentAssignmentState {
    assortment: AssortmentModel;
}

export const key = 'assortments_assignment_reducer';

const initialState: AssortmentAssignmentState = {
    assortment: null
};

export function reducer(state = initialState, action: AssortmentAssignmentActions): AssortmentAssignmentState {
    switch (action.type) {
        case AssortmentActionTypes.GetAssortmentAssignmentSuccess:
            return {
                ...state,
                assortment: action.payload,
            };
        case AssortmentActionTypes.ResetAssortmentAssignment:
            return {
                ...state,
                assortment: null,
            };
        default:
            return state;
    }
}
