import { AssignmentActions, AssignmentActionTypes } from './entity-assignment.action';
import { AssignmentModel } from 'src/app/shared/base-model/assignment.model';

export interface AssignmentState {
    searchAssignments: Array<AssignmentModel>;
    selectAssignments: Array<AssignmentModel>;
}

const initialState: AssignmentState = {
    searchAssignments: [],
    selectAssignments: [],
};

export const key = 'assignment_reducer';

export function reducer(state = initialState, action: AssignmentActions): AssignmentState {
    switch (action.type) {
        case AssignmentActionTypes.SearchAssignment:
            return {
                ...state,
                searchAssignments: action.payload
            };
        case AssignmentActionTypes.SelectAssignment:
            return {
                ...state,
                selectAssignments: [...state.selectAssignments, action.payload]
            };
        case AssignmentActionTypes.GetSelectAssignmentSuccess:
            return {
                ...state,
                selectAssignments: action.payload
            };
        case AssignmentActionTypes.RemoveAssignment:
            return {
                ...state,
                selectAssignments: state.selectAssignments.filter(
                    assignment => assignment.name !== action.payload.name || assignment.type !== action.payload.type
                )
            };
        case AssignmentActionTypes.ResetAssignment:
            return {
                ...state,
                selectAssignments: [],
                searchAssignments: []
            };
        default:
            return state;
    }
}
