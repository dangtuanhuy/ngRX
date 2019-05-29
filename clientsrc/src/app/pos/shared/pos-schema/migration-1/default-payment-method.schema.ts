import { SchemaNames } from '../../constants/schema-name.constant';

export const DefaultPaymentMethodSchema = {
    name: SchemaNames.defaultPaymentMethod,
    primaryKey: 'id',
    properties: {
        id: 'string',
        no: 'int',
        code: 'string',
        pageType: 'int'
    }
};
