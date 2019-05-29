import { EntityBase } from './entity-base';
import { DiscountType } from '../enums/discount-type.enum';

export class OrderItemPromotion extends EntityBase {
    orderItemId: string;
    discountType: DiscountType;
    value: number;
}

export class SaleItemPromotion {
    id: string;
    selectedPosVariantId: string;
    discountType: DiscountType;
    value: number;
}
