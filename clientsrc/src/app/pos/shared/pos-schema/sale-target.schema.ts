import { SchemaNames } from '../constants/schema-name.constant';

export const SaleTargetSchema = {
    name: SchemaNames.saleTarget,
    primaryKey: 'id',
    properties: {
        id: 'string',
        target: 'double',
        fromDate: 'date',
        toDate: 'date',
        isDelete: 'bool'
    }
};
