import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromCloseDayState from './state/close-day.reducer';
import * as closeDayActions from './state/close-day.action';
import * as closeDaySelector from './state/index';
import { calculateDenominationsTotal, DenominationViewModel } from '../../shared/models/denomination-view.model';
import { PageConstants, CommonConstants } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { CashingUp } from '../../shared/models/cashing-up';
import { Tender } from '../../shared/models/tender';
import { AppContextManager } from '../../shared/app-context-manager';
import { User } from '../../shared/models/user';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Guid } from 'src/app/shared/utils/guid.util';
import { CashingUpType } from '../../shared/enums/cashing-up-type.enum';
import { TenderService } from '../../shared/services/tender.service';
import { CashingUpService } from '../../shared/services/cashing-up.service';
import { TenderType } from '../../shared/enums/tender-type.enum';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConFirmDialogResult } from '../../shared/enums/dialog-type.enum';
import { OrderService } from '../../shared/services/order.service';
import { CloseDayReportComponent } from './close-day-report/close-day-report.component';
import { PriceExtension } from '../../shared/helpers/price.extension';
import { CloseDayTenderReportComponent } from './close-day-tender-report/close-day-tender-report.component';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { DeviceHubRequest } from '../../shared/models/device-hub/device-hub-request';
import { DeviceCommand } from '../../shared/enums/device-hub/device-command.enum';
import { DeviceHubService } from '../../shared/services/device-hub.service';
import { CloseDayReport, CloseDayReportCurrency, CloseDayReportPaymentModeDetail } from '../../shared/models/device-hub/close-day-report';
import { OrderPaymentService } from '../../shared/services/order-payment.service';
import { PaymentModeModel } from '../../shared/models/payment-mode.model';
import { DenominationExtension } from '../../shared/helpers/denomination.extension';
import { DateExtension } from '../../shared/helpers/date.extension';
import { PaymentMethodService } from '../../shared/services/payment-method.service';

@Component({
  selector: 'app-close-day',
  templateUrl: './close-day.component.html',
  styleUrls: ['./close-day.component.scss']
})
export class CloseDayComponent extends ComponentBase {
  public title = 'Close';
  public defaultPage = '';
  public denominations: DenominationViewModel[] = [];
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public decimalCashExpected = '0.00';
  public decimalCashDifference = '0.00';
  public decimalCounted = '0.00';
  public decimalRegister = '0.00';
  public decimalDeposit = '0.00';

  public currentOpendayCashingUp: CashingUp;
  public currentTenderIn: Tender;

  private currentUser: User;

  private cashExpectedMoney = 0;
  private cashDifferenceMoney = 0;
  private countedMoney = 0;
  private registerMoney = 0;
  private totalOrdersPrice = 0;

  public openday: CashingUp;

  constructor(
    private store: Store<fromCloseDayState.CloseDayState>,
    private router: Router,
    private appContextManager: AppContextManager,
    private notificationService: NotificationService,
    private cashingUpService: CashingUpService,
    private tenderService: TenderService,
    private modalService: NgbModal,
    private orderService: OrderService,
    private appSettingService: AppSettingService,
    private deviceHubService: DeviceHubService,
    private orderPaymentService: OrderPaymentService,
    private paymentMethodService: PaymentMethodService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.initData();
    this.loadData();
    this.loadDenominations();
  }
  onDestroy() {

  }

  public onChangeDenomination(values) {
    this.store.dispatch(new closeDayActions.ChangeDenomination(values));
  }

