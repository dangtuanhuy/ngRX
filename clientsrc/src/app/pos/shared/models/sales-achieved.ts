import { EntityBase } from './entity-base';

export class SalesAchieved extends EntityBase {
    value: number;
    fromDate: Date;
    toDate: Date;
    saleTargetId: string;
}
