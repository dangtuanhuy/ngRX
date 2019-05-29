import { SchemaNames } from '../constants/schema-name.constant';

export const MigrationSchema = {
    name: SchemaNames.migration,
    primaryKey: 'id',
    properties: {
        id: 'string'
    }
};
