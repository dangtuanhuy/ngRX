import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { PageConstants, CommonConstants, PageInputId } from '../../shared/constants/common.constant';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import * as fromRecentSaleState from './state/recent-sales.reducer';
import * as fromRecentSaleActions from './state/recent-sales.action';
import * as recentSaleSelector from './state/index';
import { Router } from '@angular/router';
import { Order } from '../../shared/models/order';

@Component({
  selector: 'app-recent-sales',
  templateUrl: './recent-sales.component.html',
  styleUrls: ['./recent-sales.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RecentSalesComponent extends ComponentBase {
  public title = 'Recent sales';
  public defaultPage = `/${PageConstants.defaultPage}`;
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public recentSales: Order[] = [];
  public searchSaleId = '';
  public saleSearch = '';

  public pageIndex = 0;
  public pageSize = 10;
  public totalItem = 0;

  constructor(
    private recentSaleStore: Store<fromRecentSaleState.RecentSalesState>,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.searchSaleId = PageInputId.recentSales.inputIds.saleSearch;

    this.initGetSelectors();
  }
  onDestroy() {
  }

  public onSelectSale({ selected: selectedSales }) {
    if (selectedSales) {
      this.router.navigate([`${PageConstants.recentSales}/detail/${selectedSales[0].id}`]);
    }
  }

  public onSearch(value) {
    this.saleSearch = value;
    this.getRecentSales();
  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

  public formarDate(date: Date) {
    return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/')
      + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  }

  setPage(pageInfo: { offset: number; }) {
    this.pageIndex = pageInfo.offset;
    this.getRecentSales();
  }

  private initGetSelectors() {
    this.handleSubscription(
      this.recentSaleStore.pipe(select(recentSaleSelector.getPageIndex)).subscribe(pageIndex => {
        this.pageIndex = pageIndex;
      })
    );

    this.handleSubscription(
      this.recentSaleStore.pipe(select(recentSaleSelector.getPageSize)).subscribe(pageSize => {
        this.pageSize = pageSize;
      })
    );

    this.handleSubscription(
      this.recentSaleStore.pipe(select(recentSaleSelector.getTotalItem)).subscribe(totalItem => {
        this.totalItem = totalItem;
      })
    );

    this.handleSubscription(
      this.recentSaleStore.pipe(select(recentSaleSelector.getRecentSales)).subscribe(sales => {
        this.recentSales = sales;
      })
    );

    this.recentSaleStore.dispatch(new fromRecentSaleActions.GetRecentSales({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }));
  }

  getRecentSales() {
    if (this.saleSearch) {
      this.recentSaleStore.dispatch(new fromRecentSaleActions.SearchRecentSales({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        textSearch: this.saleSearch
      }));
    } else {
      this.recentSaleStore.dispatch(new fromRecentSaleActions.GetRecentSales({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }));
    }
  }
}
