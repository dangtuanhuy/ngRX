import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PickupOrderModel } from '../models/pickup-order.model';

@Injectable()
export class FakeService {
    public registerMoney = 0;
    public payments = 0;

    public pickupOrders: PickupOrderModel[] = [
        {
            id: '0', customerId: '1', customerName: 'Nur Shazwana Shahnan', deposit: 20,
            products: [{
                id: 1,
                name: 'test 1',
                quantity: 5,
                price: 20
            },
            {
                id: 2,
                name: 'test 2',
                quantity: 1,
                price: 30
            }]
        }
    ];

    constructor() { }

    public getAppsettingShortcuts(): Observable<any> {
        return Observable.create(observer => {
            observer.next([]);
            observer.complete();
        });
    }

    public getPickupOrders(): Observable<any> {
        return Observable.create(observer => {
            observer.next(this.pickupOrders);
            observer.complete();
        });
    }

    public getPickupOrder(id: string): Observable<any> {
        return Observable.create(observer => {
            observer.next(this.pickupOrders.find(x => x.id === id));
            observer.complete();
        });
    }
}
