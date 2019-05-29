import * as fromRoot from 'src/app/shared/state/app.state';
import { Category } from 'src/app/pos/shared/models/category';
import { QuickSelectActions, QuickSelectActionTypes } from './quick-select.action';
import { Variant } from 'src/app/pos/shared/models/variant';

export interface State extends fromRoot.State {
    quickSelect: QuickSelectsState;
}

export interface QuickSelectsState {
    categories: Category[];
    category: Category;
    categoryTotalItems: number;
    variants: Variant[];
    variantTotalItems: number;
}

const initialState: QuickSelectsState = {
    categories: [],
    category: null,
    categoryTotalItems: 0,
    variants: [],
    variantTotalItems: 0
};

export function reducer(state = initialState, action: QuickSelectActions): QuickSelectsState {
    switch (action.type) {
        case QuickSelectActionTypes.GetCategoriesPagingSuccess: {
            const categoryPagingModel = action.payload;
            const categories = categoryPagingModel.categories;
            const selectedCatetory =
                (categories && categories.length > 0)
                    ? categories[0] : null;
            return {
                ...state,
                categories: categories,
                category: selectedCatetory,
                categoryTotalItems: categoryPagingModel.totalItem
            };
        }
        case QuickSelectActionTypes.GetVariantsByCategoriesPagingSuccess: {
            const variantPagingModel = action.payload;
            const variants = variantPagingModel.variants;
            return {
                ...state,
                variants: variants,
                variantTotalItems: variantPagingModel.totalItem
            };
        }
        default:
            return state;
    }
}
