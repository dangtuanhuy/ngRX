import { SchemaNames } from '../constants/schema-name.constant';

export const OrderPaymentSchema = {
    name: SchemaNames.orderPayment,
    primaryKey: 'id',
    properties: {
        id: 'string',
        orderId: 'string',
        paymentCode: 'string',
        amount: 'double'
    }
};
