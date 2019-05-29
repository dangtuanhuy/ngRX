import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { PageInputId, PageConstants } from '../../shared/constants/common.constant';
import { AppContextManager } from '../../shared/app-context-manager';
import { ShortcutService } from '../../shared/services/shortcut.service';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { AppSetting } from '../../shared/models/appSetting';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends ComponentBase {
  public loginForm: FormGroup = new FormGroup({});
  public emailId = '';
  public passwordId = '';

  public email = '';
  public password = '';

  // public email = 'tb@tog.com.sg';
  // public password = '123456';

  constructor(
    private authService: AuthService,
    private shortcutService: ShortcutService,
    private appContextManager: AppContextManager,
    private notificationSerivce: NotificationService,
    private appSettingService: AppSettingService,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.emailId = PageInputId.login.inputIds.email;
    this.passwordId = PageInputId.login.inputIds.password;

    const dbVersion = this.appContextManager.getDbVersion();
    if (dbVersion >= 0) {
      this.appSettingService.getByKey(SystemAppSettingKeys.loginEmail).subscribe((loginAppSetting: AppSetting) => {
        if (loginAppSetting) {
          this.email = loginAppSetting.value;
        }
      });
    } else {
      this.router.navigate([PageConstants.deviceAuthentication]);
    }
  }

  onDestroy() {

  }

  public login() {
    const user = this.authService.login(this.email, this.password);
    if (!user) {
      this.password = '';
      this.notificationSerivce.error('Invalid Email or Pin');
      return;
    }

    this.appContextManager.setCurrentUser(user);
    this.appContextManager.detectNetworkStatus();
    this.shortcutService.GetAllShortcut();
  }

  public onSaveEmailLogin() {
    this.appSettingService.getByKey(SystemAppSettingKeys.loginEmail).subscribe((loginAppSetting: AppSetting) => {
      if (loginAppSetting) {
        loginAppSetting.value = this.email;
        this.appSettingService.update(loginAppSetting).subscribe(() => {
          this.notificationSerivce.success('Success');
        });
      } else {
        this.appSettingService.add(SystemAppSettingKeys.loginEmail, this.email).subscribe((newLoginAppSetting: AppSetting) => {
          this.notificationSerivce.success('Success');
        });
      }
    });
  }

  public changeEmail(event) {
    this.email = event;
  }

  public changePassword(event) {
    this.password = event;
  }
}
