import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { Migration } from '../models/migration';

@Injectable({ providedIn: 'root' })
export class MigrationRepository extends RepositoryBase<Migration> {
  Map(obj: any) {
    const result = new Migration();
    result.id = obj.id;
    return result;
  }
  constructor(protected appContextManager: AppContextManager) {
    super(appContextManager, 'Migrations');
  }
}
