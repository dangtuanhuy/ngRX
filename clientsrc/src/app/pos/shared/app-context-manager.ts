import { Injectable } from '@angular/core';
import { Subject, timer, Observable } from 'rxjs';
import { User } from './models/user';
import { CashingUp } from './models/cashing-up';
import { Tender } from './models/tender';
import { ActivatedScreen } from './enums/activated-screen.enum';
import { AppSetting } from './models/appSetting';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { NotificationType } from './enums/notification-type.enum';

@Injectable({ providedIn: 'root' })
export class AppContextManager {
  dbConnection = 'C:\\pos\\pos-db.realm';
  currentConfiguration: any;
  currentUser: User;
  currentOpendayCashingUp: CashingUp;
  currentTenderIn: Tender;
  currentTenderOut: Tender;

  currentGST: AppSetting;
  currentGSTInclusive: AppSetting;

  activatedScreen = ActivatedScreen.None;

  storeNameAppSetting: AppSetting;
  storeNameAppSettingSubject = new Subject<AppSetting>();

  triggerPaymentSubject = new Subject<number>();
  triggerGetSaleTargetSubject = new Subject();
  triggerSaleTargetAndSalesAchievedSubject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {

  }

  checkNetworkOnlineEvent = new Subject();
  statusNetwork = false;
  currentUserSubject = new Subject();
  currentOpendayCashingUpSubject = new Subject();
  currentTenderInSubject = new Subject();
  currentTenderOutSubject = new Subject();
  currentActivatedScreenSubject = new Subject();

  GetLatestDbContext(): any {
    return this.getDbContexṭ̣̣(this.currentConfiguration);
  }

  getDbContexṭ̣̣(configuration: any): any {
    configuration = { ...configuration, path: this.getDbConnection() };
    this.currentConfiguration = {
      schema: configuration.schema,
      schemaVersion: configuration.schemaVersion
    };
    return window['RealmDbContext'].context(configuration);
  }

  getDbVersion(): number {
    return window['RealmDbContext'].realm.schemaVersion(this.getDbConnection());
  }

  getDbConnection(): string {
    return this.dbConnection;
  }

  isNetworkAvailable(): boolean {
    return this.statusNetwork;
  }

  detectNetworkStatus() {
    const checkNetwork = timer(100, 5000);
    checkNetwork.subscribe(x => {
      this.statusNetwork = navigator.onLine;
      this.checkNetworkOnlineEvent.next(this.statusNetwork);
    });
  }

  setCurrentUser(user: User) {
    this.currentUser = user;
    this.currentUserSubject.next(this.currentUser);
  }

  setCurrentOpendayCashingUp(cashingUp: CashingUp) {
    this.currentOpendayCashingUp = cashingUp;
    this.currentOpendayCashingUpSubject.next(this.currentOpendayCashingUp);
  }

  setCurrentTenderIn(tender: Tender) {
    this.currentTenderIn = tender;
    if (this.currentTenderIn) {
      this.onActivate([ActivatedScreen.Sale, ActivatedScreen.QuickSelect]);
    } else {
      this.onDeactivate([ActivatedScreen.Sale, ActivatedScreen.QuickSelect]);
    }
    this.currentTenderInSubject.next(this.currentTenderIn);
  }

  setCurrentTenderOut(tender: Tender) {
    this.currentTenderOut = tender;
    this.currentTenderOutSubject.next(this.currentTenderOut);
  }

  onActivate(activatedScreens: ActivatedScreen[] = []) {
    if (!activatedScreens.length) {
      activatedScreens.forEach(x => {
        // tslint:disable-next-line:no-bitwise
        this.activatedScreen = this.activatedScreen | x;
      });
    } else {
      this.activatedScreen = ActivatedScreen.All;
    }

    this.currentActivatedScreenSubject.next(this.activatedScreen);
  }

  onDeactivate(deActivatedScreens: ActivatedScreen[] = []) {
    if (!deActivatedScreens.length) {
      deActivatedScreens.forEach(x => {
        // tslint:disable-next-line:no-bitwise
        this.activatedScreen = this.activatedScreen - x;
      });
    } else {
      this.activatedScreen = ActivatedScreen.None;
    }

    this.currentActivatedScreenSubject.next(this.activatedScreen);
  }

  validActivedScreen(checkingValue: ActivatedScreen) {
    // tslint:disable-next-line:no-bitwise
    const validValue: ActivatedScreen = this.activatedScreen & checkingValue;
    if (validValue === checkingValue) {
      return true;
    }
    return false;
  }

  triggerCurrentGSTInclusiveChange(data: AppSetting) {
    this.currentGSTInclusive = data;
  }

  triggerCurrentGSTChange(data: AppSetting) {
    this.currentGST = data;
  }

  triggerStoreNameAppSetting(data: AppSetting) {
    this.storeNameAppSetting = data;
    this.storeNameAppSettingSubject.next(this.storeNameAppSetting);
  }

  triggerPayment(totalNet: number) {
    this.triggerPaymentSubject.next(totalNet);
  }

  triggerGetSaleTarget() {
    this.triggerGetSaleTargetSubject.next();
  }

  detectServerAvailable(): Observable<any> {
    return this.http.get(`${environment.app.retail.apiUrl}/api/syncs/serverDetection`);
  }

  notification(type: NotificationType, message: string) {
    if (type === NotificationType.success) {
      this.notificationService.success(message);
    }

    if (type === NotificationType.error) {
      this.notificationService.error(message);
    }

    if (type === NotificationType.warning) {
      this.notificationService.warning(message);
    }
  }
}
