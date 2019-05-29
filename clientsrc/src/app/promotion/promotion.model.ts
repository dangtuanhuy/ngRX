export class PromotionModel {
    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.status = item.status;
        this.fromDate = item.fromDate;
        this.toDate = item.toDate;
        this.promotionDetail = item.promotionDetail;
        this.locations = item.locations;
        this.promotionTypeId = item.promotionTypeId;
        this.promotionDetailId = item.promotionDetailId;
        this.createdBy = item.createdBy;
        this.createdDate = item.createdDate;
        this.updatedBy = item.updatedBy;
        this.updatedDate = item.updatedDate;
    }
    id: string;
    name: string;
    description: string;
    promotionTypeId: number;
    promotionDetailId: string;
    status: PromotionStatus;
    fromDate: Date;
    toDate: Date;
    promotionDetail: PromotionDetailModel;
    locations: LocationModel[];
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
}

export class PromotionDetailModel {
    id: string;
    discountTypeId: DiscountType;
    value: number;
    isUseCouponCodes: boolean;
    isUseConditions: boolean;
    createdDate: Date;
    updatedDate: Date;
    condition: ConditionModel;
    couponCodes: CouponCodeModel[];
}

export class TypeModel {
    id: number;
    typeName: string;
}

export class LocationModel {
    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.address = item.address;
        this.locationCode = item.locationCode;
        this.contactPerson = item.contactPerson;
        this.phone1 = item.phone1;
        this.phone2 = item.phone2;
    }
    id: string;
    name: string;
    address: string;
    locationCode: string;
    contactPerson: string;
    phone1: string;
    phone2: string;
}

export enum PromotionType {
    Discount = 1,
    Bundle = 2,
    DiscountManual = 3
}

export enum PromotionStatus {
    Default = 0,
    Active = 1,
    InActive = 2
}

export const PromotionTypes = {
    'Discount': PromotionType.Discount,
    'Bundle': PromotionType.Bundle,
    'DiscountManual': PromotionType.DiscountManual
};

export enum DiscountType {
    Default = 0,
    Amount = 1,
    Percent = 2
}

export const DiscountTypes = {
    'Amount': DiscountType.Amount,
    'Percent': DiscountType.Percent
};

export const PromotionSelection = {
    'code': 'code',
    'condition': 'condition'
};

export class ConditionModel {
    id: string;
    operatorTypeId: string;
    value: number;
    promotionDetailId: string;
    conditionTypeId: number;
    createdBy: string;
    updatedBy: string;
}

export enum ConditionType {
    TotalPrice = 1,
    TotalQuantity = 2
}

export enum OperatorType {
    Equal = 1,
    NotEqual = 2,
    GreaterThan = 3,
    GreaterThanOrEqualTo = 4,
    LessThan = 5,
    LessThanOrEqualTo = 6
}

export class CouponCodeModel {
    id: string;
    code: string;
    isUsed: boolean;
    isActive: boolean;
    promotionDetailId: string;
}

export class PromotionModelToDisplay {
    constructor(item: any) {
        this.id = item.id;
        this.name = item.name;
        this.description = item.description;
        this.status = item.status;
        this.fromDate = item.fromDate;
        this.toDate = item.toDate;
        this.locations = item.locations;
        this.promotionType = item.promotionType;
        this.createdBy = item.createdBy;
        this.createdDate = item.createdDate;
        this.updatedBy = item.updatedBy;
        this.updatedDate = item.updatedDate;
    }
    id = '';
    name = '';
    description = '';
    promotionType = '';
    status = '';
    fromDate = '';
    toDate = '';
    locations = '';
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
}
