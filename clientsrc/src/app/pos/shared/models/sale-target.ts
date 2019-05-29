import { EntityBase } from './entity-base';

export class SaleTarget extends EntityBase {
    target: number;
    fromDate: Date;
    toDate: Date;
    isDelete: boolean;
}
