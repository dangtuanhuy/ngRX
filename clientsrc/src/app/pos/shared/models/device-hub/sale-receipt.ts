import { DiscountType } from '../../enums/discount-type.enum';

export class SaleReceipt {
    billNo: string;
    createdDate: Date;
    cashierName: string;
    counterName: string;
    storeName: string;
    storeAddress: string;
    totalAmount: number;
    gst: number;
    gstInclusiveAmount: number;
    gstNoInclusiveAmount: number;
    gstInclusive: boolean;
    netQuantity: number;
    netTotal: number;
    exchangeDayQuantity: number;
    customerName: string;
    customerCode: string;
    customerPhoneNumber: string;
    change: number;
    items: SaleReceiptItem[] = [];
    salePromotions: SalePromotion[] = [];
    salePayments: SalePayment[] = [];
}

export class SaleReceiptItem {
    no: number;
    name: string;
    skuCode: string;
    quantity: number;
    price: number;
    amount: number;
    receiptItemPromotions: SaleReceiptItemPromotion[] = [];
}

export class SaleReceiptItemPromotion {
    description: string;
    discountType: DiscountType;
    value: number;
    amount: number;
}

export class SalePromotion {
    description: string;
    discountType: DiscountType;
    value: number;
    amount: number;
}

export class SalePayment {
    name: string;
    code: string;
    amount: number;
    decimalAmount: string;
}
