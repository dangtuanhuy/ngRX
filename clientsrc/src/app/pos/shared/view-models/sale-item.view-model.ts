import { SaleItemType } from '../enums/sale-item-type.enum';
import { PriceExtension } from '../helpers/price.extension';

export class SaleItemViewModel {
    id: string;
    priceId: string;
    variantId: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
    skuCode: string;
    type: SaleItemType;
}

export function calculateSaleItemsTotalPrice(saleItems: SaleItemViewModel[]) {
    let totalPrice = 0;
    if (Array.isArray(saleItems)) {
        saleItems.forEach(item => {
            totalPrice += item.amount;
        });
    }

    return PriceExtension.round(totalPrice, 2);
}
