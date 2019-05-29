import { EntityBase } from './entity-base';
import { TenderType } from '../enums/tender-type.enum';

export class Tender extends EntityBase {
    userId: string;
    amount: number;
    tenderType: TenderType;
    createdDate: Date;
}
