import * as fromRoot from 'src/app/shared/state/app.state';
import { CategoryActions, CategoryActionTypes } from './category.action';
import { CategoryModel } from '../category.model';

export interface State extends fromRoot.State {
    categories: CategoryState;
}

export interface CategoryState {
    categories: CategoryModel[];
    category: CategoryModel;
}

const initialState: CategoryState = {
    categories: [],
    category: null
};

export const key = 'categories_reducer';

export function reducer(
    state = initialState,
    action: CategoryActions
): CategoryState {
    switch (action.type) {
        case CategoryActionTypes.GetCategoriesSuccess:
            return {
                ...state,
                categories: action.payload.data
            };
        case CategoryActionTypes.GetCategorySuccess:
            return {
                ...state,
                category: action.payload
            };
        case CategoryActionTypes.AddCategorySuccess:
            return {
                ...state,
                categories: [...state.categories, action.payload]
            };
        case CategoryActionTypes.AddCategoryFail: {
            return {
                ...state
            };
        }
        case CategoryActionTypes.UpdateCategorySuccess:
            const updatedCategories = state.categories.map(
                item => action.payload.id === item.id ? action.payload : item);
            return {
                ...state,
                categories: updatedCategories
            };
        case CategoryActionTypes.UpdateCategoryFail: {
            return {
                ...state
            };
        }
        case CategoryActionTypes.DeleteCategorySuccess:
            return {
                ...state,
                categories: state.categories.filter(
                    category => category.id !== action.payload
                )
            };
        case CategoryActionTypes.DeleteCategoryFail:
            return {
                ...state
            };
        default:
            return state;
    }
}
