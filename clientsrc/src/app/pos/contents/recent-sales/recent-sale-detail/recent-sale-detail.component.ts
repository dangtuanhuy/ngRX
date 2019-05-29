import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromRecentSaleState from '../state/recent-sales.reducer';
import * as fromRecentSaleActions from '../state/recent-sales.action';
import * as recentSaleSelector from '../state/index';
import { PageConstants, CommonConstants } from 'src/app/pos/shared/constants/common.constant';
import { OrderModel } from 'src/app/pos/shared/models/order';
import { DiscountType } from 'src/app/pos/shared/enums/discount-type.enum';
import { PriceExtension } from 'src/app/pos/shared/helpers/price.extension';
import { SaleItemType } from 'src/app/pos/shared/enums/sale-item-type.enum';

@Component({
  selector: 'app-recent-sale-detail',
  templateUrl: './recent-sale-detail.component.html',
  styleUrls: ['./recent-sale-detail.component.scss']
})
export class RecentSaleDetailComponent extends ComponentBase {
  public title = 'Recent sales';
  public defaultPage = `/${PageConstants.defaultPage}`;
  public pageWidth = `${CommonConstants.contentPageWidth}px`;
  public sale = new OrderModel();

  public dataSource = [];

  private saleId = '';

  constructor(
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private recentSaleStore: Store<fromRecentSaleState.RecentSalesState>,
    public injector: Injector
  ) {
    super(injector);
    this.saleId = this._activatedRoute.snapshot.paramMap.get('saleId');
  }

  onInit() {
    this.initGetSelectors();
  }
  onDestroy() {

  }

  public onClickReprint() {
    this.router.navigate([`${PageConstants.receipt}/${this.saleId}`]);
  }

  public formatNumberDecimal(value: number) {
    return value.toFixed(2);
  }

  public formarDate(date: Date) {
    return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/')
      + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  }

  private initGetSelectors() {
    this.handleSubscription(
      this.recentSaleStore.pipe(select(recentSaleSelector.getRecentSale)).subscribe(sale => {
        if (sale) {
          this.sale = sale;

          this.buildDataSourceForProductsAndPromotions();
        }
      })
    );

    this.recentSaleStore.dispatch(new fromRecentSaleActions.GetRecentSale(this.saleId));
  }

  private buildDataSourceForProductsAndPromotions() {
    const newDataSource = [];
    this.sale.orderItems.forEach(orderItem => {
      newDataSource.push({
        description: orderItem.variant,
        quantity: orderItem.quantity,
        price: orderItem.price,
        amount: orderItem.quantity * orderItem.price,
        type: SaleItemType.Product
      });

      const orderItemPromotions = orderItem.orderItemPromotions;
      if (Array.isArray(orderItemPromotions)) {
        orderItemPromotions.forEach(itemPromotion => {
          const data = {
            description: 'Item discount',
            quantity: '',
            price: 0,
            amount: 0,
            type: SaleItemType.ItemPromotion
          };

          if (itemPromotion.discountType === DiscountType.Money) {
            data.price = -1 * itemPromotion.value;
          }
          if (itemPromotion.discountType === DiscountType.Percent) {
            data.price = -1 * PriceExtension.round(itemPromotion.value * orderItem.price * orderItem.quantity / 100, 2);
          }
          data.amount = data.price;

          newDataSource.push(data);
        });
      }
    });

    const orderTotalPrice = this.calculateDatasourceTotalPrice(newDataSource);
    this.sale.orderPromotions.forEach(orderPromotion => {
      const data = {
        description: orderPromotion.reason,
        quantity: '',
        price: -1 * orderPromotion.value,
        type: SaleItemType.Promotion
      };

      if (orderPromotion.discountType === DiscountType.Percent) {
        data.description += (data.description ? data.description : '') + ` ${orderPromotion.value}(%)`;
        data.price = -1 * PriceExtension.round(orderTotalPrice * orderPromotion.value / 100, 2);
      }

      newDataSource.push(data);
    });

    this.dataSource = newDataSource;
  }

  private calculateDatasourceTotalPrice(datasource: any[]) {
    const filteredSource = datasource.filter(x => x.type === SaleItemType.Product || x.type === SaleItemType.ItemPromotion);
    let totalPrice = 0;
    filteredSource.forEach(element => {
      totalPrice += element.amount;
    });

    return totalPrice;
  }
}
