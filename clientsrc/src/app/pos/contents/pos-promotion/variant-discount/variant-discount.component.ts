import { Component, Injector, EventEmitter, Output, ViewEncapsulation, Input } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PageInputId } from 'src/app/pos/shared/constants/common.constant';
import { DiscountType } from 'src/app/pos/shared/enums/discount-type.enum';
import { DiscountReasonType } from 'src/app/pos/shared/enums/discount-reason-type.enum';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ProductViewModel } from 'src/app/pos/shared/models/product-view.model';

@Component({
  selector: 'app-variant-discount',
  templateUrl: './variant-discount.component.html',
  styleUrls: ['./variant-discount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VariantDiscountComponent extends ComponentBase {
  @Input() products: ProductViewModel[] = [];
  @Output() addDiscount = new EventEmitter<any>();

  public variantDiscountValueId = '';
  public variantDiscountValue = '0';

  public selectedDiscountType = DiscountType.Default;
  public discountTypes = [];
  public discountUnit = '$';

  public discountReasonTypes = [];
  public selectedProductId = '';

  constructor(
    private notificationService: NotificationService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.initData();
  }
  onDestroy() {
    this.addDiscount.complete();
  }

  public onChangeVariantDiscountValue(event) {
    this.variantDiscountValue = event;
  }

  public onChangeDiscountType(event) {
    if (this.selectedDiscountType === DiscountType.Money) {
      this.discountUnit = '$';
    }

    if (this.selectedDiscountType === DiscountType.Percent) {
      this.discountUnit = '%';
    }
  }

  public onAddVariantDiscount(event) {
    if (!this.selectedProductId) {
      this.notificationService.warning('Please Select Product!');
      return;
    }

    const value = Number(this.variantDiscountValue);
    if (value <= 0) {
      this.notificationService.warning('Value equals 0!');
      return;
    }

    this.addDiscount.emit({
      selectedPosVariantId: this.selectedProductId,
      discountType: this.selectedDiscountType,
      value: value
    });

    this.selectedProductId = '';
    this.variantDiscountValue = '0';
  }


  private initData() {
    this.variantDiscountValueId = PageInputId.promotion.pages.variantDiscount.inputIds.variantDiscountValue;
    this.selectedDiscountType = DiscountType.Money;
    this.discountTypes = [
      {
        id: DiscountType.Money,
        value: DiscountType[DiscountType.Money]
      },
      {
        id: DiscountType.Percent,
        value: DiscountType[DiscountType.Percent]
      }
    ];
  }
}
