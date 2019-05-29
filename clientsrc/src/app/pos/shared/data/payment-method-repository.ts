import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { PaymentMethod } from '../models/payment-mode.model';
import { SchemaNames } from '../constants/schema-name.constant';

@Injectable({ providedIn: 'root' })
export class PaymentMethodRepository extends RepositoryBase<PaymentMethod> {
    Map(obj: any): PaymentMethod {
        const result: PaymentMethod = {
            id: obj.id,
            code: obj.code,
            paymode: obj.paymode,
            slipno: obj.slipno ? obj.slipno : '',
            icon: obj.icon ? obj.icon : '',
            isDelete: obj.isDelete ? obj.isDelete : false
        };
        return result;
    }
    constructor(protected appContextManager: AppContextManager) {
        super(appContextManager, SchemaNames.paymentMethod);
    }
}
