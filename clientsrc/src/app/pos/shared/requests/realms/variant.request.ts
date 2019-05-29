import { Variant } from '../../models/variant';

export class StockTypeAndVariantIdAndPriceRequest {
    stockTypeId: string;
    variantId: string;
    priceId: string;
}

export class VariantByStockTypeAndVariantIdAndPriceRequest {
    stockTypeAndVariantIdAndPriceRequest: StockTypeAndVariantIdAndPriceRequest[] = [];
}

export class VariantByStockTypeAndVariantIdAndPriceResponse {
    variants: Variant[] = [];
    errors: string[] = [];
}
