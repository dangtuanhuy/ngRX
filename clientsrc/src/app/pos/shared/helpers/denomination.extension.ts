import { PaymentModeModel } from '../models/payment-mode.model';
import { OrderPayment } from '../models/order-payment';
import { CashingUp } from '../models/cashing-up';
import { Tender } from '../models/tender';
import { PriceExtension } from './price.extension';

export class DenominationExtension {
    public static buildMergedDenominationsFromOrderPayments(
        openDay: CashingUp,
        tender: Tender,
        paymentModeModels: PaymentModeModel[],
        orderPayments: OrderPayment[]
    ): any {
        if (!paymentModeModels.length || !orderPayments.length) {
            return [];
        }

        const dataSource = [];

        if (openDay) {
            const openDaySource = {
                name: 'Open day',
                paymentCode: 'system-open-day',
                amount: PriceExtension.round(Number(openDay.amount), 2),
                amountDecimal: '0.00'
            };
            openDaySource.amountDecimal = openDaySource.amount.toFixed(2);

            dataSource.push(openDaySource);
        }

        if (tender) {
            const tenderInSource = {
                name: 'Tender',
                paymentCode: 'system-tender-in',
                amount: PriceExtension.round(Number(tender.amount), 2),
                amountDecimal: '0.00'
            };

            dataSource.push(tenderInSource);
        }

        orderPayments.forEach(orderPayment => {
            const existedOrderPayment = dataSource.find(x => x.paymentCode === orderPayment.paymentCode);
            if (existedOrderPayment) {
                existedOrderPayment.amount = (existedOrderPayment.amount + PriceExtension.round(Number(orderPayment.amount), 2));
                existedOrderPayment.amountDecimal = existedOrderPayment.amount.toFixed(2);
            } else {
                const correspondingPayment = paymentModeModels.find(x => x.code === orderPayment.paymentCode);
                const newData = {
                    name: correspondingPayment ? correspondingPayment.paymode : orderPayment.paymentCode,
                    paymentCode: orderPayment.paymentCode,
                    amount: PriceExtension.round(Number(orderPayment.amount), 2),
                    amountDecimal: '0.00'
                };
                newData.amountDecimal = newData.amount.toFixed(2);
                dataSource.push(newData);
            }
        });

        return dataSource;
    }
}
