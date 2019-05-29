import { SchemaNames } from '../constants/schema-name.constant';

export const PendingSaleItemSchema = {
    name: SchemaNames.pendingSaleItem,
    primaryKey: 'id',
    properties: {
        id: 'string',
        pendingSaleId: 'string',
        variantId: 'string',
        priceId: 'string',
        stockTypeId: 'string',
        quantity: 'int',
        amount: 'double'
    }
};
