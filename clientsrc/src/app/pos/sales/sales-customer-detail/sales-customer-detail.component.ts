import { Component, OnInit, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromSales from '../state/sales.reducer';
import * as salesSeclector from '../state/index';
import { CustomerModel } from 'src/app/shared/base-model/customer.model';
import { Router } from '@angular/router';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-sales-customer-detail',
  templateUrl: './sales-customer-detail.component.html',
  styleUrls: ['./sales-customer-detail.component.scss']
})
export class SalesCustomerDetailComponent extends ComponentBase {

  public customer: CustomerModel = new CustomerModel();
  public loadedCustomer = false;

  constructor(
    private store: Store<fromSales.SalesState>,
    private router: Router,
    private notificationSerivce: NotificationService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.store.pipe(select(salesSeclector.getCustomer)).subscribe(customer => {
      if (customer) {
        this.customer = customer;
        this.loadedCustomer = true;
      } else {
        this.customer = new CustomerModel();
        this.loadedCustomer = false;
      }
    });
  }

  onDestroy() {
  }

  onClickProfile() {
    if (!this.loadedCustomer) {
      this.notificationSerivce.error('Please add customer');
      return;
    }

    this.router.navigateByUrl(`/customer-management/${this.customer.id}`);
  }
}
