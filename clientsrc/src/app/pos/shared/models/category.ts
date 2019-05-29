import { EntityBase } from './entity-base';

export class Category extends EntityBase {
  name: string;
  description: string;
  isDelete: boolean;
}
