import { FieldValue } from "../field-value";
import { FieldActions, FieldActionTypes } from "./field-base.actions";

export interface FieldListState {
    fields: FieldValue<any>[]
}

const initialState: FieldListState = {
    fields: []
};

export function reducer(state = initialState, action: FieldActions): FieldListState {
    switch (action.type) {
        case FieldActionTypes.Load:
            return {
                ...state,
                fields: action.payload
            }
        default:
            return state;
    }
}