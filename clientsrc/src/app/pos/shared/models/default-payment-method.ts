import { EntityBase } from './entity-base';

export class DefaultPaymentMethod extends EntityBase {
    no: number;
    code: string;
    pageType: DefaultPaymentMethodPageType;
}

export enum DefaultPaymentMethodPageType {
    default = 0,
    payment = 1
}
