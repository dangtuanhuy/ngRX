import { Component, Injector } from '@angular/core';
import { PageConstants, CommonConstants } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { DeviceHubService } from '../../shared/services/device-hub.service';
import { SaleReceipt } from '../../shared/models/device-hub/sale-receipt';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { OrderModel } from '../../shared/models/order';
import { AppContextManager } from '../../shared/app-context-manager';
import { DeviceCommand } from '../../shared/enums/device-hub/device-command.enum';
import { DeviceHubRequest } from '../../shared/models/device-hub/device-hub-request';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { ReceiptExtension } from '../../shared/helpers/receipt.extension';
import { DiscountType } from '../../shared/enums/discount-type.enum';
import { PriceExtension } from '../../shared/helpers/price.extension';
import { PaymentModeModel } from '../../shared/models/payment-mode.model';
import { PaymentMethodService } from '../../shared/services/payment-method.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent extends ComponentBase {
  public orderId = '';
  public order: OrderModel = null;
  public title = 'Receipt';
  public defaultPage = `/${PageConstants.defaultPage}`;
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public street = '201 Victoria Street';
  public createdDate = '';
  public country = 'SINPAPORE - 188067';
  public phone = '66341967';
  public email = 'test@gmail.com';
  public GSTNo = '201229862H';

  public billno = '';
  public cashierName = '';
  public counter = '';

  public gstInclusive = false;
  public totalAmount = 0;
  public gstInclusiveAmount = 0;
  public gstAmount = 0;

  public netQuantityTotal = 2;
  public netTotal = 130;

  public exchangeDayAmount = 7;

  public saleReceipt: SaleReceipt;
  public discountType = DiscountType;

  constructor(
    private deviceHubService: DeviceHubService,
    private _activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private appContextManager: AppContextManager,
    private notification: NotificationService,
    private appSettingService: AppSettingService,
    private paymentMethodService: PaymentMethodService,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
    this.orderId = this._activatedRoute.snapshot.paramMap.get('orderId');
  }

  onInit() {
    this.getOrder();
  }
  onDestroy() {

  }

  public onPrint() {
    let deviceHubName = '';
    this.appSettingService.getByKey(SystemAppSettingKeys.deviceHubName).subscribe((appSetting) => {
      if (appSetting) {
        deviceHubName = appSetting.value;
      }
    });

    const request = new DeviceHubRequest();
    request.command = DeviceCommand.PrintReceipt;
    request.deviceHubName = deviceHubName;
    request.data = JSON.stringify(this.saleReceipt);

    this.deviceHubService.printEpson(request).subscribe(result => {
      if (result) {
        this.notification.success('Success');
        this.router.navigate([PageConstants.quickSelect]);
      } else {
        this.notification.error('Something went wrong!');
      }
    });
  }

  public onEsc() {
    this.router.navigate([PageConstants.quickSelect]);
  }

  public getOrder() {
    this.orderService.getOrderIncludeOrderItems(this.orderId).subscribe(order => {
      this.order = order;
      if (this.order) {
        this.gstInclusive = this.order.gstInclusive;
        this.mapToDraftReceipt();
        this.appSettingService.getByKeys([SystemAppSettingKeys.storeName, SystemAppSettingKeys.storeAddress]).subscribe(appSettings => {
          const storeNameAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.storeName);
          const storeAddressAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.storeAddress);

          let cashierName = '';
          if (this.appContextManager.currentUser) {
            cashierName = this.appContextManager.currentUser.firstName ? this.appContextManager.currentUser.firstName : '';
            cashierName += this.appContextManager.currentUser.lastName
              ? ' ' + this.appContextManager.currentUser.lastName
              : '';
          }
          this.paymentMethodService.get().subscribe((paymentModes: PaymentModeModel[]) => {
            this.saleReceipt = ReceiptExtension.buildReceiptFromOrderModel(
              this.order,
              cashierName,
              storeNameAppSetting ? storeNameAppSetting.value : '',
              storeAddressAppSetting ? storeAddressAppSetting.value : '',
              paymentModes);

            if (this.saleReceipt) {
              this.totalAmount = this.saleReceipt.totalAmount;
              this.gstInclusiveAmount = this.saleReceipt.gstInclusiveAmount;
              this.gstAmount = this.saleReceipt.gstNoInclusiveAmount;
              this.netQuantityTotal = this.saleReceipt.netQuantity;
              this.netTotal = this.saleReceipt.netTotal;
              this.billno = this.saleReceipt.billNo;
              this.cashierName = this.saleReceipt.cashierName;
              this.counter = this.saleReceipt.counterName;
            }
          });
        });
      }
    });
  }

  public formatNumberDecimal(value: number) {
    return PriceExtension.round(value, 2).toFixed(2);
  }

  private mapToDraftReceipt() {
    this.createdDate = this.formatReceiptDateString(this.order.createdDate);
  }

  private formatReceiptDateString(localTime: Date): string {
    let result = `${localTime.getDate()}/${localTime.getMonth() + 1}/${localTime.getFullYear()}`;
    result += ` ${localTime.getHours()}:${localTime.getMinutes()}`;
    return result;
  }
}
