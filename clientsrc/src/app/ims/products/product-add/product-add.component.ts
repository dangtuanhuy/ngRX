import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state';
import * as productActions from '../state/product.actions';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ProductModel, ProductModelRequest, FieldValueModel, Section, VariantModelRequest, PriceModel, VariantModel } from '../product';
import { FieldValue } from '../../fields/field-base/field-value';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'src/app/shared/utils/guid.util';
import { FieldType } from '../../fields/field-base/field-type';
import { FieldTemplateModel, FieldTemplateTypes, FieldTemplateType } from '../../field-templates/field-template.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { isArray } from 'util';
import { CategoryModel } from '../../categories/category.model';

@Component({
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductAddComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  product: ProductModel;
  fieldTemplates: FieldTemplateModel[];
  categories: CategoryModel[];
  selectedFieldTemplateId: string;
  selectedFieldTemplate: FieldTemplateModel;
  selectedCategory: any;
  fieldValues: FieldValue<any>[] = [];
  variants: VariantModel[];
  columnCount = 0;
  invalidVariant = [];
  invalidFields = [];
  isDuplicateVariant = false;
  prices: PriceModel;
  isEditForm = false;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromProduct.State>,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      fieldTemplate: [''],
      category: ['']
    });

    this.getFieldValues();
    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getProduct))
        .subscribe(productModel => {
          this.product = productModel;
          if (this.product && this.product.variants && this.product.variants.length > 0) {
            this.fieldValues = this.product.variants[0].fieldValues;
            if (this.fieldValues) {
              this.columnCount = this.fieldValues.length + 2;
            }
          } else {
            this.fieldValues = [];
          }
        })
    );

    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getFieldTemplates))
        .subscribe(fieldTemplates => (this.fieldTemplates = fieldTemplates))
    );

    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getCategories))
        .subscribe(categories => (this.categories = categories))
    );

    this.store.dispatch(new productActions.GetFieldTemplates());
    this.store.dispatch(new productActions.GetCategories());
  }


  getFieldValues() {
    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getVariants))
        .subscribe((variants: VariantModel[]) => {
          (this.variants = variants);
        })
    );
  }

  onDestroy() { }

  onSelectFieldTemplate(e: FieldTemplateModel) {
    this.selectedFieldTemplateId = e.id;
    this.store.dispatch(new productActions.LoadFromTemplate(e.id));
    this.store.dispatch(new productActions.ChangeFieldValuesRequest([]));
  }

  public onSaveField(field: FieldValue<any>) {
    if (field.type === FieldType.Tags || field.type === FieldType.EntityReference) {
      field.value = this.buildFieldValueToSave(field);
    }
    this.store.dispatch(new productActions.SaveField(field));
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const fields: FieldValueModel[] = [];
    const category = this.selectedCategory;
    this.product.sections.map(section => {
      section.fieldValues.map(field => {
        fields.push({
          id: field.id,
          fieldId: field.fieldId,
          fieldValue: this.getFieldValue(field)
        });
      });
    });
    const variants = this.getVariantsRequest();
    if (variants && this.variants.length === 0) {
      this.notificationService.error('Variant cannot empty!');
      return;
    }
    if (this.invalidVariant.length > 0 || this.invalidFields.length > 0) {
      this.notificationService.error('Please fill in all fields!');
      return;
    }
    if (this.isDuplicateVariant) {
      this.notificationService.error('Duplicate variant!');
    } else {
      const categoryName = this.selectedCategory ? this.categories.find(c => c.id === this.selectedCategory).name : '';
      const productModel: ProductModelRequest = {
        id: Guid.empty(),
        name: name,
        description: description,
        fieldTemplateId: this.selectedFieldTemplateId,
        productFields: fields,
        variants: variants,
        categoryId: category,
        categoryName: categoryName
      };
      this.store.dispatch(new productActions.AddProduct(productModel));
    }
  }

  private getFieldValue(field: FieldValue<any>) {
    switch (field.type) {
      case FieldType.EntityReference:
        return field.value;
      case FieldType.PredefinedList:
        return field.value === null ? null : field.value.join(',');
      default:
        return field.value;
    }
  }

  private getVariantsRequest() {
    this.invalidVariant = [];
    const arrayValue = [];
    this.isDuplicateVariant = false;
    const variants: VariantModelRequest[] = this.variants.map(item => {
      let temp = '';
      const variantFields: FieldValueModel[] = item.fieldValues.map(fieldValue => {
        const fieldValueModel: FieldValueModel = {
          id: fieldValue.id,
          fieldId: fieldValue.fieldId,
          fieldValue: fieldValue.value === null ? null : fieldValue.value.join(',')
        };
        if (!fieldValueModel.fieldValue) {
          this.invalidVariant.push(fieldValueModel);
        }
        temp += `,${fieldValueModel.fieldValue}`;
        return fieldValueModel;
      });
      if (this.variants && this.variants.length > 1) {
        if (arrayValue.includes(temp)) {
          this.isDuplicateVariant = true;
        } else {
          arrayValue.push(temp);
        }
      }
      return {
        variantFields: variantFields,
        prices: item.price,
        code: item.code
      };
    });
    return variants;
  }

  onTabChange(e: any) {
  }

  buildValue(field: FieldValue<string>) {
    switch (field.type) {
      case FieldType.Tags:
      case FieldType.EntityReference:
        if (field && field.value) {
          if (field.value.includes(',')) {
            return field.value.split(',');
          } else {
            return [field.value];
          }
        } else {
          return [];
        }
        break;
      default:
        break;
    }
  }

  buildFieldValueToSave(field: FieldValue<any>) {
    switch (field.type) {
      case FieldType.Tags:
      case FieldType.EntityReference:
        if (isArray(field.value)) {
          return field.value.join(',');
        } else {
          return '';
        }
        break;
      default:
        break;
    }
  }
}
