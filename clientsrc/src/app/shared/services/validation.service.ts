import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FieldType } from 'src/app/ims/fields/field-base/field-type';
import { PromotionType, DiscountType } from 'src/app/promotion/promotion.model';

@Injectable()
export class ValidationService {
    constructor() {
    }

    validateRequiredDependType(typeText: string, valueText: string): ValidatorFn {
        return (check: AbstractControl): { [key: string]: boolean } | null => {
            const type = check.get(typeText) ? check.get(typeText).value : undefined;
            const value = check.get(valueText) ? check.get(valueText).value : undefined;
            let isValid = true;
            if (type.toString() === FieldType.PredefinedList.toString() && ( !value || value.length === 0)) {
                isValid = false;
            }
            return isValid ? null : { 'invalidPredefine': true };
        };
    }

    validateRequiredDependPromotionType(typeText: string,
        discountTypeText: string,
        discountValueAmountText: string,
        discountValuePercentText: string): ValidatorFn {
        return (check: AbstractControl): { [key: string]: boolean } | null => {
            const type = check.get(typeText) ? check.get(typeText).value : undefined;
            const discountType = check.get(discountTypeText) ? check.get(discountTypeText).value : undefined;
            const discountValueAmount = check.get(discountValueAmountText) ? check.get(discountValueAmountText).value : undefined;
            const discountValuePercent = check.get(discountValuePercentText) ? check.get(discountValuePercentText).value : undefined;
            let isValid = true;
            if (type && type.toString() === PromotionType.Discount.toString()
            && ( !discountType
                    || (discountType.toString() === DiscountType.Amount.toString() && !discountValueAmount)
                    || (discountType.toString() === DiscountType.Percent.toString() && !discountValuePercent))) {
                isValid = false;
            }
            return isValid ? null : { 'invalidDiscountInfo': true };
        };
    }

    validateRequiredPromotionWithUseCouponCodes(promotionTypeText: string,
        checkUseCouponCodesText: string, counponCodesText: string): ValidatorFn {
        return (check: AbstractControl): { [key: string]: boolean } | null => {
            const promotionType = check.get(promotionTypeText) ? check.get(promotionTypeText).value : undefined;
            const checkUseCouponCodes = check.get(checkUseCouponCodesText) ? check.get(checkUseCouponCodesText).value : undefined;
            const counponCodes = check.get(counponCodesText) ? check.get(counponCodesText).value : undefined;
            let isValid = true;
            if (promotionType && promotionType.toString() === PromotionType.Discount.toString()
            && checkUseCouponCodes === 'code' && (!counponCodes || counponCodes === '')) {
                isValid = false;
            }
            return isValid ? null : { 'invalidDiscountInfo': true };
        };
    }

    validateRequiredPromotionWithUpdateCouponCodes(checkUseCouponCodesText: string, counponCodesText: string): ValidatorFn {
        return (check: AbstractControl): { [key: string]: boolean } | null => {
            const checkUseCouponCodes = check.get(checkUseCouponCodesText) ? check.get(checkUseCouponCodesText).value : undefined;
            const counponCodes = check.get(counponCodesText) ? check.get(counponCodesText).value : undefined;
            let isValid = true;
            if (checkUseCouponCodes && (!counponCodes || counponCodes === '')) {
                isValid = false;
            }
            return isValid ? null : { 'invalidDiscountInfo': true };
        };
    }

    validateRequiredPromotionWithUseCondidtions(
        promotionTypeText: string,
        checkUseConditionsText: string,
        conditionsText: string,
        operatorText: string,
        valueText): ValidatorFn {
        return (check: AbstractControl): { [key: string]: boolean } | null => {
            const promotionType = check.get(promotionTypeText) ? check.get(promotionTypeText).value : undefined;
            const checkUseConditions = check.get(checkUseConditionsText) ? check.get(checkUseConditionsText).value : undefined;
            const conditions = check.get(conditionsText) ? check.get(conditionsText).value : undefined;
            const operator = check.get(operatorText) ? check.get(operatorText).value : undefined;
            const value = check.get(valueText) ? check.get(valueText).value : undefined;
            let isValid = true;
            if (promotionType && promotionType.toString() === PromotionType.Discount.toString()
            && checkUseConditions === 'condition' && ((!conditions || conditions === '')
                || (!operator || operator === '')
                || (!value))) {
                isValid = false;
            }
            return isValid ? null : { 'invalidDiscountInfo': true };
        };
    }
}
