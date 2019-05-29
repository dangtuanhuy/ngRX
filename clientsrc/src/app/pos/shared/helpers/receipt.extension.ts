import { OrderModel } from '../models/order';
import { PriceExtension } from './price.extension';
import { OrderItemModel } from '../models/order-item';
import { SaleReceipt, SaleReceiptItem, SalePromotion, SaleReceiptItemPromotion, SalePayment } from '../models/device-hub/sale-receipt';
import { DiscountType } from '../enums/discount-type.enum';
import { PaymentModeModel } from '../models/payment-mode.model';

export class ReceiptExtension {
    public static buildReceiptFromOrderModel(order: OrderModel, cashierName: string, storeName: string, storeAddress: string
        , paymentModes: PaymentModeModel[]) {
        const netQuantityTotal = this.calculateNetQuantity(order.orderItems);

        const receipt = new SaleReceipt();
        receipt.billNo = ''; // PHI TODO
        receipt.createdDate = order.createdDate;
        receipt.netTotal = order.amount;
        receipt.cashierName = cashierName;
        receipt.counterName = ''; // PHI TODO
        receipt.gst = order.gst;
        receipt.gstInclusive = order.gstInclusive;
        receipt.netQuantity = netQuantityTotal;
        receipt.exchangeDayQuantity = 7; // PHI TODO: get from app setting.
        receipt.customerName = order.customerName;
        receipt.customerCode = order.customerCode;
        receipt.customerPhoneNumber = order.customerPhoneNumber;
        receipt.billNo = order.billNo;
        receipt.change = order.change;
        receipt.storeName = storeName;
        receipt.storeAddress = storeAddress;

        let totalPriceOfReceiptItems = 0;
        let countItem = 1;
        order.orderItems.forEach(orderItem => {
            const saleReceiptItem = new SaleReceiptItem();
            saleReceiptItem.no = countItem;
            saleReceiptItem.name = orderItem.variant;
            saleReceiptItem.quantity = orderItem.quantity;
            saleReceiptItem.price = orderItem.price;
            saleReceiptItem.amount = orderItem.price * orderItem.quantity;
            saleReceiptItem.skuCode = orderItem.skuCode;
            receipt.items.push(saleReceiptItem);
            totalPriceOfReceiptItems += saleReceiptItem.amount;
            countItem++;

            saleReceiptItem.receiptItemPromotions = [];
            const orderItemPromotions = orderItem.orderItemPromotions;
            if (Array.isArray(orderItemPromotions)) {
                orderItemPromotions.forEach(orderItemPromotion => {
                    const receiptItemPromotion = new SaleReceiptItemPromotion();
                    receiptItemPromotion.description = 'Item Discount';
                    receiptItemPromotion.discountType = orderItemPromotion.discountType;
                    receiptItemPromotion.value = orderItemPromotion.value;
                    if (orderItemPromotion.discountType === DiscountType.Money) {
                        receiptItemPromotion.amount = -1 * orderItemPromotion.value;
                    }

                    if (orderItemPromotion.discountType === DiscountType.Percent) {
                        receiptItemPromotion.amount = -1 * orderItemPromotion.value * saleReceiptItem.amount / 100;
                    }

                    saleReceiptItem.receiptItemPromotions.push(receiptItemPromotion);
                    totalPriceOfReceiptItems += receiptItemPromotion.amount;
                });
            }
        });
        receipt.totalAmount = totalPriceOfReceiptItems;
        if (receipt.gstInclusive) {
            receipt.gstInclusiveAmount = this.calculateGSTInclusive(totalPriceOfReceiptItems, receipt.gst);
        } else {
            receipt.gstNoInclusiveAmount = this.calculateGSTNotInclusive(receipt.totalAmount, receipt.gst);
        }

        const discountPrices: number[] = [];
        order.orderPromotions.forEach(orderPromotion => {
            const salePromotion = new SalePromotion();
            salePromotion.description = orderPromotion.reason;
            salePromotion.discountType = orderPromotion.discountType;
            salePromotion.value = orderPromotion.value;

            if (orderPromotion.discountType === DiscountType.Money) {
                const amount = -1 * salePromotion.value;
                discountPrices.push(amount);
                salePromotion.amount = amount;
            }
            if (orderPromotion.discountType === DiscountType.Percent) {
                const amount = -1 * salePromotion.value * receipt.totalAmount / 100;
                discountPrices.push(amount);
                salePromotion.amount = amount;
            }

            receipt.salePromotions.push(salePromotion);
        });

        receipt.salePayments = [];
        order.orderPayments.forEach(orderPayment => {
            const salePayment = new SalePayment();
            const correspondingPaymentMode = paymentModes.find(x => x.code === orderPayment.paymentCode);
            salePayment.code = orderPayment.paymentCode;
            salePayment.name = correspondingPaymentMode ? correspondingPaymentMode.paymode : orderPayment.paymentCode;
            if (salePayment.code === 'CASH') {
                salePayment.amount = PriceExtension.round(orderPayment.amount + receipt.change, 2);
            } else {
                salePayment.amount = PriceExtension.round(orderPayment.amount, 2);
            }

            salePayment.decimalAmount = salePayment.amount.toFixed(2);

            receipt.salePayments.push(salePayment);
        });

        return receipt;
    }

    public static calculateNetQuantity(orderItems: OrderItemModel[]): any {
        let result = 0;
        orderItems.forEach(x => {
            result += x.quantity;
        });

        return result;
    }

    private static calculateGSTInclusive(totalNet: number, gst: number) {
        return PriceExtension.round((totalNet * gst / (gst + 100)), 2);
    }

    private static calculateGSTNotInclusive(total: number, gst: number) {
        return PriceExtension.round(total * gst / 100, 2);
    }
}
