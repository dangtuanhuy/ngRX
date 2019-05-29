import { Component, Injector, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PageInputId } from 'src/app/pos/shared/constants/common.constant';
import { DiscountType } from 'src/app/pos/shared/enums/discount-type.enum';
import { DiscountReasonType } from 'src/app/pos/shared/enums/discount-reason-type.enum';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-manual-discount',
  templateUrl: './manual-discount.component.html',
  styleUrls: ['./manual-discount.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManualDiscountComponent extends ComponentBase {
  @Output() addDiscount = new EventEmitter<any>();

  public manualDiscountValueId = '';
  public manualDiscountValue = '0';

  public selectedManualDiscountType = DiscountType.Default;
  public manualDiscountTypes = [];
  public manualDiscountUnit = '$';

  public discountReasonTypes = [];
  public selectedDiscountReasonType = DiscountReasonType.Default;

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

  public onChangeManualDiscountValue(event) {
    this.manualDiscountValue = event;
  }

  public onChangeManualDiscountType(event) {
    if (this.selectedManualDiscountType === DiscountType.Money) {
      this.manualDiscountUnit = '$';
    }

    if (this.selectedManualDiscountType === DiscountType.Percent) {
      this.manualDiscountUnit = '%';
    }
  }

  public onAddManualDiscount(event) {
    const value = Number(this.manualDiscountValue);
    if (value <= 0) {
      this.notificationService.warning('Value equals 0!');
      return;
    }

    this.addDiscount.emit({
      discountReasonType: this.selectedDiscountReasonType,
      discountType: this.selectedManualDiscountType,
      value: this.manualDiscountValue
    });

    this.manualDiscountValue = '0';
  }

  private initData() {
    this.manualDiscountValueId = PageInputId.promotion.pages.manualDiscount.inputIds.manualDiscountValue;
    this.selectedManualDiscountType = DiscountType.Money;
    this.manualDiscountTypes = [
      {
        id: DiscountType.Money,
        value: DiscountType[DiscountType.Money]
      },
      {
        id: DiscountType.Percent,
        value: DiscountType[DiscountType.Percent]
      }
    ];
    this.onChangeManualDiscountType(null);

    this.selectedDiscountReasonType = DiscountReasonType.Bundle;
    const discountReasonTypes = [];
    const discountReasonTypeKeys = Object.keys(DiscountReasonType);
    discountReasonTypeKeys.forEach(key => {
      if (!isNaN(Number(key)) && DiscountReasonType[key] !== DiscountReasonType[DiscountReasonType.Default]) {
        discountReasonTypes.push({
          id: Number(key),
          value: DiscountReasonType[key]
        });
      }
    });
    this.discountReasonTypes = discountReasonTypes;
  }
}
