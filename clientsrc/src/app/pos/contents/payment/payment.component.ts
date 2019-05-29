import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ListViewColumn } from 'src/app/shared/components/inline-edit-list-view/model';
import * as paymentActions from './state/payment.action';
import * as paymentSeclector from './state/index';
import * as fromPayments from './state/payment.reducer';
import * as fromSale from '../../sales/state/sales.reducer';
import * as salesActions from '../../sales/state/sales.action';
import * as fromSaleSelector from '../../sales/state/index';
import { ProductViewModel } from '../../shared/models/product-view.model';
import { Router } from '@angular/router';
import { PaymentModeModel, calculatePaymentPaid, PaymentModeViewModel } from '../../shared/models/payment-mode.model';
import { PageConstants, CommonConstants, PageInputId } from '../../shared/constants/common.constant';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { OrderModel, generateBillNo } from '../../shared/models/order';
import { OrderItemModel } from '../../shared/models/order-item';
import { PosFormActionStatus } from '../../shared/constants/pos-form-action.constant';
import { SaleItemViewModel, calculateSaleItemsTotalPrice } from '../../shared/view-models/sale-item.view-model';
import { SaleItemType } from '../../shared/enums/sale-item-type.enum';
import { PriceExtension } from '../../shared/helpers/price.extension';
import { OrderPromotion } from '../../shared/models/order-promotion';
import { Guid } from 'src/app/shared/utils/guid.util';
import { Promotion } from '../../shared/models/promotion';
import { DiscountType } from '../../shared/enums/discount-type.enum';
import { PosPromotionService } from '../../shared/services/pos-promotion.service';
import { PromotionType } from '../../shared/enums/promotion-type.enum';
import { DeviceHubService } from '../../shared/services/device-hub.service';
import { OrderService } from '../../shared/services/order.service';
import { ReceiptExtension } from '../../shared/helpers/receipt.extension';
import { AppContextManager } from '../../shared/app-context-manager';
import { AppSettingService } from '../../shared/services/appSetting.service';
import { SystemAppSettingKeys } from '../../shared/constants/appSetting-key.constant';
import { DeviceHubRequest } from '../../shared/models/device-hub/device-hub-request';
import { DeviceCommand } from '../../shared/enums/device-hub/device-command.enum';
import { OrderItemPromotion } from '../../shared/models/order-item-promotion';
import { OrderPayment } from '../../shared/models/order-payment';
import { PaymentMethodService } from '../../shared/services/payment-method.service';
import { OrderTransactionType } from '../../shared/enums/order-transaction-type.enum';
import { OrderItemStatus } from '../../shared/enums/order-item-status.enum';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaymentComponent extends ComponentBase {
  public title = 'Payment';
  public defaultPage = '';
  public filteredPaymenModes: PaymentModeModel[] = [];
  public paymentModes: PaymentModeViewModel[] = [];
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public paymentModeViewColumns: ListViewColumn[] = [
    new ListViewColumn({ name: 'icon', isIcon: true, }),
    new ListViewColumn({ name: 'paymode' }),
    new ListViewColumn({ name: 'amount', isEdit: true, isNumber: true, })
  ];

  public decimalTotalNetPrice = '0.00';
  public decimalTotalPaid = '0.00';
  public decimalBalance = '0.00';
  public decimalDeposit = '0.00';

  public paymentModeSearchId = '';

  private totalPrice = 0;
  private totalNetPrice = 0;
  private totalPaid = 0;
  private balance = 0;
  private deposit = 0;
  private GST = 0;
  private GSTInclusive = false;

  private customer: CustomerModel;
  private products: ProductViewModel[];
  private promotions: Promotion[];
  private saleItems: SaleItemViewModel[] = [];

  constructor(
    private paymentStore: Store<fromPayments.PaymentModeState>,
    private saleStore: Store<fromSale.SalesState>,
    private paymentMethodService: PaymentMethodService,
    private router: Router,
    private notificationService: NotificationService,
    private posPromotionService: PosPromotionService,
    private deviceHubService: DeviceHubService,
    private orderService: OrderService,
    private appContextManager: AppContextManager,
    private appSettingService: AppSettingService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.initData();
    this.initLoadStores();
  }
  onDestroy() {
  }

  public onSearchPaymentMode(value: string) {
    if (!value) {
      this.filteredPaymenModes = [];
    }
    this.paymentMethodService.searchPaymentModes(value).subscribe(filteredPaymenModes => {
      this.filteredPaymenModes = filteredPaymenModes.map(x => {
        x.description = x.paymode;
        return x;
      });
    });
  }

  public onSelectPaymentMode(payment) {
    this.paymentStore.dispatch(new paymentActions.AddPaymentMode(payment));
  }

  public changePaymentAmount(values) {
    this.paymentStore.dispatch(new paymentActions.UpdatePaymentModeAmount(values));
  }

  public onDeletePaymentMode(id) {
    const deletePaymentMode = this.paymentModes.find(x => x.id === id);
    if (deletePaymentMode) {
      this.paymentStore.dispatch(new paymentActions.DeletePaymentModeByCode(deletePaymentMode.code));
    }
  }

  public onSave() {
    if (!((Array.isArray(this.products) && this.products.length > 0))) {
      this.notificationService.error('Please add products!');
      return;
    }

    const incorrectProducts = this.products.filter(x => x.quantity <= 0);
    if (incorrectProducts.length > 0) {
      this.notificationService.error(`Products's quantity must be larger than 0!`);
      return;
    }

    if (Math.abs(this.balance) > 0) {
      this.notificationService.error('Please check balance total!');
      return;
    }

    if (this.deposit) {
      const cashPayment = this.paymentModes.find(x => x.code === 'CASH');
      if (cashPayment) {
        if (cashPayment.amount < this.deposit) {
          this.notificationService.error('The cash must be larger then the change!');
          return;
        }
      }
    }

    this.appSettingService.getByKeys([SystemAppSettingKeys.billNoStoreNamePrefix, SystemAppSettingKeys.billNoDeviceNo])
      .subscribe(appSettings => {
        const billNoPrefixAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.billNoStoreNamePrefix);
        const billNoDeviceNoAppSetting = appSettings.find(x => x.key === SystemAppSettingKeys.billNoDeviceNo);

        const billNo = generateBillNo(billNoPrefixAppSetting ? billNoPrefixAppSetting.value : '',
          billNoDeviceNoAppSetting ? billNoDeviceNoAppSetting.value : '');

        let cashierId = '';
        if (this.appContextManager.currentUser) {
          cashierId = this.appContextManager.currentUser.id;
        }

        const order = new OrderModel();
        order.customerId = this.customer ? this.customer.id : null;
        order.amount = this.totalNetPrice;
        order.gst = this.GST;
        order.gstInclusive = this.GSTInclusive;
        order.billNo = billNo;
        order.change = this.deposit;
        order.cashierId = cashierId;
        order.orderTransactionType = OrderTransactionType.Normal;
        order.oldOrderId = null;

        order.orderItems = this.products.map(product => {
          const orderItem = new OrderItemModel();
          orderItem.priceId = product.priceId;
          orderItem.stockTypeId = product.stockTypeId;
          orderItem.variantId = product.variantId;
          orderItem.price = product.price;
          orderItem.quantity = product.quantity;
          orderItem.skuCode = product.skuCode;
          orderItem.status = OrderItemStatus.Normal;
          orderItem.oldOrderItemId = null;

          let totalItemDiscountPrice = 0;
          orderItem.orderItemPromotions = [];
          const saleItemPromotions = product.saleItemPromotions;
          if (Array.isArray(saleItemPromotions)) {
            orderItem.orderItemPromotions = saleItemPromotions.map(saleItemPromotion => {
              const orderItemPromotion = new OrderItemPromotion();
              orderItemPromotion.id = Guid.newGuid();
              orderItemPromotion.discountType = saleItemPromotion.discountType;
              orderItemPromotion.value = saleItemPromotion.value;

              if (orderItemPromotion.discountType === DiscountType.Money) {
                totalItemDiscountPrice += orderItemPromotion.value;
              }

              if (orderItemPromotion.discountType === DiscountType.Percent) {
                totalItemDiscountPrice += PriceExtension.round(orderItemPromotion.value * product.amount / 100, 2);
              }

              return orderItemPromotion;
            });
          }

          orderItem.amount = PriceExtension.round(product.amount - totalItemDiscountPrice, 2);
          orderItem.amount = orderItem.amount > 0 ? orderItem.amount : 0;

          return orderItem;
        });

        order.orderPayments = this.paymentModes.filter(x => Number(x.amount) > 0)
          .map(x => new OrderPayment({
            id: '',
            orderId: '',
            paymentCode: x.code,
            amount: Number(x.amount)
          }));

        if (order.change) {
          const cashPayment = order.orderPayments.find(x => x.paymentCode === 'CASH');
          if (cashPayment) {
            cashPayment.amount = PriceExtension.round(cashPayment.amount - order.change, 2);
          } else {
            order.orderPayments.push(new OrderPayment({
              id: '',
              orderId: '',
              paymentCode: 'CASH',
              amount: PriceExtension.round(-1 * order.change, 2)
            }));
          }
        }

        this.posPromotionService.getPromotionByPromotionType(PromotionType.ManualDiscount).subscribe(promotionManualDiscount => {
          order.orderPromotions = this.promotions.map(promotion => {
            const orderPromotion = new OrderPromotion();
            orderPromotion.id = Guid.newGuid();
            orderPromotion.promotionId = promotionManualDiscount ? promotionManualDiscount.id : Guid.empty();
            orderPromotion.reason = promotion.description;
            orderPromotion.discountType = promotion.discountTypeId;
            orderPromotion.value = Number(promotion.value);

            return orderPromotion;
          });

          this.saleStore.dispatch(new salesActions.AddSale(order));
        });
      });
  }

  public onClickIcon(event) {
    if (event.colName === 'icon') {
      const item = event.item;

      if (item) {
        let itemAmount = Number(item.amount);
        itemAmount = itemAmount ? itemAmount : 0;
        this.changePaymentAmount({
          id: item.id,
          code: item.code,
          amount: PriceExtension.round(Number(this.balance) + itemAmount, 2)
        });
      }
    }
  }

  public onEsc() {
    this.router.navigate(['/quick-select']);
  }

  private initLoadStores() {
    this.handleSubscription(
      this.paymentStore.pipe(select(paymentSeclector.getPaymentModes)).subscribe(paymentModes => {
        this.paymentModes = paymentModes;
        this.totalPaid = calculatePaymentPaid(paymentModes);
        this.decimalTotalPaid = this.totalPaid.toFixed(2);

        this.calculateBalanceAndDeposit();
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getCustomer)).subscribe(customer => {
        this.customer = customer;
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getSaleItemViewModels)).subscribe(saleItems => {
        this.saleItems = saleItems;
        this.onCalculatePrices();
        this.paymentStore.dispatch(new paymentActions.ClearPaymentModes());
        this.calculateBalanceAndDeposit();
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getProducts)).subscribe(products => {
        this.products = products;
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getPromotions)).subscribe(promotions => {
        this.promotions = promotions;
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getGST)).subscribe(GST => {
        this.GST = GST;
        this.onCalculatePrices();
        this.calculateBalanceAndDeposit();
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getGSTInclusive)).subscribe(GSTInclusive => {
        this.GSTInclusive = GSTInclusive;
        this.onCalculatePrices();
        this.calculateBalanceAndDeposit();
      })
    );

    this.handleSubscription(
      this.saleStore.pipe(select(fromSaleSelector.getStatus)).subscribe(status => {
        if (status.value === PosFormActionStatus.Success) {
          const newOrderId = status.data;
          this.saleStore.dispatch(new salesActions.SetStatus({
            value: PosFormActionStatus.None,
            data: null
          }));

          this.printReceipt(newOrderId);
          this.router.navigate([PageConstants.quickSelect]);
        }
      })
    );

    this.paymentStore.dispatch(new paymentActions.GetDefaultPaymentModes());
  }

  private calculateBalanceAndDeposit() {
    const balance = PriceExtension.round(this.totalPaid - this.totalNetPrice, 2);
    this.balance = balance > 0 ? 0 : -1 * balance;
    this.deposit = balance > 0 ? balance : 0;

    this.decimalBalance = this.balance.toFixed(2);
    this.decimalDeposit = this.deposit.toFixed(2);
  }

  private clearData() {
    this.saleStore.dispatch(new salesActions.ClearData());
    this.router.navigate(['/quick-select']);
  }

  private initData() {
    this.defaultPage = `/${PageConstants.defaultPage}`;
    this.paymentModeSearchId = PageInputId.payment.inputIds.paymentModeSearchId;
  }

  private onCalculatePrices() {
    this.totalPrice = calculateSaleItemsTotalPrice(this.saleItems
      .filter(x => x.type === SaleItemType.Product || x.type === SaleItemType.ItemPromotion));
    const discountPrices = this.saleItems.filter(x => x.type === SaleItemType.Promotion).map(x => PriceExtension.round(x.price, 2));

    const tax = this.GSTInclusive ? 0 : this.GST;
    this.totalNetPrice = PriceExtension.round(PriceExtension.calculateNetPrices(this.totalPrice, discountPrices, tax), 2);
    this.decimalTotalNetPrice = this.totalNetPrice.toFixed(2);
  }

  private printReceipt(orderId) {
    this.orderService.getOrderIncludeOrderItems(orderId).subscribe(order => {
      if (order) {
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
            const saleReceipt = ReceiptExtension.buildReceiptFromOrderModel(order,
              cashierName,
              storeNameAppSetting ? storeNameAppSetting.value : '',
              storeAddressAppSetting ? storeAddressAppSetting.value : '',
              paymentModes);

            if (!saleReceipt) {
              return;
            }

            let deviceHubName = '';
            this.appSettingService.getByKey(SystemAppSettingKeys.deviceHubName).subscribe((appSetting) => {
              if (appSetting) {
                deviceHubName = appSetting.value;
              }
            });

            const request = new DeviceHubRequest();
            request.command = DeviceCommand.PrintReceipt;
            request.deviceHubName = deviceHubName;
            request.data = JSON.stringify(saleReceipt);

            this.deviceHubService.printEpson(request).subscribe(result1 => {
              if (result1) {
                this.deviceHubService.printEpson(request).subscribe(result2 => { });
              }
            });
          });
        });

        const cashPayment = order.orderPayments.find(x => x.paymentCode === 'CASH');
        if (cashPayment) {
          this.appSettingService.getByKey(SystemAppSettingKeys.printerShareName).subscribe((appSeting) => {
            const printerShareName = appSeting ? appSeting.value : '\\\\desktop-6g05lnd\\receipt';
            this.deviceHubService.openCashDrawer(printerShareName).subscribe();
          });
        }
      }
    });
  }
}
