import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { OrderPayment } from '../models/order-payment';
import { SchemaNames } from '../constants/schema-name.constant';

@Injectable({ providedIn: 'root' })
export class OrderPaymentRepository extends RepositoryBase<OrderPayment> {
    Map(obj: any): OrderPayment {
        const result: OrderPayment = {
            id: obj.id,
            orderId: obj.orderId,
            paymentCode: obj.paymentCode,
            amount: obj.amount
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.orderPayment);
    }

    public getOrderPaymentsByOrderIdUseContext(context: any, orderId: string) {
        const result: OrderPayment[] = [];
        const orderPaymentRealms = context.objects(SchemaNames.orderPayment).filtered('orderId = $0', orderId);
        orderPaymentRealms.forEach(orderPaymentRealm => {
            result.push(this.Map(orderPaymentRealm));
        });

        return result;
    }

    getByOrders(orderIds: string[]): OrderPayment[] {
        const context = this.appContextManager.GetLatestDbContext();
        const orderPaymentRealms = context.objects(this.tableName)
            .filter(x => orderIds.includes(x.orderId));

        const result: OrderPayment[] = [];
        if (orderPaymentRealms.length) {
            orderPaymentRealms.forEach(x => {
                result.push(this.Map(x));
            });
        }

        context.close();
        return result;
    }
}
