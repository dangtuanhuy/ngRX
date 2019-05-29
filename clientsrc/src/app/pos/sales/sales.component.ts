import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { ListViewColumn } from 'src/app/shared/components/inline-edit-list-view/model';
import * as fromSales from './state/sales.reducer';
import * as salesSeclector from './state/index';
import * as salesActions from './state/sales.action';
import { Store, select } from '@ngrx/store';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { SyncService } from '../shared/services/sync.service';
import { CashingUpService } from '../shared/services/cashing-up.service';
import { TenderService } from '../shared/services/tender.service';
import { PageConstants } from '../shared/constants/common.constant';
import { Router } from '@angular/router';
import { CashingUpType } from '../shared/enums/cashing-up-type.enum';
import { CashingUp } from '../shared/models/cashing-up';
import { Tender } from '../shared/models/tender';
import { TenderType } from '../shared/enums/tender-type.enum';
import { AppContextManager } from '../shared/app-context-manager';
import { ActivatedScreen } from '../shared/enums/activated-screen.enum';
import { AppSettingService } from '../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../shared/constants/appSetting-key.constant';
import { SaleItemViewModel, calculateSaleItemsTotalPrice } from '../shared/view-models/sale-item.view-model';
import { SaleItemType } from '../shared/enums/sale-item-type.enum';
import { PriceExtension } from '../shared/helpers/price.extension';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SyncToServerService } from '../shared/services/sync-to-server.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalesComponent extends ComponentBase {

  public dataSource: SaleItemViewModel[] = [];
  public products = [];
  public promotions = [];
  public pageActive = false;

  private GST = 0;
  private NET = 0;
  private totalPrice = 0;
  public GSTDecimal: string;
  public NETDecimal: string;
  public totalPriceDecimal: string;

  public GSTInclusive = false;
  public GSTInclusiveMessage = '';

  public productViewColumns: ListViewColumn[] = [
    new ListViewColumn({ name: 'description', width: 'auto' }),
    new ListViewColumn({ name: 'quantity', isEdit: true, isNumber: true, width: '100px' }),
    new ListViewColumn({ name: 'price', isDecimalNumber: true, width: '100px' })
  ];

  constructor(
    private router: Router,
    private syncService: SyncService,
    private store: Store<fromSales.SalesState>,
    private cashingUpService: CashingUpService,
    private tenderService: TenderService,
    private appContextManager: AppContextManager,
    private appSettingSerice: AppSettingService,
    private notificationService: NotificationService,
    private syncToServerService: SyncToServerService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.checkCashingUpAndTender();
    this.initSelector();
    this.setIntervalSyncData();
    this.loadData();
  }

  onDestroy() {
  }

  public changeProductQuantity(values) {
    const selectedPromotion = this.promotions.find(x => x.id === values.id);
    if (selectedPromotion) {
      this.notificationService.warning('Can not update quantity of promotion!');
      values.quantity = 1;
    }
    this.store.dispatch(new salesActions.UpdateProductQuantity(values));
  }

  public onDeleteSaleItem(id) {
    this.store.dispatch(new salesActions.DeleteSaleItem(id));
  }

  private initSelector() {
    this.handleSubscription(
      this.store.pipe(select(salesSeclector.getGST)).subscribe(GST => {
        this.GST = PriceExtension.round(GST, 2);
        this.GSTDecimal = this.GST.toFixed(2);
        this.onCalculatePrices();
      })
    );

    this.handleSubscription(
      this.store.pipe(select(salesSeclector.getGSTInclusive)).subscribe(GSTInclusive => {
        this.GSTInclusive = GSTInclusive;
        this.GSTInclusiveMessage = this.GSTInclusive ? '(Inclusive)' : '';
        this.onCalculatePrices();
      })
    );

    this.handleSubscription(
      this.store.pipe(select(salesSeclector.getPromotions)).subscribe(promotions => {
        this.promotions = promotions;
      })
    );

    this.handleSubscription(
      this.store.pipe(select(salesSeclector.getSaleItemViewModels)).subscribe(saleItems => {
        this.dataSource = saleItems;
        this.onCalculatePrices();
      })
    );

  }

  private setIntervalSyncData() {
    this.syncService.resetSyncIntervalTime();
    this.syncToServerService.resetSyncIntervalTime();
  }

  private checkCashingUpAndTender() {
    this.cashingUpService.getTheLastCashingUp().subscribe((theLastCashingUp: CashingUp) => {
      if (!theLastCashingUp) {
        this.router.navigate([PageConstants.openDay]);
        return;
      }

      if (theLastCashingUp.cashingUpType === CashingUpType.openDay) {
        this.appContextManager.setCurrentOpendayCashingUp(theLastCashingUp);
        if (this.formatDateString(theLastCashingUp.createdDate) === this.formatDateString(new Date())) {
          this.checkTender();
          return;
        }

        this.router.navigate([PageConstants.closeDay]);
        return;
      }

      if (theLastCashingUp.cashingUpType === CashingUpType.closeDay) {
        if (this.formatDateString(theLastCashingUp.createdDate) === this.formatDateString(new Date())) {
          console.log('closed day');
          return;
        }

        this.router.navigate([PageConstants.openDay]);
        return;
      }

    });
  }

  private loadData() {
    this.pageActive = this.appContextManager.validActivedScreen(ActivatedScreen.QuickSelect);
    this.handleSubscription(
      this.appContextManager.currentActivatedScreenSubject.subscribe((activatedScreen: ActivatedScreen) => {
        this.pageActive = this.appContextManager.validActivedScreen(ActivatedScreen.QuickSelect);
      })
    );

    this.appSettingSerice.getByKey(SystemAppSettingKeys.GST).subscribe(appSetting => {
      if (appSetting) {
        this.store.dispatch(new salesActions.SetGST(Number(appSetting.value)));
      }
    });

    this.appSettingSerice.getByKey(SystemAppSettingKeys.GSTInclusive).subscribe(appSetting => {
      if (appSetting) {
        this.store.dispatch(new salesActions.SetGSTInclusive(appSetting.value === 'true'));
      }
    });
  }

  private checkTender() {
    this.tenderService.getTheLastTenderToday().subscribe((theLastTender: Tender) => {
      if (!theLastTender) {
        this.router.navigate([PageConstants.openDay]);
        return;
      }

      if (theLastTender.tenderType === TenderType.in) {
        this.appContextManager.setCurrentTenderIn(theLastTender);
        return;
      }

      if (theLastTender.tenderType === TenderType.out) {
        this.appContextManager.setCurrentTenderOut(theLastTender);
        return;
      }
    });
  }

  private formatDateString(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  private onCalculatePrices() {
    this.totalPrice = calculateSaleItemsTotalPrice(this.dataSource
      .filter(x => x.type === SaleItemType.Product || x.type === SaleItemType.ItemPromotion));
    this.totalPriceDecimal = this.totalPrice.toFixed(2);

    const discountPrices = this.dataSource.filter(x => x.type === SaleItemType.Promotion).map(x => PriceExtension.round(x.price, 2));
    const tax = this.GSTInclusive ? 0 : this.GST;
    this.NET = PriceExtension.calculateNetPrices(this.totalPrice, discountPrices, tax);
    this.NETDecimal = this.NET.toFixed(2);
  }
}
