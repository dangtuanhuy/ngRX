import { Component, Input, Injector } from '@angular/core';
import * as fromProduct from '../../state';
import * as productActions from '../../state/product.actions';
import { Store, select } from '@ngrx/store';
import { FieldValue } from 'src/app/ims/fields/field-base/field-value';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FieldType } from 'src/app/ims/fields/field-base/field-type';
import { VariantModel, PriceEnums, PriceModel } from '../../product';
import { Guid } from 'src/app/shared/utils/guid.util';

const emptyGuid = '00000000-0000-0000-0000-000000000000';

@Component({
  selector: 'app-variants-collection',
  templateUrl: './variants-collection.component.html',
  styleUrls: ['./variants-collection.component.css']
})
export class VariantsCollectionComponent extends ComponentBase {
  @Input() fieldValues: FieldValue<any>[];
  @Input() isEditForm: boolean;
  datasource: VariantModel[];
  prices: PriceModel = {
    listPrice: 0,
    staffPrice: 0,
    memberPrice: 0,
    preOrderPrice: 0
  };

  priceEnums = PriceEnums;
  @Input() columnCount;

  tempLastIndexDataSource: number;
  constructor(
    private store: Store<fromProduct.State>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.getFieldValues();
  }
  onDestroy() {

  }

  AddVariant(e: any) {
    const newArrayFieldValue = [];
    if (this.fieldValues && this.fieldValues.length > 0) {
      this.fieldValues.forEach(item => {
        const newFieldValue: FieldValue<any> = {
          id: item.id,
          fieldId: item.fieldId,
          name: item.name,
          value: null,
          type: FieldType.PredefinedList,
          data: item.data
        };
        newArrayFieldValue.push(newFieldValue);
      });
      const variant: VariantModel = {
        id: Guid.empty(),
        fieldValues: newArrayFieldValue,
        price: {
          listPrice: 0,
          memberPrice: 0,
          staffPrice: 0,
          preOrderPrice: 0
        },
        name: '',
        orderSection: -1,
        isVariantField: true,
        code: null
      };
      this.datasource.push(variant);
      this.store.dispatch(new productActions.ChangeFieldValuesRequest(this.datasource));
    }
  }

  getFieldValues() {
    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getVariants))
        .subscribe(fieldValues => {
          (this.datasource = fieldValues);
          (this.tempLastIndexDataSource = this.datasource.length - 1);
        })
    );
  }

  onSaveField(field: FieldValue<any>, fieldValues: FieldValue<any>[], indexOfField: number, indexOfArrayFieldValues: number) {
    if (indexOfField !== -1 && indexOfArrayFieldValues !== -1) {
      fieldValues.splice(indexOfField, 1, field);
      this.datasource[indexOfArrayFieldValues].fieldValues = fieldValues;
      this.store.dispatch(new productActions.ChangeFieldValuesRequest(this.datasource));
    }
  }

  onClickDelete(e: any, index: number, variantId: string) {
    if (variantId !== emptyGuid) {
      return;
    }
    if (index !== -1 && this.datasource && this.datasource && this.datasource.length > 0) {
      this.datasource.splice(index, 1);
    }
  }

  onChangePrice(e: any, index: any, indexOfVariant: number) {
    this.store.dispatch(new productActions.ChangeFieldValuesRequest(this.datasource));
  }

  checkEmptyVariantId(id: string) {
    return id !== emptyGuid;
  }

  isReadOnly(variant: VariantModel) {
    if (this.isEditForm && (this.datasource.indexOf(variant) <= this.tempLastIndexDataSource)) {
      return true;
    }

    return false;
  }
}
