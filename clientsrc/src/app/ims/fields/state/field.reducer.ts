import * as fromRoot from 'src/app/shared/state/app.state';
import { FieldModel, EntityRefModel } from '../field.model';
import { FieldActions, FieldActionTypes } from './field.action';

export interface State extends fromRoot.State {
    fields: FieldState;
}

export interface FieldState {
    fields: FieldModel[];
    field: FieldModel;
    entityRefList: EntityRefModel[];

}

const initialState: FieldState = {
    fields: [],
    field: null,
    entityRefList: [],
};

export const key = 'fields_reducer';

export function reducer(state = initialState, action: FieldActions): FieldState {
    switch (action.type) {
        case FieldActionTypes.GetFieldsSuccess:
            return {
                ...state,
                fields: action.payload.data
            };
        case FieldActionTypes.GetFieldSuccess:
            return {
                ...state,
                field: action.payload
            };
        case FieldActionTypes.AddFieldSuccess:
            return {
                ...state,
                fields: [...state.fields, action.payload]
            };
        case FieldActionTypes.AddFieldFail: {
            return {
                ...state
            };
        }
        case FieldActionTypes.UpdateFieldSuccess:
            const updatedField = state.fields.map(
                item => action.payload.id === item.id ? action.payload : item);
            return {
                ...state,
                fields: updatedField
            };
        case FieldActionTypes.UpdateFieldFail: {
            return {
                ...state
            };
        }
        case FieldActionTypes.DeleteFieldSuccess:
            return {
                ...state,
                fields: state.fields.filter(field => field.id !== action.payload)
            };
        case FieldActionTypes.DeleteFieldFail: {
            return {
                ...state
            };
        }
        case FieldActionTypes.GetEntityRefListSuccess:
            return {
                ...state,
                entityRefList: action.payload
            };
        default:
            return state;
    }
}
