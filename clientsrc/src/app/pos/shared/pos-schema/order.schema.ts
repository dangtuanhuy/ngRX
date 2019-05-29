import { SchemaNames } from '../constants/schema-name.constant';

export const OrderSchema = {
    name: SchemaNames.order,
    primaryKey: 'id',
    properties: {
        id: 'string',
        customerId: { type: 'string', optional: true },
        amount: 'double',
        gst: 'double',
        gstInclusive: 'bool',
        isDelete: 'bool',
        synced: 'bool',
        createdDate: 'date'
    }
};
