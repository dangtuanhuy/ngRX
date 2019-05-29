import { SchemaNames } from '../constants/schema-name.constant';

export const TenderSchema = {
    name: SchemaNames.tender,
    primaryKey: 'id',
    properties: {
        id: 'string',
        userId: 'string',
        amount: 'double',
        tenderType: 'string',
        createdDate: 'date'
    }
};
