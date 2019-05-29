import { ProductViewModel } from './product-view.model';

export class PickupOrderModel {
    id: string;
    customerId: string;
    customerName: string;
    products = [];
    deposit: number;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}
