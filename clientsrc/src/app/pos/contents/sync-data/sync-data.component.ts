import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Router } from '@angular/router';
import { SyncService } from '../../shared/services/sync.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { PageConstants } from '../../shared/constants/common.constant';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SyncedDataFlag } from '../../shared/enums/sync-data.enum';
import { SyncDataFlowManagerService } from '../../shared/services/flow-managers/sync-data-flow-manager.service';
import {
  SyncDataFlowManagerModel, SyncDataFlowManagerStatus
} from '../../shared/services/flow-managers/flow-manager-model/sync-data-flow-manager.model';
import { StoreModel } from 'src/app/retail/stores/stores.component';
import { AppContextManager } from '../../shared/app-context-manager';

@Component({
  selector: 'app-sync-data',
  templateUrl: './sync-data.component.html',
  styleUrls: ['./sync-data.component.scss']
})
export class SyncDataComponent extends ComponentBase {
  syncedDataFlag = SyncedDataFlag.None;
  syncDataMessages = [];
  syncDataFlowManagerStatus = SyncDataFlowManagerStatus.Default;
  disableSyncButton = false;

  constructor(
    private appSettingService: AppSettingService,
    private router: Router,
    private syncService: SyncService,
    private notificationService: NotificationService,
    private syncDataFlowManagerService: SyncDataFlowManagerService,
    private appContextManager: AppContextManager,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.syncDataFlowManagerService.syncDataFlagSubject.subscribe((data: SyncDataFlowManagerModel) => {
      this.buildSyncDataMessages(data);
    });
  }
  onDestroy() {
  }

  public onSyncData() {
    this.disableSyncButton = true;
    this.appSettingService.getByKeys([SystemAppSettingKeys.deviceCode, SystemAppSettingKeys.storeId])
      .subscribe(deviceCodeAndStoreIdAppSettings => {
        if (deviceCodeAndStoreIdAppSettings.length === 0) {
          this.router.navigate([PageConstants.deviceAuthentication]);
          return;
        }

        const deviceCodeAppSetting = deviceCodeAndStoreIdAppSettings.find(x => x.key === SystemAppSettingKeys.deviceCode);
        if (!deviceCodeAppSetting) {
          this.router.navigate([PageConstants.deviceAuthentication]);
          return;
        }

        this.syncService.getStore(deviceCodeAppSetting.value).subscribe((store: StoreModel) => {
          this.appContextManager.detectServerAvailable().subscribe((result: any) => {
            if (result) {
              this.syncService.FetchCatalog(deviceCodeAppSetting.value, store.id).subscribe(error => {
                if (!error) {
                  this.notificationService.success('synced data');
                  const keys = [SystemAppSettingKeys.synced, SystemAppSettingKeys.lastSync];
                  this.appSettingService.getByKeys(keys).subscribe(appSettings => {
                    const syncedAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.synced);
                    if (syncedAppSetting) {
                      syncedAppSetting.value = 'true';
                      this.appSettingService.update(syncedAppSetting).subscribe();
                    } else {
                      this.appSettingService.add(SystemAppSettingKeys.synced, 'true').subscribe();
                    }

                    const lastSyncedAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.lastSync);
                    if (lastSyncedAppSetting) {
                      lastSyncedAppSetting.value = (new Date()).toString();
                      this.appSettingService.update(lastSyncedAppSetting).subscribe();
                    } else {
                      this.appSettingService.add(SystemAppSettingKeys.lastSync, (new Date()).toString()).subscribe();
                    }
                  });

                  this.router.navigate([PageConstants.defaultPage]);
                  return;
                }
                this.disableSyncButton = false;
                this.notificationService.error(error);
              });
            }
          }, (error) => {
            this.disableSyncButton = false;
            this.notificationService.warning('The device you are using is in offline mode or the server is not available');
          });
        });
      });
  }

  public onResetDeviceCode() {
    this.router.navigate([PageConstants.deviceAuthentication]);
  }

  private buildSyncDataMessages(data: SyncDataFlowManagerModel) {
    const correspondingMessage = this.syncDataMessages.find(x => x.key === data.key);

    if (correspondingMessage) {
      correspondingMessage.message = SyncedDataFlag[data.key];
      correspondingMessage.syncStatus = data.status;
    } else {
      this.syncDataMessages.push({
        key: data.key,
        message: SyncedDataFlag[data.key],
        syncStatus: data.status
      });
    }
  }
}
