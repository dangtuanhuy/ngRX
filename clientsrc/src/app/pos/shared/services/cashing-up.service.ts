import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { CashingUpRepository } from '../data/cashing-up-repository';
import { CashingUp } from '../models/cashing-up';

@Injectable({ providedIn: 'root' })
export class CashingUpService {

    constructor(
        private cashingUpRepository: CashingUpRepository
    ) { }

    get(): Observable<any> {
        return Observable.create(observer => {
            const cashingUps = this.cashingUpRepository.get();

            observer.next(cashingUps);
            observer.complete();
        });
    }

    add(entity: CashingUp): Observable<any> {
        return Observable.create(observer => {
            try {
                const cashingUp = this.cashingUpRepository.addCashingUp(entity);

                observer.next(cashingUp);
                observer.complete();
            } catch (e) {
                observer.next(e);
                observer.complete();
            }
        });
    }

    getTheLastCashingUp(): Observable<any> {
        return Observable.create(observer => {
            try {
                const lastCashingUpRealm = this.cashingUpRepository.getTheLastCashingUp();
                let result = null;
                if (lastCashingUpRealm) {
                    result = this.cashingUpRepository.Map(lastCashingUpRealm);
                }

                observer.next(result);
                observer.complete();
            } catch (e) {
                observer.next(null);
                observer.complete();
            }
        });
    }

    getTheLastOpenday(): Observable<any> {
        return Observable.create(observer => {
            try {
                const lastOpendayRealm = this.cashingUpRepository.getTheLastOpenday();
                let result = null;
                if (lastOpendayRealm) {
                    result = this.cashingUpRepository.Map(lastOpendayRealm);
                }

                observer.next(result);
                observer.complete();
            } catch (e) {
                observer.next(null);
                observer.complete();
            }
        });
    }
}
