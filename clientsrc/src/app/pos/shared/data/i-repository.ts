import { EntityBase } from '../models/entity-base';

export interface IRepository<TEntity extends EntityBase> {
  add(entity: TEntity): TEntity;
  get(): TEntity[];
  getById(id: string): TEntity;
  update(entity: TEntity): void;
  delete(id: string): void;
}
