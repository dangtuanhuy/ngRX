import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TenderRepository } from '../data/tender-repository';
import { Tender } from '../models/tender';

@Injectable({ providedIn: 'root' })
export class TenderService {

    constructor(
        private tenderRepository: TenderRepository
    ) { }

    get(): Observable<any> {
        return Observable.create(observer => {
            const tenders = this.tenderRepository.get();

            observer.next(tenders);
            observer.complete();
        });
    }

    add(entity: Tender): Observable<any> {
        return Observable.create(observer => {
            try {
                const tender = this.tenderRepository.addTender(entity);

                observer.next(tender);
                observer.complete();
            } catch (e) {
                observer.next(null);
                observer.complete();
            }
        });
    }

    getTheLastTenderToday(): Observable<any> {
        return Observable.create(observer => {
            try {
                const lastTender = this.tenderRepository.getTheLastTenderToday();

                observer.next(lastTender);
                observer.complete();
            } catch (e) {
                observer.next(null);
                observer.complete();
            }
        });
    }
}
