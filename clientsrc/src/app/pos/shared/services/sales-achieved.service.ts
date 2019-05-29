import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalesAchievedRepository } from '../data/sales-achieved-repository';
import { SalesAchieved } from '../models/sales-achieved';
import { SaleTargetRepository } from '../data/sale-target-repository';

@Injectable({ providedIn: 'root' })
export class SalesAchievedService {

    constructor(
        private saleTargetRepository: SaleTargetRepository,
        private salesAchievedRepository: SalesAchievedRepository
    ) { }

    get(): Observable<any> {
        return Observable.create(observer => {
            const categories = this.salesAchievedRepository.get();

            observer.next(categories);
            observer.complete();
        });
    }

    // TODO: Phi refactor code. Violate single responsibility
    getCurrentSaleTargetAndSalesAchievedOrCreate(): any {
        return Observable.create(observer => {
            const currentSaleTarget = this.saleTargetRepository.getCurrentSaleTarget();
            let result = null;
            if (currentSaleTarget) {
                const currentSalesAchieved = this.salesAchievedRepository.getOrCreateBySaleTarget(currentSaleTarget);
                result = {
                    saleTarget: currentSaleTarget,
                    salesAchieved: currentSalesAchieved
                };
            }

            observer.next(result);
            observer.complete();
        });
    }

    update(entity: SalesAchieved): Observable<any> {
        return Observable.create(observer => {
            const salesAchieved = this.salesAchievedRepository.updateSalesAchieved(entity);

            observer.next(salesAchieved);
            observer.complete();
        });
    }
}
