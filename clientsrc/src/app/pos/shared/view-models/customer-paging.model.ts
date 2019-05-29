import { BasePageReponseModel } from './base-page-response.model';
import { Customer } from '../models/customer';

export class CustomerPagingModel extends BasePageReponseModel {
    customers: Customer[];
}
