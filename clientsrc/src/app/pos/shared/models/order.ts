import { EntityBase } from './entity-base';
import { OrderItemModel } from './order-item';
import { OrderPromotion } from './order-promotion';
import { OrderPayment } from './order-payment';
import { StringExtension } from '../helpers/string.extension';
import { OrderTransactionType } from '../enums/order-transaction-type.enum';

export class Order extends EntityBase {
    customerId: string;
    amount: number;
    gst: number;
    gstInclusive: boolean;
    billNo: string;
    change: number;
    createdDate: Date;
    isDelete = false;
    synced = false;
    cashierId: string;
    orderTransactionType: OrderTransactionType;
    oldOrderId: string;
}

export class OrderModel extends Order {
    orderItems: OrderItemModel[] = [];
    orderPromotions: OrderPromotion[] = [];
    orderPayments: OrderPayment[] = [];
    customerName: string;
    customerCode: string;
    customerPhoneNumber: string;
    cashierName: string;

    map(values: object = {}) {
        Object.assign(this, values);
    }
}

export function generateBillNo(billNoPrefix: string, deviceNo: string) {
    const now = new Date();
    let result = billNoPrefix + deviceNo;
    result += StringExtension.ensureTheLengthEnoughWithNumber(String(now.getDate()), 2)
        + StringExtension.ensureTheLengthEnoughWithNumber(String(now.getMonth() + 1), 2)
        + StringExtension.ensureTheLengthEnoughWithNumber(String(now.getFullYear()), 4);

    result += StringExtension.ensureTheLengthEnoughWithNumber(String(now.getHours()), 2);
    result += StringExtension.ensureTheLengthEnoughWithNumber(String(now.getMinutes()), 2);
    result += StringExtension.ensureTheLengthEnoughWithNumber(String(now.getSeconds()), 2);

    return result;
}
