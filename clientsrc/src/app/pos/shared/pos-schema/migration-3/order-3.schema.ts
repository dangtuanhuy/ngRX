import { SchemaNames } from '../../constants/schema-name.constant';

export const Order3Schema = {
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
        billNo: 'string',
        change: 'double',
        createdDate: 'date'
    }
};
