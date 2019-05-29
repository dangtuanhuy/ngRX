import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { CommonConstants, PageInputId, PageConstants } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FakeService } from '../../shared/services/fake.service';
import { PickupOrderModel } from '../../shared/models/pickup-order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pickup-order',
  templateUrl: './pickup-order.component.html',
  styleUrls: ['./pickup-order.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PickupOrderComponent extends ComponentBase {
  public title = 'Pickup orders';
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public pickupOrders: PickupOrderModel[] = [];
  public searchOrderId = '';
  public orderSearch = '';

  constructor(
    private fakeService: FakeService,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.searchOrderId = PageInputId.pickupOrders.inputIds.orderSearch;

    this.fakeService.getPickupOrders().subscribe(pickupOrders => {
      this.pickupOrders = pickupOrders;
    });
  }

  onDestroy() {

  }

  public onSearchOrder(event) {

  }

  public onSelectOrder({ selected: selectedOrders }) {
    if (selectedOrders) {
      this.router.navigate([`${PageConstants.pickupOrder}/detail/${selectedOrders[0].id}`]);
    }
  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

}
