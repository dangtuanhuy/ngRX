export class TransferInRequestModel {
    fromLocationId: string;
    toLocationId: string;
    fromDate: string;
    toDate: string;
}

export class AddTransferInRequestModel {
    inventoryTransactionTransferInsModel: Array<InventoryTransactionTransferInRequestModel>;
}


export class InventoryTransactionTransferInRequestModel {
    id: string;
    productId: string;
    variantId: string;
    stockTypeId: string;
    quantity: number;
    stockTransactionRefId: string;
    transactionRefId: string;
    inventoryTransactionTransferNumber: string;
    inventoryTransactionId: string;
    inventoryTransactionFromLocation: string;
    inventoryTransactionToLocation: string;
    inventorytransactionRefId: string;
}

export class InventoryTransactionTransferInModel {
    id: string;
    transferNumber: string;
    fromLocationId: string;
    toLocationId: string;
    createDate: string;
    inventoryTransactionRefId: string;
    inventoryTransactionTransferOutProducts: Array<InventoryTransactionTransferInProductItem>;
}

export class InventoryTransactionTransferInProductModel {
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

export class InventoryTransactionTransferInProductItem {
    public id: string;
    public productId: string;
    public variantId: string;
    public stockTypeId: string;
    public quantity: number;
    public stockTransactionRefId: string;
    public transactionRefId: string;
}


export class InventoryTransactionTransferInViewModel {
    id: string;
    transferNumber: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocation: string;
    toLocation: string;
    createdDate: string;
    inventoryTransactionRefId: string;
    inventoryTransactionTransferProducts: Array<InventoryTransactionTransferInProductModel>;
    constructor(data: any) {
        this.id = data.id;
        this.transferNumber = data.transferNumber;
        this.fromLocation = data.fromLocation;
        this.toLocation = data.toLocation;
        this.createdDate = data.createdDate;
    }
}

export class InventoryTransactionTransferInItemViewModel {
    id: string;
    productId: string;
    isVariantsLoading: boolean;
    variantId: string;
    variants: VariantModel[];
    stockTypeId: string;
    quantity: number;
    maxQuantity: number;
    stockTransactionRefId: string;
    transactionRefId: string;
    inventoryTransactionTransferNumber: string;
    inventoryTransactionId: string;
    inventoryTransactionFromLocation: string;
    inventoryTransactionToLocation: string;
    inventorytransactionRefId: string;
}


export class VariantModel {
    id: string;
    name: string;
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
