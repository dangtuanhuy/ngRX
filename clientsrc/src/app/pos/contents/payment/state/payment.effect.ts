import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store/public_api';
import * as paymentActions from './payment.action';
import { switchMap, map } from 'rxjs/operators';
import { PaymentModeModel } from 'src/app/pos/shared/models/payment-mode.model';
import { PaymentMethodService } from 'src/app/pos/shared/services/payment-method.service';
import { DefaultPaymentMethodService } from 'src/app/pos/shared/services/default-payment-method.service';
import { DefaultPaymentMethodPageType } from 'src/app/pos/shared/models/default-payment-method';

@Injectable()
export class PaymentEffects {
    constructor(
        private action$: Actions,
        private paymentMethodService: PaymentMethodService,
        private defaultPaymentMethodService: DefaultPaymentMethodService
    ) { }

    @Effect()
    getDefaultPaymodes$: Observable<Action> = this.action$.pipe(
        ofType(paymentActions.PaymentModeActionTypes.GetDefaultPaymentModes),
        switchMap((action: paymentActions.GetDefaultPaymentModes) => this.paymentMethodService.getDefaultPaymentModes().pipe(
            map((paymentModes: PaymentModeModel[]) => (new paymentActions.GetDefaultPaymentModesSuccess(paymentModes)))
        ))
    );

    @Effect()
    deletePaymentMode$: Observable<Action> = this.action$.pipe(
        ofType(paymentActions.PaymentModeActionTypes.DeletePaymentModeByCode),
        switchMap((action: paymentActions.DeletePaymentModeByCode) => this.defaultPaymentMethodService.deleteByCode(action.payload).pipe(
            map((result: boolean) => (new paymentActions.DeletePaymentModeByCodeSuccess({
                paymentCode: action.payload,
                result: result
            })))
        ))
    );

    @Effect()
    addPaymentMode$: Observable<Action> = this.action$.pipe(
        ofType(paymentActions.PaymentModeActionTypes.AddPaymentMode),
        switchMap((action: paymentActions.AddPaymentMode) =>
            this.defaultPaymentMethodService.add(-1, action.payload.code, DefaultPaymentMethodPageType.payment).pipe(
                map(() => (new paymentActions.AddPaymentModeSuccess(action.payload)))
            ))
    );
}
