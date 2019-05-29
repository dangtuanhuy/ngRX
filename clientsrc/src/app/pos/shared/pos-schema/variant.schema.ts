import { SchemaNames } from '../constants/schema-name.constant';

export const VariantSchema = {
    name: SchemaNames.variant,
    primaryKey: 'id',
    properties: {
        id: 'string',
        variantId: 'string',
        productId: 'string',
        priceId: 'string',
        stockTypeId: 'string',
        stockType: 'string',
        description: 'string',
        listPrice: 'double',
        staffPrice: 'double',
        memberPrice: 'double',
        locationId: 'string',
        quantity: 'int',
        skuCode: 'string',
        isDelete: 'bool'
    }
};
