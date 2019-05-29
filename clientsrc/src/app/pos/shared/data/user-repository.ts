import { RepositoryBase } from './repository-base';
import { Injectable } from '@angular/core';
import { AppContextManager } from '../app-context-manager';
import { User } from '../models/user';
import { SchemaNames } from '../constants/schema-name.constant';
import { Md5 } from 'md5-typescript';
import { UserType } from '../enums/user-type.enum';
import { UnitOfWork } from './unit-of-work';
import { SyncDataFlowManagerService } from '../services/flow-managers/sync-data-flow-manager.service';
import { SyncedDataFlag } from '../enums/sync-data.enum';
import {
  SyncDataFlowManagerModel,
  SyncDataFlowManagerStatus
} from '../services/flow-managers/flow-manager-model/sync-data-flow-manager.model';

@Injectable({ providedIn: 'root' })
export class UserRepository extends RepositoryBase<User> {
  Map(obj: any) {
    const result: User = {
      id: obj.id,
      firstName: obj.firstName,
      lastName: obj.lastName,
      fullName: obj.fullName,
      userName: obj.userName,
      email: obj.email,
      userType: obj.userType > -1 ? obj.userType : UserType.Default,
      phoneNumber: obj.phoneNumber,
      pinHash: obj.pinHash,
      isActive: obj.isActive ? obj.isActive : false,
      isDelete: obj.isDelete ? obj.isDelete : false
    };
    return result;
  }

  constructor(protected appContextManager: AppContextManager,
    private syncDataFlowManagerService: SyncDataFlowManagerService) {
    super(appContextManager, SchemaNames.user);
  }

  public pinSignIn(userName: string, pin: string) {
    const context = this.appContextManager.GetLatestDbContext();
    const userRealms = context.objects(this.tableName).filtered(`userName = "${userName}" and isActive = true`);
    let result = null;
    if (!userRealms.length) {
      context.close();
      return result;
    }

    const user = this.Map(userRealms[0]);
    if (this.verifyHashedPin(pin, user.pinHash)) {
      user.pinHash = '';
      result = user;
    } else {
      result = null;
    }

    context.close();
    return result;
  }

  private verifyHashedPin(pin: string, pinHash: string) {
    const hash = Md5.init(pin);

    if (hash === pinHash) {
      return true;
    }

    return false;
  }

  public addUsersToUnitOfWork(unitOfWork: UnitOfWork, users: any[]) {
    users.forEach(user => {
      this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
        key: SyncedDataFlag.User,
        status: SyncDataFlowManagerStatus.Inprogress
      }));

      const realmUser = new User();
      realmUser.id = user.id;
      realmUser.firstName = user.firstName ? user.firstName : '';
      realmUser.lastName = user.lastName ? user.lastName : '';
      realmUser.fullName = `${realmUser.firstName} ${realmUser.lastName}`;
      realmUser.userName = user.userName;
      realmUser.phoneNumber = user.phoneNumber ? user.phoneNumber : '';
      realmUser.email = user.email;
      realmUser.pinHash = user.pinHash;
      realmUser.isActive = user.isActive;
      realmUser.userType = user.userType;
      realmUser.isDelete = false;

      unitOfWork.add(SchemaNames.user, realmUser);
    });
  }

  public addOrUpdateUsersToUnitOfWork(unitOfWork: UnitOfWork, users: any[]) {
    users.forEach(user => {
      this.syncDataFlowManagerService.triggerSyncDataFlag(new SyncDataFlowManagerModel({
        key: SyncedDataFlag.User,
        status: SyncDataFlowManagerStatus.Inprogress
      }));

      const realmUser = new User();
      realmUser.id = user.id;
      realmUser.firstName = user.firstName ? user.firstName : '';
      realmUser.lastName = user.lastName ? user.lastName : '';
      realmUser.fullName = `${realmUser.firstName} ${realmUser.lastName}`;
      realmUser.userName = user.userName;
      realmUser.phoneNumber = user.phoneNumber ? user.phoneNumber : '';
      realmUser.email = user.email;
      realmUser.pinHash = user.pinHash;
      realmUser.isActive = user.isActive;
      realmUser.userType = user.userType;
      realmUser.isDelete = false;

      const existedUser = this.getById(user.id);
      if (existedUser) {
        unitOfWork.update(SchemaNames.user, realmUser);
      } else {
        unitOfWork.add(SchemaNames.user, realmUser);
      }
    });
  }

  public getUserByIdsFromContext(context: any, userIds: string[]) {
    const userRealms = context.objects(this.tableName).filter(x => userIds.includes(x.id));
    const result = [];
    if (!userRealms.length) {
      return result;
    }

    userRealms.forEach(element => {
      result.push(this.Map(element));
    });
    return result;
  }
}
