import { Injectable } from '@angular/core';
import { RepositoryBase } from './repository-base';
import { AppSetting } from '../models/appSetting';
import { AppContextManager } from '../app-context-manager';
import { Guid } from 'src/app/shared/utils/guid.util';

@Injectable({ providedIn: 'root' })
export class AppSettingRepository extends RepositoryBase<AppSetting> {
  Map(obj: any) {
    const result: AppSetting = {
      id: obj.id,
      key: obj.key,
      value: obj.value
    };

    return result;
  }

  constructor(protected appContextManager: AppContextManager) {
    super(appContextManager, 'AppSettings');
  }

  getByKey(key: string): AppSetting {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName).find(x => x.key === key);
    let result = null;
    if (data) {
      result = this.Map(data);
    }

    context.close();
    return result;
  }

  getByKeys(keys: string[]): AppSetting[] {
    const context = this.appContextManager.GetLatestDbContext();
    const data = context.objects(this.tableName).filter(x => keys.includes(x.key));
    const result = [];
    if (data) {
      data.forEach(appSettingRealm => {
        result.push(this.Map(appSettingRealm));
      });
    }

    context.close();
    return result;
  }

  addAppSetting(key: string, value: string) {
    const newAppAetting = new AppSetting();
    newAppAetting.id = Guid.newGuid();
    newAppAetting.key = key;
    newAppAetting.value = value;

    return this.add(newAppAetting);
  }

  updateAppSetting(entity: AppSetting) {
    const context = this.appContextManager.GetLatestDbContext();
    context.write(() => {
      context.create(this.tableName, entity, true);
    });
    context.close();

    return entity;
  }
}
