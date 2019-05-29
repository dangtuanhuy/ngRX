import { Component, Injector } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { MigrationService } from './shared/services/migration-service';
import { KeyboardService } from './shared/components/keyboard/services/keyboard.service';
import { ComponentBase } from '../shared/components/component-base';
import { SystemAppSettingKeys } from './shared/constants/appSetting-key.constant';
import { Router } from '@angular/router';
import { PageConstants } from './shared/constants/common.constant';
import { AppSettingService } from './shared/services/appSetting.service';
import { ShortcutService } from './shared/services/shortcut.service';
import { AppContextManager } from './shared/app-context-manager';
import { User } from './shared/models/user';
import { posEnvironment } from './pos-environments/pos-environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ComponentBase {
  public title = 'pos';
  public employeeName = 'administrator';
  public isAuthenticated = false;
  public showKeyboard = false;
  public keyboardPosition = {};
  public version = '1.0.9';

  constructor(
    private authService: AuthService,
    private migrationService: MigrationService,
    private appSettingService: AppSettingService,
    private keyboardService: KeyboardService,
    private router: Router,
    private shortcutService: ShortcutService,
    private appContextManager: AppContextManager,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    if (!posEnvironment.isDevelopment) {
      this.appContextManager.dbConnection = this.getDbPath();
    }

    this.initSetting();
    this.migrationService
      .migrate()
      .then(version => {
        this.getGSTData();
        this.appSettingService.getByKey(SystemAppSettingKeys.deviceCode)
          .subscribe(deviceCodeAppSetting => {
            if (!deviceCodeAppSetting) {
              this.router.navigate([PageConstants.deviceAuthentication]);
              return;
            }

            this.appSettingService.getByKey(SystemAppSettingKeys.synced)
              .subscribe(syncedAppSetting => {
                if (!syncedAppSetting || syncedAppSetting.value === 'false') {
                  this.router.navigate([PageConstants.syncData]);
                  return;
                }
              });

            this.shortcutService.GetAllShortcut();
          });
      })
      .catch(err => {
        console.log(err);
      });

    this.handleSubscription(
      this.keyboardService.showKeyboardSubject.subscribe((state: any) => {
        this.showKeyboard = state;
      })
    );

    this.handleSubscription(
      this.keyboardService.keyboardPositionSubject.subscribe(position => {
        this.keyboardPosition = position;
      })
    );

    this.handleSubscription(
      this.authService.loginSubcription.subscribe(info => {
        this.isAuthenticated = info;
      })
    );

    this.handleSubscription(
      this.appContextManager.currentUserSubject.subscribe((user: User) => {
        this.employeeName = user ? user.fullName : '';
      })
    );
  }

  onDestroy() { }

  private initSetting() {
    this.hiddenLoadingIndicator = true;
  }

  private getGSTData() {
    this.appSettingService.getByKey(SystemAppSettingKeys.GST)
      .subscribe(appSetting => {
        if (appSetting) {
          this.appContextManager.currentGST = appSetting;
        } else {
          this.appSettingService.add(SystemAppSettingKeys.GST, '5').subscribe(newGSTAppSetting => {
            this.appContextManager.currentGST = newGSTAppSetting;
          });
        }
      });

    this.appSettingService.getByKey(SystemAppSettingKeys.GSTInclusive)
      .subscribe(appSetting => {
        if (appSetting) {
          this.appContextManager.currentGSTInclusive = appSetting;
        } else {
          this.appSettingService.add(SystemAppSettingKeys.GSTInclusive, 'true').subscribe(newGSTInclusiveAppSetting => {
            this.appContextManager.currentGSTInclusive = newGSTInclusiveAppSetting;
          });
        }
      });
  }

  private getDbPath() {
    const appPath = window['BaseDirectory'].value;
    const lastIndex = appPath.lastIndexOf(posEnvironment.dbFolderName);
    const posDbPath = appPath.substring(0, lastIndex + posEnvironment.dbFolderName.length) + '\\pos-db.realm';

    return posDbPath;
  }
}
