import { Component, OnInit, Injector } from '@angular/core';
import { SyncService } from '../../shared/services/sync.service';
import { AppContextManager } from '../../shared/app-context-manager';
import { Store } from '@ngrx/store';
import * as fromSales from '../state/sales.reducer';
import * as salesActions from '../state/sales.action';
import { AuthService } from '../../auth/auth.service';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { SalesAchievedService } from '../../shared/services/sales-achieved.service';
import { SalesAchieved } from '../../shared/models/sales-achieved';
import { SaleTarget } from '../../shared/models/sale-target';
import { PriceExtension } from '../../shared/helpers/price.extension';

@Component({
  selector: 'app-sales-toolbar',
  templateUrl: './sales-toolbar.component.html',
  styleUrls: ['./sales-toolbar.component.scss']
})
export class SalesToolbarComponent extends ComponentBase {

  constructor(
    private syncService: SyncService,
    private appContextManager: AppContextManager,
    private saleStore: Store<fromSales.SalesState>,
    private authService: AuthService,
    private appSettingSerice: AppSettingService,
    private salesAchievedService: SalesAchievedService,
    public injector: Injector
  ) {
    super(injector);
  }

  isSync = false;
  isOnline = false;
  storeName = '';

  target = '0.00';
  achieved = '0.00';
  remainingTarget = '0.00';

  periodTimeOfTarget = '';

  saleTarget: SaleTarget = null;
  salesAchieved: SalesAchieved = null;

  onInit() {
    this.appContextManager.checkNetworkOnlineEvent.subscribe((resull: boolean) => {
      this.isOnline = resull;
    });

    this.syncService.subcribeSyncDataEvent().subscribe(result => {
      this.isSync = result;
    });

    this.appContextManager.triggerGetSaleTargetSubject.subscribe(() => {
      this.getSaleTarget();
    });

    this.initInfomation();
    this.getSaleTarget();
  }
  onDestroy() {

  }


  public onClickLogout(event) {
    this.saleStore.dispatch(new salesActions.ClearData());
    this.authService.logout();
  }

  private initInfomation() {
    this.handleSubscription(
      this.appContextManager.storeNameAppSettingSubject.subscribe((appSetting) => {
        if (appSetting) {
          this.storeName = appSetting.value ? appSetting.value : '';
        }
      })
    );

    this.appSettingSerice.getByKey(SystemAppSettingKeys.storeName).subscribe(appSetting => {
      if (appSetting) {
        this.appContextManager.triggerStoreNameAppSetting(appSetting);
      }
    });
  }

  private getSaleTarget() {
    this.salesAchievedService.getCurrentSaleTargetAndSalesAchievedOrCreate().subscribe((result) => {
      if (result) {
        this.saleTarget = result.saleTarget;
        this.salesAchieved = result.salesAchieved;
        this.buildTarget();
      } else {
        this.saleTarget = null;
        this.salesAchieved = null;
      }
    });

    this.appContextManager.triggerSaleTargetAndSalesAchievedSubject.subscribe((data) => {
      this.saleTarget = data.saleTarget;
      this.salesAchieved = data.salesAchieved;
      this.buildTarget();
    });
  }


  private formatDateToYYYYMMDD(date: Date): string {
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  private buildTarget() {
    this.target = PriceExtension.round(this.saleTarget.target, 2).toLocaleString(undefined, { minimumFractionDigits: 2 });
    this.achieved = PriceExtension.round(this.salesAchieved.value, 2).toLocaleString(undefined, { minimumFractionDigits: 2 });
    const remainingTarget = this.saleTarget.target - this.salesAchieved.value;
    this.remainingTarget = PriceExtension.round(remainingTarget, 2).toLocaleString(undefined, { minimumFractionDigits: 2 });
    this.periodTimeOfTarget = this.formatPeriodTimeOfTarget(this.saleTarget.fromDate, this.saleTarget.toDate);
  }

  private formatPeriodTimeOfTarget(fromDate: Date, toDate: Date): string {
    let result = this.formatDateToYYYYMMDD(fromDate);
    result += ' ' + this.formatDateToYYYYMMDD(toDate);

    return result;
  }
}
