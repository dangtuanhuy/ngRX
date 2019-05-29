import { FieldValue } from '../fields/field-base/field-value';


export interface ProductModel {
    id: string;
    name: string;
    description: string;
    sections: Section[];
    variants: VariantModel[];
}

export interface Section {
    name: string;
    orderSection: number;
    isVariantField: boolean;
    fieldValues: FieldValue<any>[];
}

export interface ProductListModel {
    id: string;
    name: string;
    variant: VariantModel;
}

export interface ProductListViewModel {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    categoryName: string;
    createdBy: string;
    createdDate: string;
    updatedBy: string;
    updatedDate: string;
    isDelete: string;
}

export interface ProductModelRequest {
    id: string;
    name: string;
    description: string;
    fieldTemplateId: string;
    productFields: FieldValueModel[];
    variants: VariantModelRequest[];
    categoryId: string;
    categoryName: string;
}

export interface LoadViewProductModel {
    id: string;
    name: string;
    description: string;
    fieldTemplateId: string;
    fieldTemplateName: string;
    categoryId: string;
    sections: Section[];
    variants: VariantModel[];
}

export interface FieldValueModel {
    id: string;
    fieldId: string;
    fieldValue: string;
}


export interface Product {
    id: string;
    fields: FieldValue<any>[];
}

export interface VariantModelRequest {
    variantFields: FieldValueModel[];
    prices: PriceModel;
    code: string;
}

export interface PriceModel {
    listPrice: number;
    staffPrice: number;
    memberPrice: number;
    preOrderPrice: number;
}

export interface VariantModel {
    id: string;
    fieldValues: FieldValue<any>[];
    price: PriceModel;
    name: string;
    orderSection: number;
    isVariantField: boolean;
    code: string;
}

export enum PriceEnum {
    listPrice,
    staffPrice,
    memberPrice,
    preorderPrice
}

export const PriceEnums = {
    listPrice: PriceEnum.listPrice,
    staffPrice: PriceEnum.staffPrice,
    memberPrice: PriceEnum.memberPrice,
    preorderPrice: PriceEnum.preorderPrice
};

export class BarCodeProductViewModel {
    productId: string;
    productName: string;
    variantSKU: string;
    barCodesVariant: BarCodeVariantViewModel[];
}

export class BarCodeVariantViewModel {
    variantId: string;
    fields: FieldsViewModel[];
    barCodes: BarCodeVariantItemViewModel[];
}

export class BarCodeVariantItemViewModel {
    id: string;
    code: string;
}

export class FieldsViewModel {
    public name: string;
    public value: string;
}
