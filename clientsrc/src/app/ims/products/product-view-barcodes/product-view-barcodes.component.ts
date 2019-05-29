import { Component, Injector, ViewEncapsulation, Input } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { BarCodeProductViewModel } from '../product';

@Component({
  selector: 'app-product-view-barcodes',
  templateUrl: './product-view-barcodes.component.html',
  styleUrls: ['./product-view-barcodes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductViewBarCodesComponent extends ComponentBase {
  @Input() barCodeProductViewModel: BarCodeProductViewModel;
  constructor(public injector: Injector) {
    super(injector);
  }

  onInit() {
  }

  onDestroy() {
  }

  isShowBarcode() {
    return this.barCodeProductViewModel.barCodesVariant.length > 0 ? true : false;
  }
}
