import { Component, Injector } from '@angular/core';
import { PageInputId, PageConstants } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { Router } from '@angular/router';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-device-authentication',
  templateUrl: './device-authentication.component.html',
  styleUrls: ['./device-authentication.component.scss']
})
export class DeviceAuthenticationComponent extends ComponentBase {
  public deviceCodeId = '';
  public deviceCode = '';

  constructor(
    private notificationService: NotificationService,
    private appSettingService: AppSettingService,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.deviceCodeId = PageInputId.deviceAuthentication.inputIds.deviceCode;
  }
  onDestroy() {
  }

  public changeDeviceCode(value) {
    this.deviceCode = value;
  }

  public onSave() {
    if (!this.deviceCode) {
      this.notificationService.warning('The device code is not empty!');
      return;
    }

    this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode).subscribe(deviceCodeAppSetting => {
      if (deviceCodeAppSetting) {
        deviceCodeAppSetting.value = this.deviceCode;
        this.appSettingService.update(deviceCodeAppSetting).subscribe(appSetting => {
          this.router.navigate([PageConstants.syncData]);
        });

        return;
      }

      this.appSettingService.add(SystemAppSettingKeys.deviceCode, this.deviceCode)
        .subscribe(newDeviceCodeAppSetting => {
          if (newDeviceCodeAppSetting) {
            this.router.navigate([PageConstants.syncData]);
          }
        });
    });
  }

}
