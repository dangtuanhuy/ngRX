import { BasePageReponseModel } from './base-page-response.model';
import { Product } from '../models/product';
import { VariantModel } from '../models/variant';

export class ProductPagingModel extends BasePageReponseModel {
    products: Product[];
}

export class StockVariantPagingModel extends BasePageReponseModel {
    productId: string;
    variants: VariantModel[];
}
