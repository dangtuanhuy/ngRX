import { PurchaseOrderTypeEnum, PurchaseOrderStatusEnum } from 'src/app/shared/constant/purchase-order.constant';
import { ApprovalStatusEnum } from 'src/app/shared/constant/approval.constant';
import { Type } from '@angular/compiler';

export class RequestPurchaseOrderModel {
    public id: string;
    public name: string;
    public description: string;
    public vendorId: string;
    public type: PurchaseOrderTypeEnum;
    public date: string;
    public currencyId: string;
    public purchaseOrderItems: Array<PurchaseOrderItem>;
}

export class PurchaseOrderItem {
    public id: string;
    public product: ProductListModel;
    public variantId: string;
    public stockTypeId: string;
    public quantity: number;
    public purchaseOrderId: string;
    public costValue: number;
    public currencyId: string;
}

export class UpdatePurchaseOrderModel {
    public id: string;
    public name: string;
    public description: string;
    public vendorId: string;
    public vendor: string;
    public type: PurchaseOrderTypeEnum;
    public status: PurchaseOrderStatusEnum;
    public approvalStatus: ApprovalStatusEnum;
    public date: string;
    public purchaseOrderItems: Array<PurchaseOrderItem>;
    public currencyId: string;
}

export class UpdatePurchaseOrderDateModel {
    public id: string;
    public date: string;
}

export class PurchaseOrderModel {
    public id: string;
    public name: string;
    public description: string;
    public vendorId: string;
    public vendor: string;
    public type: PurchaseOrderTypeEnum;
    public status: PurchaseOrderStatusEnum;
    public approvalStatus: ApprovalStatusEnum;
    public currencyId: string;
    public date: string;
    public purchaseOrderItems: Array<PurchaseOrderItem>;
    public poNumber: string;
    public updatedDate: string;
    public createdDate: string;
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.vendor = data.vendor;
        this.type = data.type;
        this.status = data.status;
        this.date = new Date(data.date).toDateString();
        this.approvalStatus = data.approvalStatus;
        this.poNumber = data.poNumber;
        this.updatedDate = data.updatedDate;
        this.createdDate = data.createdDate;
    }
}

export class PurchaseOrderItemViewModel {
    id: string;
    productId: string;
    isVariantsLoading: boolean;
    variants: VariantModel[];
    variant: VariantModel;
    stockTypeId: string;
    quantity: number;
    costValue: number;
    currencyId: string;
    isDuplicate: boolean;
}

export class VariantModel {
    id: string;
    name: string;
    fieldValues: FieldValue<string>[];
}

export class ProductListModel {
    id: string;
    name: string;
}

export interface FieldValue<TValue> {
    name: string;
    value: TValue;
}

export class CurrencyModel {
    id: string;
    name: string;
    code: string;
}

export class TaxTypeModel {
    id: string;
    name: string;
    value: string;
}

export class UserManagerModel {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    constructor(data: any) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fullName = `${data.firstName} ${data.lastName}`;
        this.email = data.email;
    }
}

export class SubmitPurchaseOrderModel {
    purchaseOrderId: string;
    managerId: string;
    constructor(purchaseOrderId: string, managerId: string) {
        this.purchaseOrderId = purchaseOrderId;
        this.managerId = managerId;
    }
}

export class PurchaseOrderViewModel {
    id: string;
    name: string;
    description: string;
    vendor: string;
}

export const PurchaseOrderTypes = {
    'DraftPO': PurchaseOrderTypeEnum.draftPO,
    'PurchaseOrder': PurchaseOrderTypeEnum.purchaseOrder,
    'ReturnedOrder': PurchaseOrderTypeEnum.returnedOrder,
    'DraftRO': PurchaseOrderTypeEnum.draftRO
};

export const PurchaseOrderStatus = {
    'Open Order': PurchaseOrderStatusEnum.openOrder,
    'Received': PurchaseOrderStatusEnum.received,
    'Invoiced': PurchaseOrderStatusEnum.invoiced,
    'Canceled': PurchaseOrderStatusEnum.canceled,
    'Draft': PurchaseOrderStatusEnum.draft,
    'Pending': PurchaseOrderStatusEnum.pending,
};

export const ApprovalStatus = {
    'Pending': ApprovalStatusEnum.pending,
    'Approved': ApprovalStatusEnum.approved,
    'Rejected': ApprovalStatusEnum.rejected,
    'Confirmed': ApprovalStatusEnum.confirmed
};

// PIM
export class PimPurchaseOrder {
    public id: string;
    public name: string;
    public description: string;
    public vendorId: string;
    public approvalStatus: ApprovalStatusEnum;
    constructor(data?: any) {
        if (!data) { return; }
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.vendorId = data.vendorId;
        this.approvalStatus = data.approvalStatus;
    }
}

export class PimPurchaseOrderItem {
    public id: string;
    public variantId: string;
    public stockTypeId: string;
    public quantity: number;
    public purchaseOrderId: string;
    constructor(data?: any) {
        if (!data) { return; }
        this.id = data.id;
        this.variantId = data.variantId;
        this.stockTypeId = data.stockTypeId;
        this.purchaseOrderId = data.purchaseOrderId;
        this.quantity = data.quantity;
    }
}

export class PimPurchaseOrderModel {
    id: string;
    name: string;
    description: string;
    vendorId: string;
    purchaseOrderItems: PimPurchaseOrderItemModel[];
}

export class PimPurchaseOrderItemModel {
    Id: string;
    productName: string;
    stockTypeId: string;
    stockTypeName: string;
    barCodes: string[];
    quantity: number;
    variant: PimVariantModel;
}

export class PimPurchaseOrderItemViewModel {
    poId: string;
    poName: string;
    poItemId: string;
    productName: string;
    stockTypeId: string;
    stockTypeName: string;
    variant: PimVariantModel;
    barCodes: string[];
    isDisableBarCode: boolean;
    quantity: number;
}

export class PimVariantModel {
    id: string;
    fieldValues: PimFieldValueModel[];
}

export class PimFieldValueModel {
    name: string;
    value: string;
}

export class PimVariantViewModel {
    id: string;
    name: string;
}

export class PimPurchaseOrderListModel {
    id: string;
    name: string;
    description: string;
    vendor: string;
}

export class GetPurchaseOrderModel {
    queryText: string;
    status: string;
    stages: string;
    type: string;
    constructor(queryText: string, status: string, stages: string, type: string) {
        this.queryText = queryText;
        this.status = status;
        this.stages = stages;
        this.type = type;
    }
}

export class SalesInvoiceViewModel {
    constructor(e: any) {
        this.id = e.id;
        this.vendorId = e.vendorId;
        this.invoiceDate = e.invoiceDate;
        this.purchaseOrderId = e.purchaseOrderId;
        this.purchaseOrderItems = e.purchaseOrderItems;
        this.soDo = e.soDo;
    }
    id: string;
    vendorId: string;
    invoiceDate: Date;
    purchaseOrderId: string;
    purchaseOrderItems: PurchaseOrderItem[];
    soDo: string;
}

export class InvoiceInfo {
    constructor(e: any) {
        this.soDo = e.soDo;
    }
    soDo: string;
}
