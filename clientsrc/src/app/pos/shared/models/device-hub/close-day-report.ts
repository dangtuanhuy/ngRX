import { CashingUp } from '../cashing-up';

export class CloseDayReport {
    location: string;
    terminal: string;
    cashier: string;
    shift: number;
    settlementDate: string;

    posCashSales: number;
    totalCurrencies: number;
    tillAmount: number;
    totalCollection: number;
    grandTotal: number;
    systemTotal: number;
    shortageExcess: number;
    paymentModeDetailstTotal: number;
    totalCashAndPaymentModeDetails: number;

    openDay: CashingUp;
    currencies: CloseDayReportCurrency[] = [];
    paymentModeDetails: CloseDayReportPaymentModeDetail[] = [];
}

export class CloseDayReportCurrency {
    value: number;
    quantity: number;
    amount: number;
}

export class CloseDayReportPaymentModeDetail {
    name: string;
    amount: number;
}
