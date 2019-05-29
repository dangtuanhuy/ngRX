import { Injectable } from '@angular/core';
import { SaleModel } from '../models/sale.model';
import { Observable } from 'rxjs';
import { SaleStatus } from '../enums/sale-status.enum';

@Injectable()
export class SalesService {
    recentSales: SaleModel[] = [];
    pendingSales: SaleModel[] = [];

    constructor() { }

    getSales(status: SaleStatus): Observable<SaleModel[]> {
        return Observable.create(observer => {
            const result = status === SaleStatus.Success ? this.recentSales : this.pendingSales;
            observer.next(result);
            observer.complete();
        });
    }

    getSale(saleId: string, status: SaleStatus): Observable<SaleModel> {
        return Observable.create(observer => {

            if (status === SaleStatus.Success) {
                observer.next(this.recentSales.find(x => x.id === saleId));
            }

            if (status === SaleStatus.Pending) {
                observer.next(this.pendingSales.find(x => x.id === saleId));
            }

            observer.complete();
        });
    }

    addSale(sale: SaleModel): Observable<SaleModel> {
        return Observable.create(observer => {
            if (sale.status === SaleStatus.Success) {
                this.recentSales.push(sale);
            }

            if (sale.status === SaleStatus.Pending) {
                this.pendingSales.push(sale);
            }

            observer.next(sale);
            observer.complete();
        });
    }
}
