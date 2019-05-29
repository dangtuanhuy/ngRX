import { BasePageReponseModel } from './base-page-response.model';
import { OrderModel } from '../models/order';

export class RecentOrderPagingModel extends BasePageReponseModel {
    recentOrders: OrderModel[];
}
