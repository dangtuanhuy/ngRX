import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PickupOrderModel } from 'src/app/pos/shared/models/pickup-order.model';
import { CommonConstants } from 'src/app/pos/shared/constants/common.constant';
import { ActivatedRoute } from '@angular/router';
import { FakeService } from 'src/app/pos/shared/services/fake.service';
import { calculateProductsTotalPrice } from 'src/app/pos/shared/models/product-view.model';

@Component({
  selector: 'app-pickup-order-detail',
  templateUrl: './pickup-order-detail.component.html',
  styleUrls: ['./pickup-order-detail.component.scss']
})
export class PickupOrderDetailComponent extends ComponentBase {
  public title = 'Pickup orders';
  public pageWidth = `${CommonConstants.contentPageWidth}px`;
  public order = new PickupOrderModel();

  public totalPriceDecimal = '';

  private orderId = '';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private fakeService: FakeService,
    public injector: Injector
  ) {
    super(injector);
    this.orderId = this._activatedRoute.snapshot.paramMap.get('orderId');
  }

  onInit() {
    this.initGetData();
  }

  onDestroy() {

  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

  private initGetData() {
    this.fakeService.getPickupOrder(this.orderId).subscribe((order: PickupOrderModel) => {
      this.order = order;
      this.totalPriceDecimal = this.formatNumberDecimal(calculateProductsTotalPrice(order.products));
    });
  }
}
