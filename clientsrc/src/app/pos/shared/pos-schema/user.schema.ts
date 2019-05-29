import { SchemaNames } from '../constants/schema-name.constant';

export const UserSchema = {
    name: SchemaNames.user,
    primaryKey: 'id',
    properties: {
        id: 'string',
        firstName: 'string',
        lastName: 'string',
        fullName: 'string',
        userName: 'string',
        email: 'string',
        pinHash: 'string',
        userType: 'int',
        phoneNumber: 'string',
        isActive: 'bool',
        isDelete: 'bool'
    }
};
