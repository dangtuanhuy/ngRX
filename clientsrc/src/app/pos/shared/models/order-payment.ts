import { EntityBase } from './entity-base';

export class OrderPayment extends EntityBase {
    orderId: string;
    paymentCode: string;
    amount: number;

    constructor(values: Object = {}) {
        super();
        if (values) {
            Object.assign(this, values);
        }
    }
}
