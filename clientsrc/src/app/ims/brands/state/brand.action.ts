import { Action } from '@ngrx/store';
import { BrandModel } from '../brand.model';
import { FormState } from 'src/app/shared/base-model/form.state';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

export enum BrandActionTypes {
    GetBrands = '[Brand] Get Brands',
    GetBrand = '[Brand] Get Brand',
    GetBrandsSuccess = '[Brand] Get Brands Success',
    GetBrandSuccess = '[Brand] Get Brand Success',
    GetBrandsFail = '[Brand] Get Brands Fail',
    AddBrand = '[Brand] Add Brand',
    AddBrandSuccess = '[Brand] Add Brand Success',
    AddBrandFail = '[Brand] Add Brand Fail',
    UpdateBrand = '[Brand] Update Brand',
    UpdateBrandSuccess = '[Brand] Update Brand Success',
    UpdateBrandFail = '[Brand] Update Brand Fail',
    DeleteBrand = '[Brand] Delete Brand',
    DeleteBrandSuccess = '[Brand] Delete Brand Success',
    DeleteBrandFail = '[Brand] Delete Brand Fail',
}

export class GetBrands implements Action {
    readonly type = BrandActionTypes.GetBrands;
    constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetBrand implements Action {
    readonly type = BrandActionTypes.GetBrand;
    constructor(public payload: string) { }
}

export class GetBrandsSuccess implements Action {
    readonly type = BrandActionTypes.GetBrandsSuccess;
    constructor(public payload: PagedResult<BrandModel>) { }
}

export class GetBrandSuccess implements Action {
    readonly type = BrandActionTypes.GetBrandSuccess;
    constructor(public payload: BrandModel) { }
}

export class GetBrandsFail implements Action {
    readonly type = BrandActionTypes.GetBrandsFail;
    constructor(public payload: null) { }
}

export class AddBrand implements Action {
    readonly type = BrandActionTypes.AddBrand;
    constructor(public payload: BrandModel) { }
}

export class AddBrandSuccess implements Action {
    readonly type = BrandActionTypes.AddBrandSuccess;
    constructor(public payload: BrandModel) { }
}

export class AddBrandFail implements Action {
    readonly type = BrandActionTypes.AddBrandFail;
    constructor(public payload: string) { }
}

export class UpdateBrand implements Action {
    readonly type = BrandActionTypes.UpdateBrand;
    constructor(public payload: BrandModel) { }
}

export class UpdateBrandSuccess implements Action {
    readonly type = BrandActionTypes.UpdateBrandSuccess;
    constructor(public payload: BrandModel) { }
}

export class UpdateBrandFail implements Action {
    readonly type = BrandActionTypes.UpdateBrandFail;
    constructor(public payload: string) { }
}

export class DeleteBrand implements Action {
    readonly type = BrandActionTypes.DeleteBrand;
    constructor(public payload: string) { }
}

export class DeleteBrandSuccess implements Action {
    readonly type = BrandActionTypes.DeleteBrandSuccess;
    constructor(public payload: string) { }
}

export class DeleteBrandFail implements Action {
    readonly type = BrandActionTypes.DeleteBrandFail;
    constructor(public payload: string) { }
}

export type BrandActions =
    GetBrands
    | GetBrandsSuccess
    | GetBrandSuccess
    | GetBrandsFail
    | AddBrand
    | AddBrandSuccess
    | AddBrandFail
    | UpdateBrand
    | UpdateBrandSuccess
    | UpdateBrandFail
    | DeleteBrand
    | DeleteBrandSuccess
    | DeleteBrandFail;
