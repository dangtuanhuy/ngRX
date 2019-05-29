
import { Action } from '@ngrx/store';
import { CategoryModel } from '../category.model';
import { AppSettingModel } from 'src/app/shared/base-model/appsetting.model';
import { FormState } from 'src/app/shared/base-model/form.state';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

export enum CategoryActionTypes {
    GetCategories = '[Category] Get Categories',
    GetCategory = '[Category] Get Category',
    GetCategoriesSuccess = '[Category] Get Categories Success',
    GetCategorySuccess = '[Category] Get Category Success',
    GetCategoriesFail = '[Category] Get Categories Fail',
    AddCategory = '[Category] Add Category',
    AddCategorySuccess = '[Category] Add Category Success',
    AddCategoryFail = '[Category] Add Category Fail',
    UpdateCategory = '[Category] Update Category',
    UpdateCategorySuccess = '[Category] Update Category Success',
    UpdateCategoryFail = '[Category] Update Category Fail',
    DeleteCategory = '[Category] Delete Category',
    DeleteCategorySuccess = '[Category] Delete Category Success',
    DeleteCategoryFail = '[Category] Delete Category Fail'
}

export class GetCategories implements Action {
    readonly type = CategoryActionTypes.GetCategories;
    constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetCategory implements Action {
    readonly type = CategoryActionTypes.GetCategory;
    constructor(public payload: string) { }
  }

export class GetCategoriesSuccess implements Action {
    readonly type = CategoryActionTypes.GetCategoriesSuccess;
    constructor(public payload: PagedResult<CategoryModel>) { }
}

export class GetCategorySuccess implements Action {
    readonly type = CategoryActionTypes.GetCategorySuccess;
    constructor(public payload: CategoryModel) { }
}

export class GetCategoriesFail implements Action {
    readonly type = CategoryActionTypes.GetCategoriesFail;
    constructor(public payload: null) { }
}

export class AddCategory implements Action {
    readonly type = CategoryActionTypes.AddCategory;
    constructor(public payload: CategoryModel) { }
}

export class AddCategorySuccess implements Action {
    readonly type = CategoryActionTypes.AddCategorySuccess;
    constructor(public payload: CategoryModel) { }
}

export class AddCategoryFail implements Action {
    readonly type = CategoryActionTypes.AddCategoryFail;
    constructor(public payload: string) { }
}

export class UpdateCategory implements Action {
    readonly type = CategoryActionTypes.UpdateCategory;
    constructor(public payload: CategoryModel) { }
}

export class UpdateCategorySuccess implements Action {
    readonly type = CategoryActionTypes.UpdateCategorySuccess;
    constructor(public payload: CategoryModel) { }
}

export class UpdateCategoryFail implements Action {
    readonly type = CategoryActionTypes.UpdateCategoryFail;
    constructor(public payload: string) { }
}

export class DeleteCategory implements Action {
    readonly type = CategoryActionTypes.DeleteCategory;
    constructor(public payload: string) { }
}

export class DeleteCategorySuccess implements Action {
    readonly type = CategoryActionTypes.DeleteCategorySuccess;
    constructor(public payload: string) { }
}

export class DeleteCategoryFail implements Action {
    readonly type = CategoryActionTypes.DeleteCategoryFail;
    constructor(public payload: string) { }
}

export type CategoryActions =
      GetCategories
    | GetCategoriesSuccess
    | GetCategoriesFail
    | GetCategory
    | GetCategorySuccess
    | AddCategory
    | AddCategorySuccess
    | AddCategoryFail
    | UpdateCategory
    | UpdateCategorySuccess
    | UpdateCategoryFail
    | DeleteCategory
    | DeleteCategorySuccess
    | DeleteCategoryFail;

