import { FieldValue } from '../../fields/field-base/field-value';
import { FieldModel } from '../../fields/field.model';
import { FormState } from 'src/app/shared/base-model/form.state';
import { Action } from 'src/app/shared/constant/form-action.constant';
import { FieldTemplateModel } from '../field-template.model';
import { FieldTemplateActions, FieldTemplateActionTypes } from './field-template.action';

export interface FieldTemplateState {
    selectedPage: number;
    totalItems: number;
    selectedItem: string;
    formState: FormState;
    id: string;
    fieldvalues: FieldValue<any>[];
    fieldTemplates: FieldTemplateModel[];
    selectedId: string;
    fields: FieldModel[];
    fieldTemplateTypes: Array<string>;
}

const initialState: FieldTemplateState = {
    selectedPage: 0,
    totalItems: 0,
    selectedItem: null,
    formState: new FormState(Action.None, null),
    id: null,
    fieldvalues: [],
    fieldTemplates: [],
    selectedId: '',
    fields: [],
    fieldTemplateTypes: []
};

export const key = 'fieldtemplates_reducer';

export function reducer(state = initialState, action: FieldTemplateActions): FieldTemplateState {
    switch (action.type) {
        case FieldTemplateActionTypes.ChangeSelectedPage:
            return {
                ...state,
                selectedPage: action.payload
            };
        case FieldTemplateActionTypes.ChangeSelectedItem:
            return {
                ...state,
                selectedId: action.payload
            };
        case FieldTemplateActionTypes.AddFieldTemplateFail: {
            return {
                ...state,
                formState: {
                    action: Action.Add,
                    error: action.payload
                }
            };
        }
        case FieldTemplateActionTypes.AddFieldTemplateSuccess:
            return {
                ...state,
                fieldTemplates: [...state.fieldTemplates, action.payload]
            };
        case FieldTemplateActionTypes.GetFieldTemplateTypesSuccess:
            return {
                ...state,
                fieldTemplateTypes: action.payload
            };
        case FieldTemplateActionTypes.GetFieldTemplatesSuccess:
            return {
                ...state,
                fieldTemplates: action.payload.data
            };
        case FieldTemplateActionTypes.UpdateFieldTemplateSuccess:
            const updatedFieldTemplates = state.fieldTemplates.map(
                item => action.payload.id === item.id ? action.payload : item);
            return {
                ...state,
                fieldTemplates: updatedFieldTemplates,
            };
        case FieldTemplateActionTypes.DeleteFieldTemplateSuccess:
            return {
                ...state,
                fieldTemplates: state.fieldTemplates.filter(fieldTemplate => fieldTemplate.id !== action.payload)
            };
        case FieldTemplateActionTypes.GetFieldsSuccess:
            return {
                ...state,
                fields: action.payload
            };
        default:
            return state;
    }
}
