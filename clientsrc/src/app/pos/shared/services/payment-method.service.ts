import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentMethodRepository } from '../data/payment-method-repository';
import { PaymentModeModel } from '../models/payment-mode.model';
import { DefaultPaymentMethodRepository } from '../data/default-payment-method-repository';
import { DefaultPaymentMethodPageType } from '../models/default-payment-method';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
    paymentModeIconDefault = 'assets/pos/images/pos-paymentmode-cash.png';
    paymentModeList = [
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'CASH', paymode: 'CASH', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-nets.png',
            code: 'NETS', paymode: 'NETS', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-visa.png',
            code: 'VISA', paymode: 'VISA', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash-master-card.png',
            code: 'MASTER', paymode: 'MASTER', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash-card.png',
            code: 'CASH-CARD', paymode: 'CASH CARD', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-amex.png',
            code: 'AMEX', paymode: 'AMEX', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'VOUCHER', paymode: 'VOUCHER', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'OCBC', paymode: 'OCBC', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'DBS', paymode: 'DBS', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'E-WALLET', paymode: 'E-WALLET', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'E-VOUCHERS', paymode: 'E-VOUCHERS', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'E-POINT', paymode: 'E-POINT', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'MALL-VOUCHER', paymode: 'MALL VOUCHER', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'SAFRA-VOUCHER', paymode: 'SAFRA VOUCHER', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'UNIONPAY', paymode: 'UNIONPAY', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'DBS-INSTALMENT', paymode: 'DBS INSTALMENT', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'OCBC-INSTALMENT', paymode: 'OCBC INSTALMENT', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'SHOPEE', paymode: 'SHOPEE', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'ALIPAY', paymode: 'ALIPAY', slipno: ''
        },
        {
            icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'DBS-MAX', paymode: 'DBS MAX', slipno: ''
        },
    ];

    constructor(
        private paymentMethodRepository: PaymentMethodRepository,
        private defaultPaymentMethodRepository: DefaultPaymentMethodRepository
    ) { }

    get(): Observable<PaymentModeModel[]> {
        return Observable.create(observer => {
            const paymentMethods = this.paymentMethodRepository.get().filter(x => !x.isDelete);
            const paymentModeModels: PaymentModeModel[] = paymentMethods.map(x => {
                const paymentModeModel = new PaymentModeModel();
                paymentModeModel.id = x.id;
                paymentModeModel.icon = x.icon;
                paymentModeModel.code = x.code;
                paymentModeModel.paymode = x.paymode;
                paymentModeModel.slipno = x.slipno;

                return paymentModeModel;
            });

            observer.next(paymentModeModels);
            observer.complete();
        });
    }

    searchPaymentModes(value: string) {
        return Observable.create(observer => {
            this.get().subscribe((paymentModeModels: PaymentModeModel[]) => {
                let filteredPaymentModes = [];
                if (value) {
                    const textSearch = value.toLowerCase();
                    filteredPaymentModes = paymentModeModels.filter(x => x.paymode.toLowerCase().includes(textSearch));
                }

                observer.next(filteredPaymentModes);
                observer.complete();
            });
        });
    }

    getDefaultPaymentModes(pageType = DefaultPaymentMethodPageType.payment): Observable<PaymentModeModel[]> {
        return Observable.create(observer => {
            const defaultPaymentMethodCodes = this.defaultPaymentMethodRepository.get()
                .filter(x => x.pageType === pageType).map(x => x.code);

            const result = [];
            this.get().subscribe((paymentModeModels: PaymentModeModel[]) => {
                defaultPaymentMethodCodes.forEach(defaultPaymentMethodCode => {
                    const corresponding = paymentModeModels.find(x => x.code === defaultPaymentMethodCode);
                    if (corresponding) {
                        result.push(corresponding);
                    }
                });
                observer.next(result);
                observer.complete();
            });
        });
    }
}
