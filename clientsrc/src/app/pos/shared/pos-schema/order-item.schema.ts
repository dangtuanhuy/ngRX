import { SchemaNames } from '../constants/schema-name.constant';

export const OrderItemSchema = {
    name: SchemaNames.orderItem,
    primaryKey: 'id',
    properties: {
        id: 'string',
        orderId: 'string',
        variantId: 'string',
        priceId: 'string',
        stockTypeId: 'string',
        quantity: 'int',
        price: 'double',
        amount: 'double',
        isDelete: 'bool'
    }
};
