import { SchemaNames } from '../constants/schema-name.constant';

export const CustomerSchema = {
    name: SchemaNames.customer,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        store: 'double',
        reward: 'double',
        visit: 'double',
        phoneNumber: 'string',
        walletPoint: 'double',
        loyaltyPoint: 'double',
        customerCode: 'string',
        isDelete: 'bool'
    }
};
