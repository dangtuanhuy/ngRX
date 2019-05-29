import { SchemaNames } from '../constants/schema-name.constant';

export const OrderItemPromotionSchema = {
    name: SchemaNames.orderItemPromotion,
    primaryKey: 'id',
    properties: {
        id: 'string',
        orderItemId: 'string',
        discountType: 'int',
        value: 'double'
    }
};
