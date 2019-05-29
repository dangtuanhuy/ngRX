import { EntityBase } from './entity-base';
import { DiscountType } from '../enums/discount-type.enum';

export class OrderPromotion extends EntityBase {
    orderId: string;
    promotionId: string;
    reason: string;
    discountType: DiscountType;
    value: number;
}
