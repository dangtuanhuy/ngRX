import { SchemaNames } from '../constants/schema-name.constant';

export const ProductSchema = {
    name: SchemaNames.product,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        description: 'string',
        categoryId: 'string',
        isDelete: 'bool'
    }
};
