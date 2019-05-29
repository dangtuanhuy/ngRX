import { SchemaNames } from '../../constants/schema-name.constant';

export const PaymentMethodSchema = {
    name: SchemaNames.paymentMethod,
    primaryKey: 'id',
    properties: {
        id: 'string',
        code: 'string',
        paymode: 'string',
        icon: 'string',
        slipno: 'string',
        isDelete: 'bool'
    }
};
