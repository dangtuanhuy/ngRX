import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { AppContextManager } from '../app-context-manager';
import { OrderItem } from '../models/order-item';
import { SchemaNames } from '../constants/schema-name.constant';
import { OrderItemStatus } from '../enums/order-item-status.enum';

@Injectable({ providedIn: 'root' })
export class OrderItemRepository extends RepositoryBase<OrderItem> {
    Map(obj: any) {
        const result: OrderItem = {
            id: obj.id,
            orderId: obj.orderId,
            variantId: obj.variantId,
            priceId: obj.priceId,
            stockTypeId: obj.stockTypeId,
            quantity: Number(obj.quantity),
            price: obj.price,
            amount: obj.amount,
            isDelete: obj.isDelete ? obj.isDelete : false,
            oldOrderItemId: obj.oldOrderItemId ? obj.oldOrderItemId : '',
            status: obj.status ? obj.status : OrderItemStatus.Normal
        };
        return result;
    }

    constructor(
        protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.orderItem);
    }

    getByOrder(orderId: string): OrderItem[] {
        const context = this.appContextManager.GetLatestDbContext();
        const result = [];
        const data = context.objects(this.tableName).filter(x => x.orderId === orderId);
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
