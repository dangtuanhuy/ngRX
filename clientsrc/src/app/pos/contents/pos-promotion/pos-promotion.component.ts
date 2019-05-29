import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PageConstants, CommonConstants } from '../../shared/constants/common.constant';
import { Router } from '@angular/router';
import * as fromSales from '../../sales/state/sales.reducer';
import * as salesSeclector from '../../sales/state/index';
import * as salesActions from '../../sales/state/sales.action';
import { Store, select } from '@ngrx/store';
import { Promotion } from '../../shared/models/promotion';
import { Guid } from 'src/app/shared/utils/guid.util';
import { PromotionType } from '../../shared/enums/promotion-type.enum';
import { DiscountReasonType } from '../../shared/enums/discount-reason-type.enum';
import { ProductViewModel } from '../../shared/models/product-view.model';
import { SaleItemPromotion } from '../../shared/models/order-item-promotion';

@Component({
  selector: 'app-pos-promotion',
  templateUrl: './pos-promotion.component.html',
  styleUrls: ['./pos-promotion.component.scss']
})
export class PosPromotionComponent extends ComponentBase {
  public title = 'Promotions';
  public defaultPage = `/${PageConstants.defaultPage}`;
  public pageWidth = `${CommonConstants.contentPageWidth}px`;

  public products: ProductViewModel[] = [];

  constructor(
    private router: Router,
    private saleStore: Store<fromSales.SalesState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.initSelectors();
  }

  onDestroy() {

  }

  public addManualDiscount(event) {
    const promotion = new Promotion();
    promotion.id = Guid.newGuid();
    promotion.promotionTypeId = PromotionType.ManualDiscount;
    promotion.discountTypeId = event.discountType;
    promotion.description = DiscountReasonType[event.discountReasonType];
    promotion.value = event.value;

    this.saleStore.dispatch(new salesActions.AddPromotion(promotion));
  }

  public addVariantDiscount(event) {
    const orderItemPromotion = new SaleItemPromotion();
    orderItemPromotion.id = Guid.newGuid();
    orderItemPromotion.discountType = event.discountType;
    orderItemPromotion.value = event.value;
    orderItemPromotion.selectedPosVariantId = event.selectedPosVariantId;

    this.saleStore.dispatch(new salesActions.AddSaleItemPromotion(orderItemPromotion));
  }

  public onEsc(event) {
    this.router.navigate([PageConstants.quickSelect]);
  }

  private initSelectors() {
    this.handleSubscription(
      this.saleStore.pipe(select(salesSeclector.getProducts)).subscribe((products: ProductViewModel[]) => {
        this.products = products;
        console.log(this.products);
      })
    );
  }
}
