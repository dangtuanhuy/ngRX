export class PaymentMethod {
    id: string;
    code: string;
    paymode: string;
    icon: string;
    slipno: string;
    isDelete: boolean;

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

export class PaymentModeModel extends PaymentMethod {
    description: string;
}

export class PaymentModeViewModel extends PaymentModeModel {
    amount: number;
}

export function calculatePaymentPaid(paymentModes: PaymentModeViewModel[]) {
    let totalPaid = 0;
    if (Array.isArray(paymentModes)) {
        paymentModes.forEach(item => {
            const amount = Number(item.amount);
            totalPaid += (amount ? amount : 0);
        });
    }

    return parseFloat(String(totalPaid));
}


