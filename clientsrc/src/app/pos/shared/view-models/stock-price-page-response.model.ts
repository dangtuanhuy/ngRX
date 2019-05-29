import { BasePageReponseModel } from './base-page-response.model';

export class StockPriceViewModel {
    id: string;
    name: string;
    description: string;
    stockVariant: StockVariantModel[] = [];
}

export class StockVariantModel {
    variantId: string;
    priceId: string;
    variant: string;
    listPrice: number;
    memberPrice: number;
    staffPrice: number;
    quantity: number;
}

export class StockPricePagingModel extends BasePageReponseModel {
    stockModels: StockPriceViewModel[];
}