  public onClickTender() {
    if (!this.currentUser) {
      this.notificationService.error('Something went wrong!');
      return;
    }

    const dialogRef = this.modalService.open(CloseDayTenderReportComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;

    dialogRef.result.then((result) => {
      if (result === ConFirmDialogResult.Yes) {
        this.addTenderOut().subscribe(tenderOut => {
          if (!tenderOut) {
            this.notificationService.error('Something went wrong!');
            return;
          }

          this.appContextManager.setCurrentTenderIn(null);
          this.appContextManager.setCurrentTenderOut(tenderOut);
          this.router.navigate([PageConstants.quickSelect]);
        });
      }
    });
  }

  public onClickEndTheDay() {
    if (!this.currentUser) {
      this.notificationService.error('Something went wrong!');
      return;
    }

    const dialogRef = this.modalService.open(ConfirmDialogComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;
    instance.title = 'Confirm';
    instance.message = 'Are you sure want to close day?';

    dialogRef.result.then((result) => {
      if (result === ConFirmDialogResult.Yes) {
        this.addCloseDayCashingUp().subscribe(data => {
          if (!data) {
            this.notificationService.error('Something went wrong!');
            return;
          }

          const tenderOut = data.tenderOut;
          this.appContextManager.setCurrentOpendayCashingUp(null);
          this.appContextManager.setCurrentTenderIn(null);
          this.appContextManager.setCurrentTenderOut(tenderOut);
          this.printEndDayReport();
          this.router.navigate([PageConstants.quickSelect]);
        });
      }
    });
  }

  public onClickCashExpectedDetail() {
    const dialogRef = this.modalService.open(CloseDayReportComponent, { size: 'lg', centered: true, backdrop: 'static' });
    const instance = dialogRef.componentInstance;

    dialogRef.result.then((result) => {

    });
  }

  private loadDenominations() {
    this.handleSubscription(
      this.store.pipe(select(closeDaySelector.getDenominations)).subscribe(denominations => {
        this.denominations = denominations;

        this.countedMoney = calculateDenominationsTotal(this.denominations);
        this.cashDifferenceMoney = this.cashExpectedMoney - this.countedMoney;

        this.decimalCounted = parseFloat(String(this.countedMoney)).toFixed(2);
        this.decimalCashDifference = parseFloat(String(this.cashDifferenceMoney)).toFixed(2);
      })
    );

    this.store.dispatch(new closeDayActions.LoadDenominations());
  }

  private initData() {
    this.defaultPage = `/${PageConstants.defaultPage}`;
  }

  private calculateMoney() {
    if (this.openday) {
      this.registerMoney = Number(this.openday.amount);
      this.decimalRegister = parseFloat(String(this.registerMoney)).toFixed(2);

      let openDayAmount = 0;
      if (this.openday) {
        openDayAmount = Number(this.openday.amount);
      }
      this.cashExpectedMoney = openDayAmount + PriceExtension.round(this.totalOrdersPrice, 2);
      this.decimalCashExpected = parseFloat(String(this.cashExpectedMoney)).toFixed(2);
    }
  }

  private loadData() {
    this.currentUser = this.appContextManager.currentUser;
    this.handleSubscription(
      this.appContextManager.currentUserSubject.subscribe((user: User) => {
        this.currentUser = user;
      })
    );

    this.currentOpendayCashingUp = this.appContextManager.currentOpendayCashingUp;
    this.handleSubscription(
      this.appContextManager.currentOpendayCashingUpSubject.subscribe((currentOpendayCashingUp: CashingUp) => {
        this.currentOpendayCashingUp = currentOpendayCashingUp;
      })
    );

    this.currentTenderIn = this.appContextManager.currentTenderIn;
    this.calculateMoney();
    this.calculateTotalOrdersPrice();
    this.handleSubscription(
      this.appContextManager.currentTenderInSubject.subscribe((currentTenderIn: Tender) => {
        this.currentTenderIn = currentTenderIn;
        this.calculateMoney();
        this.calculateTotalOrdersPrice();
      })
    );

    this.cashingUpService.getTheLastOpenday().subscribe((openday) => {
      this.openday = openday;
      this.calculateMoney();
      this.calculateTotalOrdersPrice();
    });
  }

  private addCloseDayCashingUp(): Observable<any> {
    return Observable.create((observer) => {
      const cashingUp = new CashingUp();
      cashingUp.id = Guid.newGuid();
      cashingUp.amount = this.countedMoney;
      cashingUp.userId = this.currentUser.id;
      cashingUp.cashingUpType = CashingUpType.closeDay;
      cashingUp.createdDate = new Date();
      this.cashingUpService.add(cashingUp).subscribe(closeDayCashingUp => {
        if (!closeDayCashingUp) {
          this.notificationService.error('Something went wrong!');
          observer.next(null);
          observer.complete();
          return;
        }

        this.addTenderOut().subscribe(tenderOut => {
          if (!tenderOut) {
            this.notificationService.error('Something went wrong!');
            observer.next(null);
            observer.complete();
            return;
          }

          const result = {
            closeDayCashingUp: closeDayCashingUp,
            tenderOut: tenderOut
          };
          observer.next(result);
          observer.complete();
        });
      });
    });
  }

  private addTenderOut(): Observable<any> {
    return Observable.create((observer) => {
      const tender = new Tender();
      tender.id = Guid.newGuid();
      tender.amount = this.countedMoney;
      tender.userId = this.currentUser.id;
      tender.tenderType = TenderType.out;
      tender.createdDate = new Date();
      this.tenderService.add(tender).subscribe(newTender => {
        observer.next(newTender);
        observer.complete();
      });
    });
  }

  private calculateTotalOrdersPrice() {
    if (this.openday) {
      const now = new Date();
      this.orderService.calculateTotalOrdersPrice(this.openday.createdDate, now).subscribe(x => {
        this.totalOrdersPrice = x;
        this.calculateMoney();
      });
    }
  }

  private printEndDayReport() {
    const now = new Date();
    this.orderService.getOrders(this.openday.createdDate, now).subscribe(orders => {
      const orderIds = orders.map(x => x.id);
      this.orderPaymentService.getOrderPaymentsByOrders(orderIds).subscribe(orderPayments => {
        this.paymentMethodService.get().subscribe((payments: PaymentModeModel[]) => {
          const mergedDenominations =
            DenominationExtension.buildMergedDenominationsFromOrderPayments(this.openday, null, payments, orderPayments)
              .filter(x => x.name !== 'Open day');

          const keys = [SystemAppSettingKeys.deviceHubName, SystemAppSettingKeys.storeName, SystemAppSettingKeys.storeAddress];
          this.appSettingService.getByKeys(keys).subscribe((appSettings) => {
            if (appSettings.length) {
              const deviceHubNameAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.deviceHubName);
              const storeNameAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.storeName);
              const storeAddressAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.storeAddress);
              const deviceHubName = deviceHubNameAppSetting ? deviceHubNameAppSetting.value : '';
              const storeName = storeNameAppSetting ? storeNameAppSetting.value : '';
              const storeAddress = storeAddressAppSetting ? storeAddressAppSetting.value : '';

              const request = this.buildCloseDayReportPaper(deviceHubName, this.openday, storeName, storeAddress, mergedDenominations);
              this.deviceHubService.printEpson(request).subscribe(result => {
              });
            }
          });
        });
      });
    });
  }

  private buildCloseDayReportPaper(deviceHubName: string,
    openDay: CashingUp,
    storeName: string,
    storeAddress: string,
    mergedDenominations: any[]): DeviceHubRequest {
    const request = new DeviceHubRequest();
    request.command = DeviceCommand.PrintEndDayReport;
    request.deviceHubName = deviceHubName;

    const data = new CloseDayReport();
    data.cashier = this.appContextManager.currentUser.firstName;
    data.location = storeAddress;
    const now = new Date();
    data.settlementDate = DateExtension.dateToString(now);

    data.currencies = this.denominations.filter(x => x.quantity > 0).map(x => {
      const currency = new CloseDayReportCurrency();
      currency.value = Number(x.value);
      currency.quantity = Number(x.quantity);
      currency.amount = currency.value * currency.quantity;
      return currency;
    });

    data.totalCurrencies = 0.00;
    data.currencies.forEach(x => {
      data.totalCurrencies += PriceExtension.round(x.amount, 2);
    });

    const paymentModeDetailsIncludeCash = mergedDenominations.map(x => {
      const paymentModeDetail = new CloseDayReportPaymentModeDetail();
      paymentModeDetail.name = x.name;
      paymentModeDetail.amount = x.amount;
      return paymentModeDetail;
    });

    const cashMode = paymentModeDetailsIncludeCash.find(x => x.name === 'CASH');
    if (cashMode) {
      data.posCashSales = cashMode.amount;
    } else {
      data.posCashSales = 0.00;
    }
    data.paymentModeDetails = paymentModeDetailsIncludeCash.filter(x => x.name !== 'CASH');
    data.paymentModeDetailstTotal = 0.00;
    data.paymentModeDetails.forEach(x => {
      data.paymentModeDetailstTotal += PriceExtension.round(x.amount, 2);
    });

    data.totalCashAndPaymentModeDetails = data.totalCurrencies + data.paymentModeDetailstTotal;
    data.openDay = openDay;
    if (openDay) {
      data.tillAmount = openDay.amount;
    } else {
      data.tillAmount = 0;
    }

    data.totalCollection = data.totalCashAndPaymentModeDetails;
    data.grandTotal = data.totalCollection - data.tillAmount;
    data.systemTotal = data.posCashSales + data.paymentModeDetailstTotal;

    data.shortageExcess = data.grandTotal - data.systemTotal;
    request.data = JSON.stringify(data);

    return request;
  }
}
