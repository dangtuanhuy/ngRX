import { SchemaNames } from '../../constants/schema-name.constant';

export const Location5Schema = {
    name: SchemaNames.location,
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        address: 'string'
    }
};
