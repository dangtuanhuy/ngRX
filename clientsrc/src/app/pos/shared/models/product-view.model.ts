import { Variant } from './variant';
import { SaleItemPromotion } from './order-item-promotion';

export class ProductViewModel extends Variant {
    price: number;
    amount: number;
    quantity: number;
    saleItemPromotions: SaleItemPromotion[] = [];
}

export function calculateProductsTotalPrice(products: ProductViewModel[]) {
    let totalPrice = 0;
    if (Array.isArray(products)) {
        products.forEach(item => {
            const quantity = Number(item.quantity);
            const price = Number(item.price);
            totalPrice += (quantity ? quantity : 0) * (price ? price : 0);
        });
    }

    return parseFloat(String(totalPrice));
}
