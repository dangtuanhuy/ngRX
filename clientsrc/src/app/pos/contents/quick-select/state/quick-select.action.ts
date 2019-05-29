import { Action } from '@ngrx/store';
import { Category } from 'src/app/pos/shared/models/category';
import { Variant } from 'src/app/pos/shared/models/variant';
import { CategoryPagingModel } from 'src/app/pos/shared/view-models/category-paging.model';
import { VariantPagingModel } from 'src/app/pos/shared/view-models/variant-paging.model';

export enum QuickSelectActionTypes {
    GetCategoriesPaging = '[QuickSelect] Get Categories Paging.',
    GetCategoriesPagingSuccess = '[QuickSelect] Get Categories Paging Success.',

    GetVariantsByCategoriesPaging = '[QuickSelect] Get Variants By Paging Categories.',
    GetVariantsByCategoriesPagingSuccess = '[QuickSelect] Get Variants By Categories Paging Success.'
}

export class GetCategoriesPaging implements Action {
    readonly type = QuickSelectActionTypes.GetCategoriesPaging;
    constructor(public payload: any) { }
}

export class GetCategoriesPagingSuccess implements Action {
    readonly type = QuickSelectActionTypes.GetCategoriesPagingSuccess;
    constructor(public payload: CategoryPagingModel) { }
}

export class GetVariantsByCategoriesPaging implements Action {
    readonly type = QuickSelectActionTypes.GetVariantsByCategoriesPaging;
    constructor(public payload: any) { }
}

export class GetVariantsByCategoriesPagingSuccess implements Action {
    readonly type = QuickSelectActionTypes.GetVariantsByCategoriesPagingSuccess;
    constructor(public payload: VariantPagingModel) { }
}

export type QuickSelectActions =
    GetCategoriesPaging
    | GetCategoriesPagingSuccess
    | GetVariantsByCategoriesPaging
    | GetVariantsByCategoriesPagingSuccess;
