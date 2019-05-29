import { EntityBase } from './entity-base';
import { PromotionType } from '../enums/promotion-type.enum';
import { DiscountType } from '../enums/discount-type.enum';
import { PromotionStatus } from '../enums/promotion-status.enum';

export class Promotion extends EntityBase {
    promotionDetailId: string;
    name: string;
    description: string;
    promotionTypeId: PromotionType;
    value: number;
    promotionStatus: PromotionStatus;
    discountTypeId: DiscountType;
    isUseCouponCodes: boolean;
    isUseConditions: boolean;
    fromDate: Date;
    toDate: Date;
}

export function applyPromotions(value: number, promotions: Promotion[]) {
    let totalDiscounts = 0;
    promotions.forEach(x => {
        if (x.discountTypeId === DiscountType.Money) {
            totalDiscounts += x.value;
        }

        if (x.discountTypeId === DiscountType.Percent) {
            totalDiscounts += (value * x.value) / 100;
        }
    });

    const valueAppliedPromotions = value - totalDiscounts;
    return valueAppliedPromotions > 0 ? valueAppliedPromotions : 0;
}
