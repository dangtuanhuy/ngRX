import { EntityBase } from '../models/entity-base';

export interface IUnitOfWork {
  add(tableName: string, entity: EntityBase): void;
  update(tableName: string, entity: EntityBase): void;
  delete(tableName: string, id: string): void;
  beginTransaction(): void;
  saveChanges(): void;
}
