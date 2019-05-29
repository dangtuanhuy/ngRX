import { SchemaNames } from '../constants/schema-name.constant';

export const AppSettingSchema = {
    name: SchemaNames.appSetting,
    primaryKey: 'id',
    properties: {
        id: 'string',
        key: 'string',
        value: 'string'
    }
};
