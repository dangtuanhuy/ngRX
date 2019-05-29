import { EntityBase } from './entity-base';

export class BarCode extends EntityBase {
  variantId: string;
  code: string;
  createdDate: Date;
  updatedDate: Date;
  isDelete: boolean;
}
