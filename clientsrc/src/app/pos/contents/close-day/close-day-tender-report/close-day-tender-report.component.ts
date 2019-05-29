import { Component, Injector } from '@angular/core';
import { OrderPaymentService } from 'src/app/pos/shared/services/order-payment.service';
import { AppContextManager } from 'src/app/pos/shared/app-context-manager';
import { OrderService } from 'src/app/pos/shared/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PaymentModeModel } from 'src/app/pos/shared/models/payment-mode.model';
import { Tender } from 'src/app/pos/shared/models/tender';
import { OrderPayment } from 'src/app/pos/shared/models/order-payment';
import { PriceExtension } from 'src/app/pos/shared/helpers/price.extension';
import { ConFirmDialogResult } from 'src/app/pos/shared/enums/dialog-type.enum';
import { PaymentMethodService } from 'src/app/pos/shared/services/payment-method.service';

@Component({
  selector: 'app-close-day-tender-report',
  templateUrl: './close-day-tender-report.component.html',
  styleUrls: ['./close-day-tender-report.component.scss']
})
export class CloseDayTenderReportComponent extends ComponentBase {
  currentTenderIn: Tender;

  public dataSource = [];
  private orderPayments: OrderPayment[] = [];
  private payments: PaymentModeModel[] = [];

  constructor(
    private paymentMethodService: PaymentMethodService,
    private orderPaymentService: OrderPaymentService,
    private appContextManager: AppContextManager,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private activeModal: NgbActiveModal,
    injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.currentTenderIn = this.appContextManager.currentTenderIn;
    if (this.currentTenderIn) {
      this.getPayments();
    }
    this.handleSubscription(
      this.appContextManager.currentTenderInSubject.subscribe((currentTenderIn: Tender) => {
        this.currentTenderIn = currentTenderIn;
        this.getPayments();
      })
    );

    this.paymentMethodService.get().subscribe((payments: PaymentModeModel[]) => {
      this.payments = payments;
      this.buildDataSource();
    });
  }

  onDestroy() {

  }

  public onClickOk() {
    this.activeModal.close(ConFirmDialogResult.Yes);
  }

  public onClickClose() {
    this.activeModal.close(ConFirmDialogResult.No);
  }

  private getPayments() {
    const now = new Date();
    this.orderService.getOrders(this.currentTenderIn.createdDate, now).subscribe(orders => {
      const orderIds = orders.map(x => x.id);

      this.orderPaymentService.getOrderPaymentsByOrders(orderIds).subscribe(orderPayments => {
        this.orderPayments = orderPayments;
        this.buildDataSource();
      });
    });
  }

  private buildDataSource() {
    if (!this.payments.length || !this.orderPayments.length) {
      return;
    }

    const tenderInSource = {
      name: 'Tender',
      paymentCode: 'system-tender-in',
      amount: PriceExtension.round(Number(this.currentTenderIn.amount), 2),
      amountDecimal: '0.00'
    };
    tenderInSource.amountDecimal = tenderInSource.amount.toFixed(2);

    this.dataSource = [
      tenderInSource
    ];
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
