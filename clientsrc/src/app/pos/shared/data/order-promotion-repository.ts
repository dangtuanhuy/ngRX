import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { SchemaNames } from '../constants/schema-name.constant';
import { AppContextManager } from '../app-context-manager';
import { OrderPromotion } from '../models/order-promotion';
import { DiscountType } from '../enums/discount-type.enum';

@Injectable({ providedIn: 'root' })
export class OrderPromotionRepository extends RepositoryBase<OrderPromotion> {
    Map(obj: any) {
        const result: OrderPromotion = {
            id: obj.id,
            orderId: obj.orderId,
            promotionId: obj.promotionId,
            discountType: obj.discountType ? obj.discountType : DiscountType.Default,
            reason: obj.reason,
            value: obj.value
        };
        return result;
    }

    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.orderPromotion);
    }

    getByOrderId(orderId: string) {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const data = context.objects(this.tableName).filtered(`orderId = "${orderId}"`);
        if (!data.length) {
            context.close();
            return result;
        }
        data.forEach(element => {
            result.push(this.Map(element));
        });
        context.close();
        return result;
    }
}
