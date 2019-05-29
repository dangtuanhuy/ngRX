import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { CommonConstants, PageInputId, PageConstants } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { CustomerService } from '../../shared/services/customer.service';
import { Customer } from '../../shared/models/customer';
import { Subject } from 'rxjs';
import { CustomerPagingModel } from '../../shared/view-models/customer-paging.model';
import * as fromCustomers from './state/customer.reducer';
import * as customersSeclector from './state/index';
import * as customersActions from './state/customer.action';
import { Store, select } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerComponent extends ComponentBase {
  public title = 'Customer management';
  public defaultPage = '';
  public pageWidth = `${CommonConstants.contentPageWidth}px`;
  public customers: Customer[] = [];

  public searchCustomerInputId = '';
  private searchCustomerSubject = new Subject<string>();
  public searchCustomerText = '';

  public pageIndex = 0;
  public pageSize = 10;
  public totalItem = 0;

  private thefirstTime = true;

  columns = [
    { id: 'Id' },
    { name: 'name' },
    { store: 'Store' },
    { reward: 'Reward' }
  ];

  constructor(private customerService: CustomerService,
    private store: Store<fromCustomers.CustomerState>,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.searchCustomerInputId = PageInputId.customerManagement.inputIds.customerSearch;

    this.customerService.searchCustomersPagingDelay(this.pageIndex, this.pageSize, this.searchCustomerSubject)
      .subscribe((response: CustomerPagingModel) => {
        this.customers = response.customers;
        this.totalItem = response.totalItem;
      });

    this.initSelectors();
  }

  initSelectors() {
    this.handleSubscription(
      this.store.pipe(select(customersSeclector.getPageInformation)).subscribe(pageInformation => {
        if (pageInformation) {
          this.pageSize = pageInformation.pageSize;
          this.searchCustomerText = pageInformation.searchText;
          this.pageIndex = pageInformation.pageIndex;

          if (pageInformation.searchText && this.thefirstTime) {
            this.pageIndex = 0;
          }

          this.thefirstTime = false;
        }

        this.loadCustomers();
      })
    );
  }

  onDestroy() {
    this.searchCustomerSubject.unsubscribe();
  }

  searchCustomer(event) {
    if (this.searchCustomerText !== event) {
      this.pageIndex = 0;
    }
    this.searchCustomerText = event;

    this.store.dispatch(new customersActions.UpdateSearchInformation({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      totalItem: this.totalItem,
      searchText: this.searchCustomerText
    }));
  }

  loadCustomers() {
    if (this.searchCustomerText === '') {
      this.customerService.getCustomersPaging(this.pageIndex, this.pageSize).subscribe((response: CustomerPagingModel) => {
        this.customers = response.customers;
        this.totalItem = response.totalItem;
      });
    } else {
      this.customerService.searchCustomersPaging(this.pageIndex, this.pageSize, this.searchCustomerText)
        .subscribe((response: CustomerPagingModel) => {
          this.customers = response.customers;
          this.totalItem = response.totalItem;
        });

      this.searchCustomerSubject.next(this.searchCustomerText);
    }
  }

  setPage(pageInfo: { offset: number; }) {
    this.pageIndex = pageInfo.offset;

    this.store.dispatch(new customersActions.UpdateSearchInformation({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      totalItem: this.totalItem,
      searchText: this.searchCustomerText
    }));
  }

  onClickCustomer(customerId: string) {
    this.store.dispatch(new customersActions.UpdateSearchInformation({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      totalItem: this.totalItem,
      searchText: this.searchCustomerText
    }));

    this.router.navigate([`${PageConstants.customerManagement}/${customerId}`]);
  }

  onBack() {
    this.store.dispatch(new customersActions.ClearSearchInformation());
  }
}
