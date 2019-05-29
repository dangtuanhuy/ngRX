import { AllocationTransactionModel } from '../allocation-transaction/allocation-transaction.model';
import { FieldValue } from '../fields/field-base/field-value';

export class TransferOutRequestModel {
    fromLocationId: string;
    toLocationId: string;
    fromDate: string;
    toDate: string;
}

export class AllocationTransactionByListIdModel {
    allocationTransactionListId: string[];
    allocationTransactions: Array<AllocationTransactionModel>;
}

export class AddTransferOutRequestModel {
    fromLocationId: string;
    toLocationId: string;
    allocationTransferOutProducts: Array<AllocationTransferOutProductModel>;
}

export class AllocationTransferOutProductModel {
    stockTransactionRefId: string;
    transactionRefId: string;
    productId: string;
    variantId: string;
    quantity: number;
}


export class AllocationTransactionTransferOutItemViewModel {
    id: string;
    stockAllocationName: string;
    stockAllocationId: string;
    productId: string;
    isVariantsLoading: boolean;
    variantId: string;
    variants: VariantModel[];
    quantity: number;
    maxQuantity: number;
    stockOnHand: number;
}

export class TransferOutItemViewModel {
    id: string;
    productId: string;
    variantId: string;
    variant: VariantModel;
    quantity: number;
    variants: VariantModel[];
    stockOnHand: number;
    isVariantsLoading: boolean;
}

export class VariantModel {
    id: string;
    name: string;
    fieldValues: FieldValue<any>[];
}

export class StockAllocationRequest {
    listStockAllocation: Array<StockAllocation>;
}

export class AllocationRequest {
    ListId: string[];
}

export class StockAllocation {
    gIWDName: string;
    gIWDDescription: string;
    fromLocationId: string;
    toLocationId: string;
    allocationProducts: Array<StockAllocationProductModel>;
}

export class StockAllocationProductModel {
    variantId: string;
    stockTypeId: string;
    quantity: number;
}


export class InventoryTransactionTransferOutProductModel {
    id: string;
    stockTransactionRefId: string;
    productId: string;
    productName: string;
    transactionRefId: string;
    variantId: string;
    stockTypeId: string;
    quantity: number;
    isVariantsLoading: boolean;
    variants: VariantModel[];
}



export class InventoryTransactionTransferOutViewModel {
    id: string;
    transferNumber: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocation: string;
    toLocation: string;
    createdDate: string;
    inventoryTransactionRefId: string;
    inventoryTransactionTransferProducts: Array<InventoryTransactionTransferOutProductModel>;
    constructor(data: any) {
        this.id = data.id;
        this.transferNumber = data.transferNumber;
        this.fromLocation = data.fromLocation;
        this.toLocation = data.toLocation;
        this.createdDate = data.createdDate;
    }
}
