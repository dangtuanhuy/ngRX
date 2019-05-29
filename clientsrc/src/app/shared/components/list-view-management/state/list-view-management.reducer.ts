import { ListViewManagementActions, ListViewManagementActionTypes } from './list-view-management.actions';
import { FormState } from 'src/app/shared/base-model/form.state';
import { Action } from 'src/app/shared/constant/form-action.constant';

export interface ListViewManagementState {
    selectedPage: number;
    totalItems: number;
    selectedItem: string;
    selectedItems: string[];
    formState: FormState;
    filter: any;
}

const initialState: ListViewManagementState = {
    selectedPage: 0,
    totalItems: 0,
    selectedItem: null,
    selectedItems: [],
    formState: new FormState(Action.None, null),
    filter: null
};

export const key = 'listviewmanagement_reducer';

export function reducer(state = initialState, action: ListViewManagementActions): ListViewManagementState {
    switch (action.type) {
        case ListViewManagementActionTypes.UpdateFormStateAction:
            return {
                ...state,
                formState: action.payload
            };
        case ListViewManagementActionTypes.AddSuccess:
            return {
                ...state,
                totalItems: state.totalItems + 1,
                formState: {
                    action: Action.Add,
                    error: null
                }
            };
        case ListViewManagementActionTypes.UpdateSuccess:
            return {
                ...state,
                formState: {
                    action: Action.Update,
                    error: null
                }
            };
        case ListViewManagementActionTypes.DeleteSuccess:
            return {
                ...state,
                formState: {
                    action: Action.Delete,
                    error: null
                },
                totalItems: state.totalItems - 1,
            };
        case ListViewManagementActionTypes.GetPageSuccess:
            return {
                ...state,
                totalItems: action.payload.totalItems,
                selectedPage: action.payload.currentPage - 1
            };
        case ListViewManagementActionTypes.ChangeSelectedItem:
            return {
                ...state,
                selectedItem: action.payload
            };

        case ListViewManagementActionTypes.ChangeSelectedItems:
            return {
                ...state,
                selectedItems: action.payload
            };
        case ListViewManagementActionTypes.ResetState:
            return {
                ...state,
                selectedItem: null
            };
        case ListViewManagementActionTypes.InitEmptyPage:
            return {
                ...state,
                totalItems: 0,
                selectedItems: []
        };
        case ListViewManagementActionTypes.ChangeFilter:
            return {
                ...state,
                filter: action.payload,
                selectedItems: []
            };
        default:
            return state;
    }
}
