import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderPaymentRepository } from '../data/order-payment-repository';
import { OrderPayment } from '../models/order-payment';

@Injectable({ providedIn: 'root' })
export class OrderPaymentService {
    constructor(
        private orderPaymentRepository: OrderPaymentRepository
    ) {

    }

    getOrderPaymentsByOrders(orderIds: string[]): Observable<OrderPayment[]> {
        return Observable.create(observer => {
            const result = this.orderPaymentRepository.getByOrders(orderIds);

            observer.next(result);
            observer.complete();
        });
    }
}
