import { EntityBase } from './entity-base';

export class Customer extends EntityBase {
    name: string;
    walletPoint: number;
    loyaltyPoint: number;
    customerCode: string;
    store: number;
    reward: number;
    phoneNumber: string;
    visit: number;
    isDelete: boolean;
}
