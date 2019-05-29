import { SchemaNames } from '../constants/schema-name.constant';

export const CashingUpSchema = {
    name: SchemaNames.cashingUp,
    primaryKey: 'id',
    properties: {
        id: 'string',
        userId: 'string',
        amount: 'double',
        cashingUpType: 'string',
        createdDate: 'date'
    }
};
