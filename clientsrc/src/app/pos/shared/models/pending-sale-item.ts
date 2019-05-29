import { EntityBase } from './entity-base';

export class PendingSaleItem extends EntityBase {
    pendingSaleId: string;
    variantId: string;
    priceId: string;
    stockTypeId: string;
    quantity: number;
    amount: number;
}

export class PendingSaleItemModel extends PendingSaleItem {
    variant: string;
    listPrice: number;
    memberPrice: number;
    staffPrice: number;
}
