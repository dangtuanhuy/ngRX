import { EntityBase } from './entity-base';
import { CashingUpType } from '../enums/cashing-up-type.enum';

export class CashingUp extends EntityBase {
    userId: string;
    amount: number;
    cashingUpType: CashingUpType;
    createdDate: Date;
}
