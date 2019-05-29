import { EntityBase } from './entity-base';
import { OrderItemPromotion } from './order-item-promotion';
import { OrderItemStatus } from '../enums/order-item-status.enum';

export class OrderItem extends EntityBase {
    orderId: string;
    variantId: string;
    priceId: string;
    stockTypeId: string;
    quantity: number;
    price: number;
    amount: number;
    isDelete = false;
    status: OrderItemStatus;
    oldOrderItemId: string;
}

export class OrderItemModel extends OrderItem {
    variant: string;
    skuCode: string;
    orderItemPromotions: OrderItemPromotion[] = [];
}
