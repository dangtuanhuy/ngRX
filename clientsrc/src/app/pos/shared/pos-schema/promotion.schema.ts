import { SchemaNames } from '../constants/schema-name.constant';

export const PromotionSchema = {
    name: SchemaNames.promotion,
    primaryKey: 'id',
    properties: {
        id: 'string',
        promotionDetailId: 'string',
        name: 'string',
        description: 'string',
        promotionTypeId: 'int',
        value: 'double',
        promotionStatus: 'int',
        discountTypeId: 'int',
        isUseCouponCodes: 'bool',
        isUseConditions: 'bool',
        fromDate: 'date',
        toDate: 'date'
    }
};
