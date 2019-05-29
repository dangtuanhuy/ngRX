export class OrderModel {
    public id: string;
    public storeId: string;
    public orderItems: Array<OrderItem>;
}
export class OrderItem {
    public id: string;
    public variantId: string;
    public variantName: string;
    public quantity: number;
    public amount: number;
    public costValue: number;
    public price: number;
}

export class SalePerformanceRequest {
    public orderItems: Array<OrderItem>;
    public locationId: string;
    public fromDate: Date;
    public toDate: Date;
}
