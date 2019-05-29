export class DashboardModel {
    public locationId: string;
    public locationName: string;
    public items: DashboardItemModel[];
}

export class DashboardItemModel {
    public productId: string;
    public productName: string;
    public items: DashboardItemDetailModel[];
}

export class DashboardItemDetailModel {
    public variantId: string;
    public locationId: string;
    public locationName: string;
    public balance: number;
    public fields: DashboardFieldModel[];
    public sKUCode: string;
}

export class DashboardFieldModel {
    public name: string;
    public value: string;
}

export class DashboardRequestModel {
    public locationId: string;
    public queryText: string;
}
