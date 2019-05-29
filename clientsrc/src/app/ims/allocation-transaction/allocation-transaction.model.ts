import { AllocationTransactionStatusEnum } from '../../shared/constant/allocation-transaction.constant';
import { FieldValue } from '../fields/field-base/field-value';

export class AllocationTransactionViewModel {
    id: string;
    name: string;
    description: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocation: string;
    toLocation: string;
    deliveryDate: string;
    status: AllocationTransactionStatusEnum;
    allocationTransactionDetails: Array<AllocationTransactionItem>;
    public createdDate?: string;
    public createdBy?: string;
    public updatedDate?: string;
    public updatedBy?: string;
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.fromLocation = data.fromLocation;
        this.toLocation = data.toLocation;
        this.deliveryDate = data.deliveryDate;
        this.status = data.status;
        this.createdBy = data.createdBy;
        this.createdDate = data.createdDate;
        this.updatedBy = data.updatedBy;
        this.updatedDate = data.updatedDate;
    }
}

export class AllocationTransactionModel {
    id: string;
    name: string;
    description: string;
    fromLocationId: string;
    toLocationId: string;
    deliveryDate: string;
    transactionRef: string;
    status: AllocationTransactionStatusEnum;
    allocationTransactionDetails: Array<AllocationTransactionItem>;
}

export class UpdateStatusAllocationTransactionModel {
    id: string;
    status: AllocationTransactionStatusEnum;
}

export class AllocationTransactionDetailModel {
    allocationTransactionId: string;
    stockTypeId: string;
    variantId: string;
    quantity: number;
}

export class AllocationTransactionItem {
    public id: string;
    public productId: string;
    public productName: string;
    public variantId: string;
    public quantity: number;
    public stockOnHand: number;
    public allocationTransactionId: string;
}

export class AllocationTransactionItemViewModel {
    id: string;
    productId: string;
    isVariantsLoading: boolean;
    variantId: string;
    variants: VariantModel[];
    variant: VariantModel;
    quantity: number;
}

export class MassAllocationInfoModel {
    outletInfor: Array<OutletModel>;
    massAllocations: Array<MassAllocationModel>;
}

export class OutletModel {
    id: string;
    name: string;
}

export class MassAllocationModel {
    sku: string;
    giwQuantity: number;
    productName: string;
    variantId: string;
    balance: number;
    remainingBalance: number;
    remaining: number;
    variantFields: Array<VariantViewModel>;
    outlets: Array<OutletQuantityModel>;
}

export class MassAllocationItems {
    outletId: string;
    outletQuantity: number;
    outletName: string;
    sohOutlet: number;
    maxQuantity: number;
    stockRequestId: string;
}

export class OutletQuantityModel {
    id: string;
    quantity: number;
    quantityOnHand: number;
    quantitySold: number;
    maxQuantity: number;
}

export class OutletProduct {
    outletId: string;
    variantId: string;
    quantity: number;
    quantitySold: number;
}

export class VariantViewModel {
    name: string;
    value: string;
}

export class StockTypeModel {
    id: string;
    name: string;
    code: string;
    description: string;
}

export class VariantModel {
    id: string;
    name: string;
    fieldValues: FieldValue<any>[];
}

export interface ProductModel {
    id: string;
    name: string;
    description: string;
}

export const AllocationTransactionStatus = {
    'Draft': AllocationTransactionStatusEnum.Draft,
    'Submitted': AllocationTransactionStatusEnum.Submitted,
    'PartialTransfer': AllocationTransactionStatusEnum.PartialTransfer,
    'Complete': AllocationTransactionStatusEnum.Complete
};
