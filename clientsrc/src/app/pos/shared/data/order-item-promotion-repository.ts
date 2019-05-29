import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { OrderItemPromotion } from '../models/order-item-promotion';
import { DiscountType } from '../enums/discount-type.enum';
import { AppContextManager } from '../app-context-manager';
import { SchemaNames } from '../constants/schema-name.constant';

@Injectable({ providedIn: 'root' })
export class OrderItemPromotionRepository extends RepositoryBase<OrderItemPromotion> {
    Map(obj: any) {
        const result: OrderItemPromotion = {
            id: obj.id,
            orderItemId: obj.orderItemId,
            discountType: obj.discountType ? obj.discountType : DiscountType.Default,
            value: obj.value
        };
        return result;
    }

    constructor(
        protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.orderItemPromotion);
    }
}
