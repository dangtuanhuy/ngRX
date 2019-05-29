import { Action } from '@ngrx/store';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { LocationModel, PromotionModel, TypeModel, CouponCodeModel } from '../../promotion.model';

export enum PromotionActionTypes {
    GetPromotions = '[Promotion] Get Promotions',
    GetPromotionsSuccess = '[Promotion] Get Promotions Success',
    GetPromotionsFail = '[Promotion] Get Promotions Fail',
    GetLocations = '[Promotion] get Locations',
    GetLocationsSuccess = '[Promotion] get Locations Success',
    GetLocationsFail = '[Promotion] get Locations Fail',
    GetPromotionTypes = '[Promotion] get PromotionTypes',
    GetPromotionTypesSuccess = '[Promotion] get PromotionTypes Success',
    GetPromotionTypesFail = '[Promotion] get PromotionTypes Fail',
    GetDiscountTypes = '[Promotion] get DiscountTypes',
    GetDiscountTypesSuccess = '[Promotion] get DiscountTypes Success',
    GetDiscountTypesFail = '[Promotion] get DiscountTypes Fail',
    GetConditionTypes = '[Promotion] get ConditionTypes',
    GetConditionTypesSuccess = '[Promotion] get ConditionTypes Success',
    GetConditionTypesFail = '[Promotion] get OperatorTypes Fail',
    GetOperatorTypes = '[Promotion] get OperatorTypes',
    GetOperatorTypesSuccess = '[Promotion] get OperatorTypes Success',
    GetOperatorTypesFail = '[Promotion] get OperatorTypes Fail',
    GetCouponCodes = '[Promotion] get Coupon Codes',
    GetCouponCodesSuccess = '[Promotion] get Coupon Codes Success',
    GetCouponCodesFail = '[Promotion] get Coupon Codes Fail',

    AddPromotion = '[Promotion] add Promotion',
    AddPromotionSuccess = '[Promotion] add Promotion Success',
    AddPromotionFail = '[Promotion] add Promotion Fail',

    UpdatePromotion = '[Promotion] update Promotion',
    UpdatePromotionSuccess = '[Promotion] update Promotion Success',
    UpdatePromotionFail = '[Promotion] update Promotion Fail',

    UpdatePromotionStatus = '[Promotion] update Promotion Status',
    UpdatePromotionStatusSuccess = '[Promotion] update Promotion Status Success',
    UpdatePromotionStatusFail = '[Promotion] update Promotion Status Fail',
}

export class GetPromotions implements Action {
    readonly type = PromotionActionTypes.GetPromotions;
    constructor(public payload: PagingFilterCriteria) { }
}

export class GetPromotionsSuccess implements Action {
    readonly type = PromotionActionTypes.GetPromotionsSuccess;
    constructor(public payload: PagedResult<PromotionModel>) { }
}

export class GetPromotionsFail implements Action {
    readonly type = PromotionActionTypes.GetPromotionTypesFail;
    constructor(public payload: null) { }
}


export class GetLocations implements Action {
    readonly type = PromotionActionTypes.GetLocations;
    constructor() { }
}


export class GetLocationsSuccess implements Action {
    readonly type = PromotionActionTypes.GetLocationsSuccess;
    constructor(public payload: LocationModel[]) { }
}

export class GetLocationsFail implements Action {
    readonly type = PromotionActionTypes.GetLocationsFail;
    constructor(public payload: null) { }
}

export class GetPromotionTypes implements Action {
    readonly type = PromotionActionTypes.GetPromotionTypes;
    constructor() { }
}

export class GetPromotionTypesSuccess implements Action {
    readonly type = PromotionActionTypes.GetPromotionTypesSuccess;
    constructor(public payload: TypeModel[]) { }
}

export class GetPromotionTypesFail implements Action {
    readonly type = PromotionActionTypes.GetPromotionTypesFail;
    constructor(public payload: null) { }
}

export class GetDiscountTypes implements Action {
    readonly type = PromotionActionTypes.GetDiscountTypes;
    constructor() { }
}

export class GetDiscountTypesSuccess implements Action {
    readonly type = PromotionActionTypes.GetDiscountTypesSuccess;
    constructor(public payload: TypeModel[]) { }
}

