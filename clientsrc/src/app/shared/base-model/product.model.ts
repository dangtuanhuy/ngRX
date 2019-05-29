export class ProductModel {
    id: string;
    name: string;
    code: string;
    price: number;
    description: string;
    variants: VariantModel[];

    constructor(values: Object = {}) {
        if (values) {
            Object.assign(this, values);
        }
    }
}

export interface PriceModel {
    listPrice: number;
    staffPrice: number;
    memberPrice: number;
}

export interface VariantModel {
    id: string;
    fieldValues: FieldValue<any>[];
    price: PriceModel;
    name: string;
    orderSection: number;
    isVariantField: boolean;
}

export interface FieldValue<TValue> {
    id: string;
    fieldId: string;
    name: string;
    value: TValue;
    type: FieldType;
    data: TValue[];
}

export enum FieldType {
    Text = 1,
    Numeric = 2,
    RichText = 3,
    Tags = 4,
    PredefinedList = 5,
    EntityReference = 6,
    Checkbox = 7
}

export enum PriceEnum {
    listPrice,
    staffPrice,
    memberPrice
}

export const PriceEnums = {
    listPrice: PriceEnum.listPrice,
    staffPrice: PriceEnum.staffPrice,
    memberPrice: PriceEnum.memberPrice
};
