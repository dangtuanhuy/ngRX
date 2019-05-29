import { SchemaNames } from '../constants/schema-name.constant';

export const CategorySchema = {
    name: SchemaNames.category,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        description: 'string',
        isDelete: 'bool'
    }
};
