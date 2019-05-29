import { DefaultPaymentMethodRepository } from '../data/default-payment-method-repository';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { DefaultPaymentMethodPageType } from '../models/default-payment-method';

@Injectable({ providedIn: 'root' })
export class DefaultPaymentMethodService {
    constructor(
        private defaultPaymentMethodRepository: DefaultPaymentMethodRepository
    ) { }

    add(no: number, code: string, pageType: DefaultPaymentMethodPageType): Observable<any> {
        return Observable.create(observer => {
            const defaultPaymentMethod = this.defaultPaymentMethodRepository.addDefaultPaymentMethod(no, code, pageType);

            observer.next(defaultPaymentMethod);
            observer.complete();
        });
    }

    deleteByCode(code: string): Observable<boolean> {
        return Observable.create(observer => {
            const result = this.defaultPaymentMethodRepository.deleteDefaultPaymentMethod(code);

            observer.next(result);
            observer.complete();
        });
    }
}