export class GetDiscountTypesFail implements Action {
    readonly type = PromotionActionTypes.GetDiscountTypesFail;
    constructor(public payload: null) { }
}

export class GetConditionTypes implements Action {
    readonly type = PromotionActionTypes.GetConditionTypes;
    constructor() { }
}

export class GetConditionTypesSuccess implements Action {
    readonly type = PromotionActionTypes.GetConditionTypesSuccess;
    constructor(public payload: TypeModel[]) { }
}

export class GetConditionTypesFail implements Action {
    readonly type = PromotionActionTypes.GetConditionTypesFail;
    constructor(public payload: null) { }
}

export class GetOperatorTypes implements Action {
    readonly type = PromotionActionTypes.GetOperatorTypes;
    constructor() { }
}

export class GetOperatorTypesSuccess implements Action {
    readonly type = PromotionActionTypes.GetOperatorTypesSuccess;
    constructor(public payload: TypeModel[]) { }
}

export class GetOperatorTypesFail implements Action {
    readonly type = PromotionActionTypes.GetOperatorTypesFail;
    constructor(public payload: null) { }
}

export class GetCouponCodes implements Action {
    readonly type = PromotionActionTypes.GetCouponCodes;
    constructor() { }
}

export class GetCouponCodesSuccess implements Action {
    readonly type = PromotionActionTypes.GetCouponCodesSuccess;
    constructor(public payload: CouponCodeModel[]) { }
}

export class GetCouponCodesFail implements Action {
    readonly type = PromotionActionTypes.GetCouponCodesFail;
    constructor(public payload: null) { }
}

export class AddPromotion implements Action {
    readonly type = PromotionActionTypes.AddPromotion;
    constructor(public payload: PromotionModel) { }
}

export class AddPromotionSuccess implements Action {
    readonly type = PromotionActionTypes.AddPromotionSuccess;
    constructor(public payload: PromotionModel) { }
}

export class AddPromotionFail implements Action {
    readonly type = PromotionActionTypes.AddPromotionFail;
    constructor(public payload: string) { }
}

export class UpdatePromotion implements Action {
    readonly type = PromotionActionTypes.UpdatePromotion;
    constructor(public payload: PromotionModel) { }
}

export class UpdatePromotionSuccess implements Action {
    readonly type = PromotionActionTypes.UpdatePromotionSuccess;
    constructor(public payload: PromotionModel) { }
}

export class UpdatePromotionFail implements Action {
    readonly type = PromotionActionTypes.UpdatePromotionFail;
    constructor(public payload: string) { }
}


export class UpdatePromotionStatus implements Action {
    readonly type = PromotionActionTypes.UpdatePromotionStatus;
    constructor(public payload: any) { }
}

export class UpdatePromotionStatusSuccess implements Action {
    readonly type = PromotionActionTypes.UpdatePromotionStatusSuccess;
    constructor(public payload: any) { }
}

export class UpdatePromotionStatusFail implements Action {
    readonly type = PromotionActionTypes.UpdatePromotionStatusFail;
    constructor(public payload: string) { }
}

export type PromotionActions =
    | GetPromotions
    | GetPromotionsSuccess
    | GetPromotionsFail
    | GetLocations
    | GetLocationsSuccess
    | GetLocationsFail
    | GetPromotionTypes
    | GetPromotionTypesSuccess
    | GetPromotionTypesFail
    | GetDiscountTypes
    | GetDiscountTypesSuccess
    | GetDiscountTypesFail
    | GetConditionTypes
    | GetConditionTypesSuccess
    | GetConditionTypesFail
    | GetOperatorTypes
    | GetOperatorTypesSuccess
    | GetOperatorTypesFail
    | AddPromotion
    | AddPromotionSuccess
    | AddPromotionFail
    | UpdatePromotionStatus
    | UpdatePromotionStatusSuccess
    | UpdatePromotionStatusFail
    | GetCouponCodes
    | GetCouponCodesSuccess
    | GetCouponCodesFail
    | UpdatePromotion
    | UpdatePromotionSuccess
    | UpdatePromotionFail;
