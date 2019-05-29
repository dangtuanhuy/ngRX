import { EntityBase } from './entity-base';

export class Variant extends EntityBase {
  variantId: string;
  productId: string;
  priceId: string;
  stockTypeId: string;
  stockType: string;
  description: string;
  listPrice: number;
  staffPrice: number;
  memberPrice: number;
  quantity: number;
  skuCode: string;
  locationId: string;
  isDelete: boolean;
}

export class VariantModel extends Variant {
  locationName: string;
}

export class VariantStockBalanceModel {
  variantId: string;
  quantity: number;
  createdDate: Date;
}
