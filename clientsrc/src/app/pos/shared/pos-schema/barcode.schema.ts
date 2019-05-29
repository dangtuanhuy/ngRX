import { SchemaNames } from '../constants/schema-name.constant';

export const BarCodeSchema = {
    name: SchemaNames.barCode,
    primaryKey: 'id',
    properties: {
        id: 'string',
        variantId: 'string',
        code: 'string',
        createdDate: 'date',
        updatedDate: 'date',
        isDelete: 'bool'
    }
};
