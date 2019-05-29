export class InventoryTransactionGoodsReturnViewModel {
    id: string;
    transferNumber: string;
    code: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocationName: string;
    toLocationName: string;
    createdDate: string;
    items: InventoryTransactionGoodsReturnProductModel[];
    constructor(data: any) {
        this.id = data.id;
        this.transferNumber = data.transferNumber;
        this.code = data.code;
        this.fromLocationName = data.fromLocationName;
        this.fromLocationId = data.fromLocationId;
        this.toLocationId = data.toLocationId;
        this.toLocationName = data.toLocationName;
        this.createdDate = data.createdDate;
        this.items = data.items;
    }
}

export class InventoryTransactionGoodsReturnListViewModel {
    id: string;
    transferNumber: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocationName: string;
    toLocationName: string;
    createdDate: string;
    constructor(data: any) {
        this.id = data.id;
        this.transferNumber = data.transferNumber;
        this.fromLocationName = data.fromLocationName;
        this.fromLocationId = data.fromLocationId;
        this.toLocationId = data.toLocationId;
        this.toLocationName = data.toLocationName;
        this.createdDate = data.createdDate;
    }
}

export class InventoryTransactionGoodsReturnProductModel {
    id: string;
    productId: string;
    stockTransactionRefId: string;
    transactionRefId: string;
    variantId: string;
    stockTypeId: string;
    quantity: number;
    variants: VariantModel[];
    isVariantsLoading: boolean;
}

export class VariantModel {
    id: string;
    name: string;
}

export class ReturnOrderModel {
    id: string;
    name: string;
    description: string;
    vendorId: string;
    items: ReturnOrderItemModel[];
}

export class ReturnOrderItemModel {
    Id: string;
    productName: string;
    stockTypeId: string;
    stockTypeName: string;
    barCodes: string[];
    quantity: number;
    variant: ROVariantModel;
}

export class ROVariantModel {
    id: string;
    fieldValues: ROFieldValueModel[];
}

export class ROFieldValueModel {
    name: string;
    value: string;
}

export class ReturnOrderListModel {
    id: string;
    name: string;
    description: string;
    vendor: string;
}

export class ReturnOrderItemViewModel {
    roId: string;
    roName: string;
    roItemId: string;
    productName: string;
    stockTypeId: string;
    stockTypeName: string;
    variant: ROVariantModel;
    quantity: number;
}

export class GRTModel {
    name: string;
    description: string;
    fromLocationId: string;
    toLocationId: string;
    items: Array<GRTItemModel>;
}

export class GRTItemModel {
    returnOrderId: string;
    variantId: string;
    stockTypeId: string;
    quantity: number;
}
