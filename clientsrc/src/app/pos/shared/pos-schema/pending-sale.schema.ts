import { SchemaNames } from '../constants/schema-name.constant';

export const PendingSaleSchema = {
    name: SchemaNames.pendingSale,
    primaryKey: 'id',
    properties: {
        id: 'string',
        customerId: { type: 'string', optional: true },
        amount: 'double',
        createdDate: 'date'
    }
};
