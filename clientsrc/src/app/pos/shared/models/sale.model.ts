import { ProductViewModel } from './product-view.model';
import { SaleStatus } from '../enums/sale-status.enum';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';

export class SaleModel {
    id: string;
    customerId: string;
    customerName: string;
    customer: CustomerModel;
    products: ProductViewModel[] = [];
    totalPrice: number;
    status: SaleStatus;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}
