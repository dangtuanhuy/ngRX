import { Component, OnInit, Input, ViewChild, ViewEncapsulation, Injector } from '@angular/core';
import { PriceModel, ProductModel } from 'src/app/shared/base-model/product.model';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-master-detail-list-view',
  templateUrl: './master-detail-list-view.component.html',
  styleUrls: ['./master-detail-list-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MasterDetailListViewComponent extends ComponentBase {

  @Input() dataSource: any;
  @Input() userSetDefaultColumns: string[];
  @Input() userSetDefaultDetailColumns: string[];

  expanded: any = {};
  @ViewChild('myTable') table: any;

  constructor(
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
  }
  onDestroy() {
  }

  checkPrice(columnName: string) {
    if (columnName === 'Price') {
      return true;
    }
    return false;
  }

  checkFieldValue(columnName: string) {
    if (columnName === 'Fields') {
      return true;
    }
    return false;
  }

  getField(fieldValues: any) {
    let field = '';
    fieldValues.forEach(item => {
      if (field === '') {
        field = item.fieldValue;
      } else {
        field = field + ',' + item.fieldValue;
      }
    });
    return field;
  }

  getPrice(prices: PriceModel) {
    return prices.memberPrice.toFixed(2);
  }

  getDataSourceDetail(dataSource: ProductModel[], productId: string) {
    return dataSource.find(x => x.id === productId).variants;
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }

}
