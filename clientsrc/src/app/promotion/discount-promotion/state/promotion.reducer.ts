import { FormState } from 'src/app/shared/base-model/form.state';
import * as fromRoot from 'src/app/shared/state/app.state';
import { Action } from 'src/app/shared/constant/form-action.constant';
import { PromotionActions, PromotionActionTypes } from './promotion.action';
import { LocationModel, PromotionModel, TypeModel, PromotionStatus, CouponCodeModel } from '../../promotion.model';

export interface PromotionState {
    selectedPage: number;
    totalItems: number;
    selectedItem: string;
    formState: FormState;
    id: string;
    selectedId: string;
    locations: Array<LocationModel>;
    promotionTypes: Array<TypeModel>;
    discountTypes: Array<TypeModel>;
    promotions: Array<PromotionModel>;
    conditionTypes: Array<TypeModel>;
    operatorTypes: Array<TypeModel>;
    couponCodes: Array<CouponCodeModel>;
}

const initialState: PromotionState = {
    selectedPage: 0,
    totalItems: 0,
    selectedItem: null,
    formState: new FormState(Action.None, null),
    id: null,
    selectedId: '',
    locations: null,
    promotionTypes: null,
    discountTypes: null,
    promotions: null,
    conditionTypes: null,
    operatorTypes: null,
    couponCodes: null
};

export const key = 'promotions_reducer';

export function reducer(state = initialState, action: PromotionActions): PromotionState {
    switch (action.type) {
        case PromotionActionTypes.GetPromotionsSuccess:
            return {
                ...state,
                promotions: action.payload.data
            };
        case PromotionActionTypes.GetLocationsSuccess:
            return {
                ...state,
                locations: action.payload
            };
        case PromotionActionTypes.GetPromotionTypesSuccess:
            return {
                ...state,
                promotionTypes: action.payload
            };
        case PromotionActionTypes.GetDiscountTypesSuccess:
            return {
                ...state,
                discountTypes: action.payload
            };
        case PromotionActionTypes.GetConditionTypesSuccess:
            return {
                ...state,
                conditionTypes: action.payload
            };
        case PromotionActionTypes.GetOperatorTypesSuccess:
            return {
                ...state,
                operatorTypes: action.payload
            };
        case PromotionActionTypes.GetCouponCodesSuccess:
            return {
                ...state,
                couponCodes: action.payload
            };
        case PromotionActionTypes.AddPromotionSuccess:
            return {
                ...state,
                promotions: [...state.promotions, action.payload]
            };
        case PromotionActionTypes.AddPromotionFail: {
            return {
                ...state
            };
        }
        case PromotionActionTypes.UpdatePromotionStatusSuccess:
            const promotions = state.promotions;
            const selectedPromotion = promotions.find(x => x.id === action.payload.id);
            if (selectedPromotion) {
                selectedPromotion.status = action.payload.status;
            }

            return {
                ...state,
                promotions: [...promotions]
            };
        case PromotionActionTypes.UpdatePromotionSuccess:
            const updatePromotions = state.promotions.map(
                item => action.payload.id === item.id ? action.payload : item);
            return {
                ...state,
                promotions: updatePromotions
            };
        case PromotionActionTypes.UpdatePromotionStatusFail:
            return {
                ...state
            };
        default:
            return state;
    }
}
