import { EntityBase } from '../models/entity-base';
import { IRepository } from './i-repository';
import { AppContextManager } from '../app-context-manager';

export abstract class RepositoryBase<TEntity extends EntityBase>
  implements IRepository<TEntity> {
  delete(id: string): void {
    const entity = this.getById(id);
    if (entity) {
      const context = this.appContextManager.GetLatestDbContext();
      context.write(() => {
        context.delete(entity);
      });
      context.close();
    }
  }

  abstract Map(obj: any);
  constructor(
    protected appContextManager: AppContextManager,
    protected tableName: string
  ) { }

  update(entity: TEntity): void {
    const context = this.appContextManager.GetLatestDbContext();
    context.write(() => {
      context.create(this.tableName, entity, true);
    });
    context.close();
  }

  get(): TEntity[] {
    const context = this.appContextManager.GetLatestDbContext();
    const result = [];
    const data = context.objects(this.tableName);
    if (!data.length) {
      context.close();
      return result;
    }
    data.forEach(element => {
      result.push(this.Map(element));
    });
    context.close();
    return result;
  }

  getById(id: string): TEntity {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName).find(x => x.id === id);
    let result = null;
    if (data) {
      result = this.Map(data);
    }

    context.close();
    return result;
  }

  add(entity: TEntity): TEntity {
    const context = this.appContextManager.GetLatestDbContext();
    context.write(() => {
      const result = context.create(this.tableName, entity);
      entity = result;
    });

    context.close();
    return entity;
  }
}
