import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentModeModel } from 'src/app/pos/shared/models/payment-mode.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
    paymentModeIconDefault = 'assets/pos/images/pos-paymentmode-cash.png';
    paymentModeList = [
        {
            id: '19954873-D705-4CBB-A170-9A00BDA55FEE', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'CASH', paymode: 'CASH', slipno: ''
        },
        {
            id: '361D9CDD-EAF4-4CB3-B48F-0B933244F101', icon: 'assets/pos/images/pos-paymentmode-nets.png',
            code: 'NETS', paymode: 'NETS', slipno: ''
        },
        {
            id: 'C05FC0B1-E987-49DD-BD76-8D505F92BF2D', icon: 'assets/pos/images/pos-paymentmode-visa.png',
            code: 'VISA', paymode: 'VISA', slipno: ''
        },
        {
            id: '2EF23EDB-38AD-456E-8603-68955FC3D6F1', icon: 'assets/pos/images/pos-paymentmode-cash-master-card.png',
            code: 'MASTER', paymode: 'MASTER', slipno: ''
        },
        {
            id: 'F621CD13-EFB5-4AEB-9D46-CC71DBDBB030', icon: 'assets/pos/images/pos-paymentmode-cash-card.png',
            code: 'CASH-CARD', paymode: 'CASH CARD', slipno: ''
        },
        {
            id: '84F86BFC-193D-467D-BCDA-93BAB5AEF262', icon: 'assets/pos/images/pos-paymentmode-amex.png',
            code: 'AMEX', paymode: 'AMEX', slipno: ''
        },
        {
            id: '326BC9F0-679D-4A40-A868-2AE2E69EC0DF', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'VOUCHER', paymode: 'VOUCHER', slipno: ''
        },
        {
            id: '3BC5859D-FD94-4A41-96AC-977A8538BD94', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'OCBC', paymode: 'OCBC', slipno: ''
        },
        {
            id: '726FE7BF-6079-46B1-9F46-A2FEA2FDE700', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'DBS', paymode: 'DBS', slipno: ''
        },
        {
            id: '8D3AAF5C-2755-4153-9F03-FAC2A9D13573', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'E-WALLET', paymode: 'E-WALLET', slipno: ''
        },
        {
            id: '764C4155-0EB0-4B86-881B-EEEF4E8ABB06', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'E-VOUCHERS', paymode: 'E-VOUCHERS', slipno: ''
        },
        {
            id: '78A9739A-6901-46A4-9FB3-B8B6680AEAD5', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'E-POINT', paymode: 'E-POINT', slipno: ''
        },
        {
            id: '65BEAD10-7D51-403B-8758-9C6AC6FE048F', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'MALL-VOUCHER', paymode: 'MALL VOUCHER', slipno: ''
        },
        {
            id: '78D69779-FD03-4D05-83E6-A1BC2F7831F6', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'SAFRA-VOUCHER', paymode: 'SAFRA VOUCHER', slipno: ''
        },
        {
            id: '7D3BC38F-361C-4EA3-B125-AD45AF8960BE', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'UNIONPAY', paymode: 'UNIONPAY', slipno: ''
        },
        {
            id: '7B2C3469-8B26-4EFB-86E3-B02A0AC58470', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'DBS-INSTALMENT', paymode: 'DBS INSTALMENT', slipno: ''
        },
        {
            id: 'FB755900-5BC0-4792-A3F7-F549F39E54C2', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'OCBC-INSTALMENT', paymode: 'OCBC INSTALMENT', slipno: ''
        },
        {
            id: '634CD6AB-368B-46B9-A7C4-022CA43FAB7B', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'SHOPEE', paymode: 'SHOPEE', slipno: ''
        },
        {
            id: 'EAD46CF0-E0D8-430B-8CD0-FE822A9823F6', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'ALIPAY', paymode: 'ALIPAY', slipno: ''
        },
        {
            id: '06302BE7-9EEA-46F1-968E-DAB9EEBAE29A', icon: 'assets/pos/images/pos-paymentmode-cash.png',
            code: 'DBS-MAX', paymode: 'DBS MAX', slipno: ''
        },
    ];

    constructor() { }

    getPaymentModes(): Observable<PaymentModeModel[]> {
        return Observable.create(observer => {
            observer.next(this.paymentModeList);
            observer.complete();
        });
    }

    searchPaymentModes(value: string) {
        return Observable.create(observer => {
            let filteredPaymentModes = [];
            if (value) {
                const textSearch = value.toLowerCase();
                filteredPaymentModes = this.paymentModeList.filter(x => x.paymode.toLowerCase().includes(textSearch));
            }

            observer.next(filteredPaymentModes);
            observer.complete();
        });
    }

    getDefaultPaymentModes(): Observable<PaymentModeModel[]> {
        return Observable.create(observer => {
            const defaultPaymentModes = this.paymentModeList.filter(x =>
                x.paymode === 'CASH'
                || x.paymode === 'NETS'
                || x.paymode === 'VISA'
                || x.paymode === 'MASTER');

            observer.next(defaultPaymentModes);
            observer.complete();
        });
    }
}
