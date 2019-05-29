import { EntityBase } from './entity-base';
import { UserType } from '../enums/user-type.enum';

export class User extends EntityBase {
    firstName: string;
    lastName: string;
    fullName: string;
    userName: string;
    email: string;
    pinHash: string;
    userType: UserType;
    phoneNumber: string;
    isActive: boolean;
    isDelete: boolean;
}
