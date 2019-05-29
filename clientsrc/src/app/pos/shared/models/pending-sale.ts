import { EntityBase } from './entity-base';
import { PendingSaleItemModel } from './pending-sale-item';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';

export class PendingSale extends EntityBase {
    customerId: string;
    amount: number;
    createdDate: Date;
}

export class PendingSaleModel extends PendingSale {
    pendingSaleItems: PendingSaleItemModel[] = [];
    customer: CustomerModel;
    customerName: string;

    map(values: object = {}) {
        Object.assign(this, values);
    }
}
