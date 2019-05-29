import { SchemaNames } from '../constants/schema-name.constant';

export const OrderPromotionSchema = {
    name: SchemaNames.orderPromotion,
    primaryKey: 'id',
    properties: {
        id: 'string',
        orderId: 'string',
        promotionId: 'string',
        reason: 'string',
        discountType: 'int',
        value: 'double'
    }
};
