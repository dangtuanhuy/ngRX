import { StockRequestStatus } from 'src/app/shared/constant/stock-request-status';
import { VariantModel, ProductListModel } from '../products/product';

export class StockRequestModel {
    public id: string;
    public fromLocationId: string;
    public toLocationId: string;
    public locationName: string;
    public subject: string;
    public description: string;
    public stockRequestStatus: StockRequestStatus;
    public createdBy: string;
    public createdDate: string;
    public updatedBy: string;
    public updatedDate: string;
    public dateRequest: string;
    public stockRequestItems: Array<StockRequestItemModel>;
}

export class StockRequestListModel {
    public id: string;
    public fromLocationName: string;
    public toLocationName: string;
    public subject: string;
    public description: string;
    public status: string;
    public createdBy: string;
    public createdDate: string;
    public updatedBy: string;
    public updatedDate: string;
}

export class StockRequestItemModel {
    public id: string;
    public productId: string;
    public productName: string;
    public stockRequestId: string;
    public variant: VariantModel;
    public quantity: number;
}

export class VariantField {
    public name: string;
    public value: string;
}

export class StockRequestModelAddRequest {
    public id: string;
    public fromLocationId: string;
    public toLocationId: string;
    public subject: string;
    public description: string;
    public stockRequestItems: Array<StockRequestItemModelRequest>;
    public dateRequest: Date;
}

export class StockRequestModelUpdateRequest {
    public id: string;
    public fromLocationId: string;
    public toLocationId: string;
    public subject: string;
    public description: string;
    public stockRequestItems: Array<StockRequestItemModelRequest>;
    public dateRequest: Date;
    public IsDeleteRequest: boolean;
}

export class StockRequestItemModelRequest {
    public variant: VariantModel;
    public quantity: number;
}

export class StockTypeViewModel {
    public id: string;
    public name: string;
}

export class StockRequestItemViewModel {
    public id: string;
    public product: ProductListModel;
    public variant: VariantModel;
    public variants: VariantModel[];
    public isVariantsLoading: boolean;
    public quantity: number;
}


export enum StockRequestStatusEnum {
    Opened = 0,
    Submitted = 1,
    Approved = 2,
    Closed = 3,
    Canceled = 4,
    Rejected = 5,
    PartialAllocated = 6,
    Allocated = 7
}


export const EnumStockRequestStatus = {
    'Opened': StockRequestStatusEnum.Opened,
    'Submitted': StockRequestStatusEnum.Submitted,
    'Approved': StockRequestStatusEnum.Approved,
    'Closed': StockRequestStatusEnum.Closed,
    'Canceled': StockRequestStatusEnum.Canceled,
    'Rejected': StockRequestStatusEnum.Rejected,
    'PartialAllocated': StockRequestStatusEnum.PartialAllocated,
    'Allocated': StockRequestStatusEnum.Allocated
};

