import { SchemaNames } from '../constants/schema-name.constant';

export const SalesAchievedSchema = {
    name: SchemaNames.salesAchieved,
    primaryKey: 'id',
    properties: {
        id: 'string',
        value: 'double',
        fromDate: 'date',
        toDate: 'date',
        saleTargetId: 'string'
    }
};
