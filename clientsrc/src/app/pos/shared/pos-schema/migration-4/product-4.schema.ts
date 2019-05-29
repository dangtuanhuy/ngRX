import { SchemaNames } from '../../constants/schema-name.constant';

export const Product4Schema = {
    name: SchemaNames.product,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        description: 'string',
        categoryId: 'string',
        isDelete: 'bool',
        createdDate: 'date',
        updatedDate: 'date'
    }
};
