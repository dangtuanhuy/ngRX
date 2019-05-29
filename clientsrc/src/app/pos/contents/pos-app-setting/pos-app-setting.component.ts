import { Component, Injector, ViewEncapsulation } from '@angular/core';
import { ShortcutService } from '../../shared/services/shortcut.service';
import { ShortcutModel } from '../../shared/models/shortcut.model';
import { PageConstants, CommonConstants, PageInputId } from '../../shared/constants/common.constant';
import { Router } from '@angular/router';
import { KeyboardService } from '../../shared/components/keyboard/services/keyboard.service';
import { SyncService } from '../../shared/services/sync.service';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { AppSetting } from '../../shared/models/appSetting';
import * as moment from 'moment';
import * as fromSales from '../../sales/state/sales.reducer';
import * as salesActions from '../../sales/state/sales.action';
import { Store } from '@ngrx/store';
import { AppContextManager } from '../../shared/app-context-manager';
import { SyncToServerService } from '../../shared/services/sync-to-server.service';

@Component({
  selector: 'app-pos-app-setting',
  templateUrl: './pos-app-setting.component.html',
  styleUrls: ['./pos-app-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PosAppSettingComponent extends ComponentBase {
  private shortcuts: ShortcutModel[] = [];

  public title = 'App settings';
  public defaultPage = '';
  public quickSelectShortcuts: ShortcutModel[] = [];
  public paymentShortcuts: ShortcutModel[] = [];
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public keyboardStatus = true;

  public syncIntervalTimeAppSetting: AppSetting = null;
  public syncIntervalTime = 0;
  public syncIntervalTimeId = '';

  public deviceHubNameAppSetting: AppSetting = null;
  public deviceHubNameId = '';
  public deviceHubName = '';

  public printerShareNameAppSetting: AppSetting = null;
  public printerShareNameId = '';
  public printerShareName = '';

  public latsSyncTime = '';
  public deviceCode = '';

  public GSTAppSetting: AppSetting = null;
  public GST = 0;
  public GSTId = '';

  public GSTInclusiveAppSetting: AppSetting = null;
  public GSTInclusive = true;

  public billNoPrefixAppSetting: AppSetting = null;
  public billNoPrefix = '';
  public billNoPrefixId = '';

  public billNoDeviceNoAppSetting: AppSetting = null;
  public billNoDeviceNo = '';
  public billNoDeviceNoId = '';

  constructor(
    private shortcutService: ShortcutService,
    private router: Router,
    private keyboardService: KeyboardService,
    private syncService: SyncService,
    private appSettingService: AppSettingService,
    private notificationService: NotificationService,
    private store: Store<fromSales.SalesState>,
    private appContextManager: AppContextManager,
    private syncToServerService: SyncToServerService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.syncIntervalTimeId = PageInputId.shortcut.inputIds.syncIntervalTime;
    this.GSTId = PageInputId.shortcut.inputIds.GST;
    this.deviceHubNameId = PageInputId.shortcut.inputIds.deviceHubName;
    this.printerShareNameId = PageInputId.shortcut.inputIds.printerShareName;
    this.billNoPrefixId = PageInputId.shortcut.inputIds.billNoPrefix;
    this.billNoDeviceNoId = PageInputId.shortcut.inputIds.billNoDeviceNo;

    this.syncService.subcribeSyncDataEvent().subscribe(result => {
      if (result) {
        this.getLastSyncTime();
      }
    });
    this.initData();
    this.loadShortcuts();
    this.getAppSettings();
    this.getDeviceCode();
  }

  onDestroy() {
  }

  public onClickSave() {
    this.shortcutService.updateShortcut(this.shortcuts);
    this.router.navigate([PageConstants.quickSelect]);
  }

  public onApplySyncIntervalTime() {
    this.syncIntervalTimeAppSetting.value = String(this.syncIntervalTime);
    this.appSettingService.update(this.syncIntervalTimeAppSetting).subscribe((appSetting) => {
      if (appSetting) {
        this.notificationService.success('success');
        this.syncService.resetSyncIntervalTime();
        this.syncToServerService.resetSyncIntervalTime();
      }
    });


  }

  public onApplyGST() {
    this.GSTAppSetting.value = String(this.GST);
    this.appSettingService.update(this.GSTAppSetting).subscribe(appSetting => {
      if (appSetting) {
        this.notificationService.success('success');
        this.appContextManager.triggerCurrentGSTChange(this.GSTAppSetting);
        this.store.dispatch(new salesActions.SetGST(Number(appSetting.value)));
      }
    });
  }

  public changeGSTInclusive(event) {
    this.GSTInclusiveAppSetting.value = String(event.target.checked);
    this.appSettingService.update(this.GSTInclusiveAppSetting).subscribe(appSetting => {
      if (appSetting) {
        this.GSTInclusive = (appSetting.value === 'true');
        this.appContextManager.triggerCurrentGSTInclusiveChange(this.GSTInclusiveAppSetting);
        this.store.dispatch(new salesActions.SetGSTInclusive(this.GSTInclusive));
      }
    });
  }

  public onApplyDeviceHubName() {
    this.deviceHubNameAppSetting.value = String(this.deviceHubName);
    this.appSettingService.update(this.deviceHubNameAppSetting).subscribe(() => {
      this.notificationService.success('success');
    });
  }

  public onApplyPrinterShareName() {
    if (this.printerShareNameAppSetting) {
      this.printerShareNameAppSetting.value = String(this.printerShareName);
      this.appSettingService.update(this.printerShareNameAppSetting).subscribe(() => {
        this.notificationService.success('success');
      });
    } else {
      this.appSettingService.add(SystemAppSettingKeys.printerShareName, this.printerShareName).subscribe(() => {
        this.notificationService.success('success');
      });
    }
  }

  public onApplyBillNoPrefix() {
    this.billNoPrefixAppSetting.value = String(this.billNoPrefix);
    this.appSettingService.update(this.billNoPrefixAppSetting).subscribe(() => {
      this.notificationService.success('success');
    });
  }

  public onApplyBillNoDeviceNo() {
    this.billNoDeviceNoAppSetting.value = String(this.billNoDeviceNo);
    this.appSettingService.update(this.billNoDeviceNoAppSetting).subscribe(appSetting => {
      if (appSetting) {
        this.notificationService.success('success');
      }
    });
  }

  public changeKeyboardStatus(event) {
    this.keyboardService.usingVirtualKeyboard = event.target.checked;
    this.keyboardStatus = event.target.checked;
  }

  public onSyncData() {
    this.appSettingService.getByKeys([SystemAppSettingKeys.deviceCode, SystemAppSettingKeys.storeId])
      .subscribe(deviceCodeAndStoreIdAppSettings => {
        if (deviceCodeAndStoreIdAppSettings.length > 0) {
          const deviceCodeAppSetting = deviceCodeAndStoreIdAppSettings.find(x => x.key === SystemAppSettingKeys.deviceCode);

          if (deviceCodeAppSetting) {
            const storeIdAppSetting = deviceCodeAndStoreIdAppSettings.find(x => x.key === SystemAppSettingKeys.storeId);
            let storeId = '';
            if (storeIdAppSetting) {
              storeId = storeIdAppSetting.value;
            }

            this.appContextManager.detectServerAvailable().subscribe((result: any) => {
              if (result === true) {
                this.syncService.FetchCatalog(deviceCodeAppSetting.value, storeId).subscribe(error => {
                  if (!error) {
                    this.notificationService.success('synced data');

                    this.appSettingService.getByKey(SystemAppSettingKeys.synced).subscribe(syncedAppSetting => {
                      if (!syncedAppSetting) {
                        this.appSettingService.add(SystemAppSettingKeys.synced, 'true').subscribe();
                      } else {
                        syncedAppSetting.value = 'true';
                        this.appSettingService.update(syncedAppSetting).subscribe();
                      }
                    });

                    this.appSettingService.getByKey(SystemAppSettingKeys.lastSync).subscribe(lastSyncAppSetting => {
                      if (lastSyncAppSetting) {
                        lastSyncAppSetting.value = (new Date()).toString();
                        this.appSettingService.update(lastSyncAppSetting).subscribe();
                      } else {
                        this.appSettingService.add(SystemAppSettingKeys.lastSync, (new Date()).toString()).subscribe();
                      }
                    });
                  } else {
                    this.notificationService.error(error);
                  }
                });
              }
            }, (error) => {
              this.notificationService.warning('The device you are using is in offline mode or the server is not available');
            });
          }
        }
      });
  }

  public onChangeSyncIntervalTime(event) {
    this.syncIntervalTime = event;
  }

  public onChangeGST(event) {
    this.GST = event;
  }

  public onChangeDeviceHubName(event) {
    this.deviceHubName = event;
  }

  public onChangePrinterShareName(event) {
    this.printerShareName = event;
  }

  public onChangeBillNoPrefix(event) {
    this.billNoPrefix = event;
  }

  public onChangeBillNoDeviceNo(event) {
    this.billNoDeviceNo = event;
  }

  private loadShortcuts() {
    const keys = [
      SystemAppSettingKeys.syncIntervalTime,
      SystemAppSettingKeys.deviceHubName,
      SystemAppSettingKeys.printerShareName,
      SystemAppSettingKeys.quickSelectPage.payment,
      SystemAppSettingKeys.billNoStoreNamePrefix,
      SystemAppSettingKeys.billNoDeviceNo
    ];

    this.appSettingService.getByKeys(keys).subscribe(appSettings => {
      const syncTimeAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.syncIntervalTime);
      if (syncTimeAppSetting) {
        this.syncIntervalTimeAppSetting = syncTimeAppSetting;
        this.syncIntervalTime = Number(syncTimeAppSetting.value);
      }

      const deviceHubNameAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.deviceHubName);
      if (deviceHubNameAppSetting) {
        this.deviceHubNameAppSetting = deviceHubNameAppSetting;
        this.deviceHubName = deviceHubNameAppSetting.value;
      } else {
        this.appSettingService.add(SystemAppSettingKeys.deviceHubName, 'EPSON TM-T81 Receipt').subscribe((appSetting) => {
          this.deviceHubNameAppSetting = appSetting;
          this.deviceHubName = appSetting.value;
        });
      }

      const printerShareNameAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.printerShareName);
      if (printerShareNameAppSetting) {
        this.printerShareNameAppSetting = printerShareNameAppSetting;
        this.printerShareName = printerShareNameAppSetting.value;
      } else {
        this.appSettingService.add(SystemAppSettingKeys.printerShareName, '\\\\desktop-6g05lnd\\receipt').subscribe((newAppSetting) => {
          this.printerShareName = '\\\\desktop-6g05lnd\\receipt';
        });
      }

      const billNoPrefixAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.billNoStoreNamePrefix);
      if (billNoPrefixAppSetting) {
        this.billNoPrefixAppSetting = billNoPrefixAppSetting;
        this.billNoPrefix = billNoPrefixAppSetting.value;
      } else {
        this.appSettingService.add(SystemAppSettingKeys.billNoStoreNamePrefix, 'TOG').subscribe((appSetting) => {
          this.billNoPrefixAppSetting = appSetting;
          this.billNoPrefix = appSetting.value;
        });
      }

      const billNoDeviceNoAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.billNoDeviceNo);
      if (billNoDeviceNoAppSetting) {
        this.billNoDeviceNoAppSetting = billNoDeviceNoAppSetting;
        this.billNoDeviceNo = billNoDeviceNoAppSetting.value;
      } else {
        this.appSettingService.add(SystemAppSettingKeys.billNoDeviceNo, '1').subscribe((appSetting) => {
          this.billNoDeviceNoAppSetting = appSetting;
          this.billNoDeviceNo = appSetting.value;
        });
      }
    });
    this.shortcutService.shortcutsSubject.subscribe(shortcuts => {
      this.shortcuts = shortcuts;

      this.quickSelectShortcuts = this.shortcuts.filter(x => x.page === PageConstants.quickSelect);
      this.paymentShortcuts = this.shortcuts.filter(x => x.page === PageConstants.payment);
    });

    this.shortcutService.loadShortcuts();
  }

  private getAppSettings() {
    this.GSTAppSetting = this.appContextManager.currentGST;
    if (this.GSTAppSetting) {
      this.GST = Number(this.GSTAppSetting.value);
    }

    this.GSTInclusiveAppSetting = this.appContextManager.currentGSTInclusive;
    if (this.GSTInclusiveAppSetting) {
      this.GSTInclusive = (this.GSTInclusiveAppSetting.value === 'true');
    }
  }

  private initData() {
    this.defaultPage = `/${PageConstants.defaultPage}`;
    this.keyboardStatus = this.keyboardService.usingVirtualKeyboard;
  }

  private getDeviceCode() {
    this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode).subscribe(appSettingDeviceCode => {
      if (appSettingDeviceCode) {
        this.deviceCode = appSettingDeviceCode.value;
      }
    });
  }

  private getLastSyncTime() {
    this.appSettingService.getByKey(SystemAppSettingKeys.lastSync).subscribe(lastSync => {
      if (lastSync) {
        const date = new Date(lastSync.value);
        this.latsSyncTime = moment(date).format('DD/MM/YYYY HH:mm:ss a');
      }
    });
  }
}
