import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { OrderService } from 'src/app/pos/shared/services/order.service';
import { OrderPaymentService } from 'src/app/pos/shared/services/order-payment.service';
import { CashingUpService } from 'src/app/pos/shared/services/cashing-up.service';
import { CashingUp } from 'src/app/pos/shared/models/cashing-up';
import { CommonConstants, PageConstants } from 'src/app/pos/shared/constants/common.constant';
import { OrderPayment } from 'src/app/pos/shared/models/order-payment';
import { PriceExtension } from 'src/app/pos/shared/helpers/price.extension';
import { PaymentModeModel } from 'src/app/pos/shared/models/payment-mode.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethodService } from 'src/app/pos/shared/services/payment-method.service';

@Component({
  selector: 'app-close-day-report',
  templateUrl: './close-day-report.component.html',
  styleUrls: ['./close-day-report.component.scss']
})
export class CloseDayReportComponent extends ComponentBase {
  public openday: CashingUp;
  public title = 'End day report';
  public defaultPage = '';

  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public fromDate = new Date();
  public toDate = new Date();

  public dataSource = [];
  private orderPayments: OrderPayment[] = [];
  private payments: PaymentModeModel[] = [];

  constructor(
    private paymentMethodService: PaymentMethodService,
    private orderPaymentService: OrderPaymentService,
    private cashingUpService: CashingUpService,
    private orderService: OrderService,
    private activeModal: NgbActiveModal,
    injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.cashingUpService.getTheLastOpenday().subscribe((openday) => {
      this.openday = openday;
      this.getPayments();
    });

    this.paymentMethodService.get().subscribe((payments: PaymentModeModel[]) => {
      this.payments = payments;
      this.buildDataSource();
    });

    this.initData();
  }

  onDestroy() {

  }

  public onClickClose() {
    this.activeModal.close();
  }

  private getPayments() {
    const now = new Date();
    this.orderService.getOrders(this.openday.createdDate, now).subscribe(orders => {
      const orderIds = orders.map(x => x.id);

      this.orderPaymentService.getOrderPaymentsByOrders(orderIds).subscribe(orderPayments => {
        this.orderPayments = orderPayments;
        this.buildDataSource();
      });
    });
  }

  private initData() {
    this.defaultPage = `/${PageConstants.defaultPage}`;
  }

  private buildDataSource() {
    this.dataSource = [];
    if (this.openday) {
      const openDaySource = {
        name: 'Open day',
        paymentCode: 'system-open-day',
        amount: PriceExtension.round(Number(this.openday.amount), 2),
        amountDecimal: '0.00'
      };
      openDaySource.amountDecimal = openDaySource.amount.toFixed(2);
      this.dataSource.push(openDaySource);
    }

    if (!this.payments.length || !this.orderPayments.length) {
      return;
    }

    this.orderPayments.forEach(orderPayment => {
      const existedOrderPayment = this.dataSource.find(x => x.paymentCode === orderPayment.paymentCode);
      if (existedOrderPayment) {
        existedOrderPayment.amount = (existedOrderPayment.amount + PriceExtension.round(Number(orderPayment.amount), 2));
        existedOrderPayment.amountDecimal = existedOrderPayment.amount.toFixed(2);
      } else {
        const correspondingPayment = this.payments.find(x => x.code === orderPayment.paymentCode);
        const newData = {
          name: correspondingPayment ? correspondingPayment.paymode : orderPayment.paymentCode,
          paymentCode: orderPayment.paymentCode,
          amount: PriceExtension.round(Number(orderPayment.amount), 2),
          amountDecimal: '0.00'
        };
        newData.amountDecimal = newData.amount.toFixed(2);
        this.dataSource.push(newData);
      }
    });
  }
}
