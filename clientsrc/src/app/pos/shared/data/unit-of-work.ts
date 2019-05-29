import { IUnitOfWork } from './i-unit-of-work';
import { AppContextManager } from '../app-context-manager';
import { Injectable } from '@angular/core';
import { EntityBase } from '../models/entity-base';

@Injectable({ providedIn: 'root' })
export class UnitOfWork implements IUnitOfWork {
  constructor(private appContextManager: AppContextManager) { }
  private actions: any[];
  add(tableName: string, entity: EntityBase): void {
    this.actions.push({
      action: 'add',
      tableName: tableName,
      entity: entity
    });
  }
  update(tableName: string, entity: EntityBase): void {
    this.actions.push({
      action: 'update',
      tableName: tableName,
      entity: entity
    });
  }
  delete(tableName: string, id: string): void {
    this.actions.push({
      action: 'delete',
      tableName: tableName,
      entity: {
        id: id
      }
    });
  }
  deleteAll(tableName: string): void {
    this.actions.push({
      action: 'deleteAll',
      tableName: tableName
    });
  }
  beginTransaction(): void {
    this.actions = [];
  }
  saveChanges(): void {
    if (this.actions.length) {
      const context = this.appContextManager.GetLatestDbContext();
      context.write(() => {
        this.actions.forEach(item => {
          switch (item.action) {
            case 'add':
              context.create(item.tableName, item.entity);
              break;
            case 'update':
              context.create(item.tableName, item.entity, true);
              break;
            case 'delete':
              const data = context
                .objects(item.tableName)
                .find(x => x.id === item.entity.id);
              if (data) {
                context.delete(data);
              }
              break;
            case 'deleteAll':
              const deletedData = context.objects(item.tableName);
              context.delete(deletedData);
              break;
          }
        });
      });
      context.close();
    }
  }
}
