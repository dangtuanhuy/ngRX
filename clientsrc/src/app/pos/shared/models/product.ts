import { EntityBase } from './entity-base';
import { VariantModel } from './variant';

export class Product extends EntityBase {
  name: string;
  description: string;
  categoryId: string;
  variants: VariantModel[];
  isDelete: boolean;
  createdDate: Date;
  updatedDate: Date;
}
