import { InventoryTransactionStatusEnum } from 'src/app/shared/constant/inventory-transaction.constant';
import { ProductListModel } from '../products/product';

export class GIWModel {
    gIWDName: string;
    gIWDDescription: string;
    fromLocationId: string;
    toLocationId: string;
    gIWItems: Array<GIWItemModel>;
}

export class StockTypeModel {
    id: string;
    name: string;
    code: string;
    description: string;
}

export class GIWItemModel {
    purchaseOrderId: string;
    variantId: string;
    stockTypeId: string;
    barCodes: string[];
    quantity: number;
}

export class StockTransaction {
    public id: string;
    public transactionTypeId: string;
    public stockTypeId: string;
    public variantId: string;
    public fromLocationId: string;
    public toLocationId: string;
    public quantity: number;
    public balance: number;
    public inventoryTransactionId: string;
    public referenceId: string;
    public balanceRef: number;
    public stockTransactionRefId: string;
    constructor(item?: any) {
        if (!item) { return; }
        this.id = item.id;
        this.transactionTypeId = item.transactionTypeId;
        this.stockTypeId = item.stockTypeId;
        this.variantId = item.variantId;
        this.fromLocationId = item.fromLocationId;
        this.toLocationId = item.toLocationId;
        this.quantity = item.quantity;
        this.balance = item.balance;
        this.inventoryTransactionId = item.inventoryTransactionId;
        this.referenceId = item.referenceId;
        this.balanceRef = item.balanceRef;
        this.stockTransactionRefId = item.stockTransactionRefId;
    }
}

export class GenerateBarCodeCommand {
    public variantIds: string[];
}


export class InventoryTransactionGoodsInwardViewModel {
    id: string;
    transferNumber: string;
    goodsInwardNumber: string;
    fromLocationId: string;
    toLocationId: string;
    fromLocation: string;
    toLocation: string;
    createdDate: string;
    inventoryTransactionRefId: string;
    status: string;
    inventoryTransactionTransferProducts: Array<InventoryTransactionGoodsInwardProductModel>;
    products?: TransferProductModel[];
    constructor(data: any) {
        this.id = data.id;
        this.goodsInwardNumber = data.transferNumber;
        this.fromLocation = data.fromLocation;
        this.toLocation = data.toLocation;
        this.createdDate = data.createdDate;
    }
}
export class TransferProductModel {
    id: string;
    name: string;
    variants: TransferVariantModel[];
}
export class TransferVariantModel {
    id: string;
    name: string;
}
export class InventoryTransactionGoodsInwardProductModel {
    id: string;
    stockTransactionRefId: string;
    productId: string;
    transactionRefId: string;
    variantId: string;
    stockTypeId: string;
    quantity: number;
    isVariantsLoading: boolean;
    variants: TransferVariantModel[];
}

export class VariantModel {
    id: string;
    name: string;
}

export class UpdateGIWStatusModel {
    id: string;
    status: InventoryTransactionStatusEnum;
    constructor(inventoryTransactionId: string, status: InventoryTransactionStatusEnum) {
        this.id = inventoryTransactionId;
        this.status = status;
    }
}

export class FilterRequestModel {
    statusIds: string[];
    toLocationIds: string[];
    fromLocationIds: string[];
    queryString: string;
    constructor() {
        this.statusIds = [];
        this.toLocationIds = [];
        this.fromLocationIds = [];
        this.queryString = '';
    }
}

export const GIWStatus = {
    'Pending': InventoryTransactionStatusEnum.Pending,
    'Partial': InventoryTransactionStatusEnum.Partial,
    'Allocated': InventoryTransactionStatusEnum.Allocated
};
