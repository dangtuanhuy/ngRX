export class StoreSaleTargetModel {
  public id: string;
  public name: string;
  public address: string;
  public currentTarget: number;
  public saleTargets: Array<SaleTargetModel>;
}

export class SaleTargetModel {
    public id: string;
    public storeId: string;
    public fromDate: string;
    public toDate: string;
    public target: number;
    constructor(data: any) {
        this.id = data.id;
        this.storeId = data.storeId;
        this.fromDate = data.fromDate;
        this.toDate = data.toDate;
        this.target = data.target;
    }
}

export class StoreSaleTargetViewModel {
    public id: string;
    public name: string;
    public address: string;
    public currentTarget: number;
    public saleTargets: Array<SaleTargetViewModel>;
}

export class SaleTargetViewModel {
    public id: string;
    public storeId: string;
    public fromDate: string;
    public toDate: string;
    public target: number;
    public currentTarget: number;
    public isCurrent: boolean;
    public isEdit: boolean;
    public canEdit: boolean;
    constructor(data: any) {
        this.storeId = data.storeId;
        this.fromDate = data.fromDate;
        this.toDate = data.toDate;
        this.target = data.target;
        this.currentTarget = this.target;
    }
}

export class AddSaleTargetModel {
    public storeId: string;
    public fromDate: Date;
    public toDate: Date;
    public target: number;
    constructor(data: any) {
        this.storeId = data.storeId;
        this.fromDate = data.fromDate;
        this.toDate = data.toDate;
        this.target = data.target;
    }
}

export class UpdateSaleTargetModel {
    public id: string;
    public target: number;
    public storeId: string;
    constructor(id: string, target: number) {
        this.id = id;
        this.target = target;
    }
}

export class ReportSaleTargetModel {
    public storeId: string;
    public store: string;
    public saleTarget: number;
    public currentSale: number;
    public shortFall: number;
    public fromDate: string;
    public toDate: string;
    constructor (data: any) {
        this.storeId = data.storeId;
        this.store = data.store;
        this.saleTarget = data.saleTarget;
        this.currentSale = data.currentSale;
        this.shortFall = data.shortFall;
        this.fromDate = data.fromDate;
        this.toDate = data.toDate;
    }
}

export class ChannelModel {
    public id: string;
    public name: string;
}
