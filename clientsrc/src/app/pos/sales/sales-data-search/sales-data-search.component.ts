import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromActions from '../state/sales.action';
import * as fromSales from '../state/sales.reducer';
import { Store } from '@ngrx/store';
import { PageInputId } from '../../shared/constants/common.constant';
import { VariantService } from '../../shared/services/variant.service';
import { Variant } from '../../shared/models/variant';
import { CustomerService } from '../../shared/services/customer.service';
import { Subject } from 'rxjs';
import { CustomerPagingModel } from '../../shared/view-models/customer-paging.model';

@Component({
  selector: 'app-sales-data-search',
  templateUrl: './sales-data-search.component.html',
  styleUrls: ['./sales-data-search.component.scss']
})
export class SalesDataSearchComponent implements OnInit, OnDestroy {

  public filteredProducts: Variant[] = [];
  public filteredCustomers = [];

  public customerSearchId = '';
  public productSearchId = '';

  public searchCustomerText = '';
  public searchProductText = '';

  private searchProductTextSubject = new Subject<string>();
  private searchCustomerTextSubject = new Subject<string>();

  constructor(
    private store: Store<fromSales.SalesState>,
    private customerService: CustomerService,
    private variantService: VariantService
  ) { }

  ngOnInit() {
    this.initData();

    this.variantService.searchVariants(this.searchProductTextSubject).subscribe((result: any) => {
      if (result) {
        const fromBarCode = result.fromBarCode;
        const data = result.data;
        if (fromBarCode && data.length === 1) {
          this.searchProductText = '';
          this.searchProductTextSubject.next('');
          this.store.dispatch(new fromActions.AddSaleItem(data[0]));
          return;
        }

        this.filteredProducts = data;
      }
    });

    this.customerService.searchCustomersPagingDelay(0, 100, this.searchCustomerTextSubject, false)
      .subscribe((customerPagingModel: CustomerPagingModel) => {
        const customers = customerPagingModel.customers;
        this.filteredCustomers = customers.map(x => {
          const customerSearch = {
            id: x.id,
            name: x.name,
            description: x.name,
            customerCode: x.customerCode,
            reward: x.reward,
            store: x.store,
            visit: x.visit
          };

          return customerSearch;
        });
      });
  }

  ngOnDestroy() {
    this.searchProductTextSubject.unsubscribe();
    this.searchCustomerTextSubject.unsubscribe();
  }

  public onSearchCustomer(value: string) {
    if (!value) {
      this.filteredCustomers = [];
    }

    this.searchCustomerText = value;
    this.searchCustomerTextSubject.next(this.searchCustomerText);
  }

  public onSelectCustomer(customer) {
    this.store.dispatch(new fromActions.SelectCustomer(customer));
  }

  public onSearchProduct(value: string) {
    if (!value) {
      this.filteredProducts = [];
    }

    this.searchProductText = value;
    this.searchProductTextSubject.next(this.searchProductText);
  }

  public onSelectProduct(variant: Variant) {
    this.store.dispatch(new fromActions.AddSaleItem(variant));
  }

  private initData() {
    this.customerSearchId = PageInputId.sales.inputIds.customerSearch;
    this.productSearchId = PageInputId.sales.inputIds.productSearch;
  }
}
