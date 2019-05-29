import { Component, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state';
import * as productActions from '../state/product.actions';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FieldValueModel, VariantModel, ProductModelRequest, VariantModelRequest, ProductModel, LoadViewProductModel } from '../product';
import { FieldValue } from '../../fields/field-base/field-value';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'src/app/shared/utils/guid.util';
import { FieldType } from '../../fields/field-base/field-type';
import { takeWhile } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { isArray } from 'util';
import { CategoryModel } from '../../categories/category.model';
import { FieldTemplateModel } from '../../field-templates/field-template.model';

@Component({
  templateUrl: './product-duplicate.component.html',
  styleUrls: ['./product-duplicate.component.scss']
})
export class ProductDuplicateComponent extends ComponentBase {
  public componentActive = true;
  duplicateValueForm: FormGroup = new FormGroup({});
  product: LoadViewProductModel;
  fieldValues: FieldValue<any>[] = [];
  variants: VariantModel[] = [];
  categories: CategoryModel[];
  fieldTemplates: FieldTemplateModel[];
  selectedFieldTemplateId: string;
  selectedCategory: any;
  invalidVariant = [];
  invalidFields = [];
  columnCount = 0;
  isDuplicateVariant = false;
  fieldTemplate: ProductModel;
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
    this.duplicateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      fieldTemplate: [{ value: '' }],
      category: [{ value: '' }]
    });

    this.getFieldValues();
    this.handleSubscription(
      this.store
        .pipe(
          select(fromProduct.getSelectedItem),
          takeWhile(() => this.componentActive)
        )
        .subscribe((id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new productActions.GetProduct(id));
        })
    );
    this.store.dispatch(new productActions.GetFieldTemplates());
    this.store.dispatch(new productActions.GetCategories());

    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getCategories))
        .subscribe(categories => (this.categories = categories))
    );

    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getFieldTemplates))
        .subscribe(fieldTemplates => (this.fieldTemplates = fieldTemplates))
    );

    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getProduct), takeWhile(() => this.componentActive))
        .subscribe(product => {
          this.product = product;
          if (this.product == null) {
            return;
          }
          if (this.product.fieldTemplateId && this.product.fieldTemplateId !== Guid.empty()) {
            this.getFieldTemplate(this.product.fieldTemplateId);
            this.selectedFieldTemplateId = this.product.fieldTemplateId;
            this.duplicateValueForm.patchValue({
              fieldTemplate: this.product.fieldTemplateId,
              category: this.product.categoryId ? this.product.categoryId : null
            });
          }

          if (this.product && this.product.variants && this.product.variants.length > 0) {
            const datasource = this.product.variants.map(item => {
              return {
                fieldValues: item.fieldValues,
                price: item.price,
                name: '',
                orderSection: 0,
                isVariantField: true,
                id: item.id,
                code: ''
              };
            });
            if (this.product.variants[0].price) {
              this.store.dispatch(new productActions.ChangeFieldValuesRequest(datasource));
            } else {
              this.store.dispatch(new productActions.ChangeFieldValuesRequest([]));
            }
          } else {
            this.store.dispatch(new productActions.ChangeFieldValuesRequest([]));
          }
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
        .pipe(select(fromProduct.getFieldTemplatesModeEdit))
        .subscribe(productModel => {
          this.fieldTemplate = productModel;
          if (this.fieldTemplate && this.fieldTemplate.variants && this.fieldTemplate.variants.length > 0) {
            this.fieldValues = this.fieldTemplate.variants[0].fieldValues;
            if (this.fieldValues) {
              this.columnCount = this.fieldValues.length + 2;
            }
          } else {
            this.fieldValues = [];
          }
        })
    );
  }

  getFieldTemplate(fieldTemplateId: string) {
    this.store.dispatch(new productActions.LoadFieldTemplate(fieldTemplateId));
  }
  onDestroy() { }
  onClose(): void {
    this.activeModal.close('closed');
  }
  onTabChange(e: any) {
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSelectFieldTemplate(e: FieldTemplateModel) {
    this.store.dispatch(new productActions.ChangeFieldValuesRequest([]));
    this.selectedFieldTemplateId = e.id;
    this.store.dispatch(new productActions.LoadFromTemplate(e.id));
  }

  public onSaveField(field: FieldValue<any>) {
    if (field.type === FieldType.Tags
      || field.type === FieldType.EntityReference) {
      field.value = this.buildFieldValueToSave(field);
    }
    this.store.dispatch(new productActions.SaveField(field));
  }

  onSave() {
    const name = this.duplicateValueForm.get('name').value;
    const description = this.duplicateValueForm.get('description').value;
    const fields: FieldValueModel[] = [];
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
    if (this.isDuplicateVariant) {
      this.notificationService.error('Duplicate variant!');
    } else {
      if (this.invalidVariant.length > 0 || this.invalidFields.length > 0) {
        this.notificationService.error('Please fill in all fields!');
      } else {
        const categoryName = this.categories.find(c => c.id === this.selectedCategory).name;
        const productModel: ProductModelRequest = {
          id: Guid.empty(),
          name: name,
          description: description,
          fieldTemplateId: this.selectedFieldTemplateId,
          productFields: fields,
          variants: variants,
          categoryId: this.selectedCategory,
          categoryName: categoryName
        };
        this.store.dispatch(new productActions.AddProduct(productModel));
      }
    }
  }

  private getFieldValue(field: FieldValue<any>) {
    this.invalidFields = [];
    switch (field.type) {
      case FieldType.EntityReference:
        return field.value;
      case FieldType.PredefinedList:
        if (field.value === null) {
          this.invalidFields.push(field);
        }
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
          id: Guid.empty(),
          fieldId: fieldValue.fieldId,
          fieldValue: fieldValue.value === null ? null : fieldValue.value.join(',')
        };
        temp += `,${fieldValueModel.fieldValue}`;
        if (fieldValueModel.fieldValue === null) {
          this.invalidVariant.push(fieldValueModel);
        }
        return fieldValueModel;
      });
      if (arrayValue.includes(temp)) {
        this.isDuplicateVariant = true;
      } else {
        arrayValue.push(temp);
      }
      return {
        id: item.id,
        variantFields: variantFields,
        prices: item.price,
        code: item.code
      };
    });
    return variants;
  }

  getFieldValues() {
    this.handleSubscription(
      this.store
        .pipe(select(fromProduct.getVariants))
        .subscribe((variants: VariantModel[]) => {
          this.variants = variants;
          this.variants.forEach(variant => {
            variant.id = Guid.empty();
          });
        })
    );
  }

  buildValue(field: FieldValue<string>) {
    switch (field.type) {
      case FieldType.Tags:
      case FieldType.EntityReference:
        if (field.value && field.value.includes(',')) {
          return field.value.split(',');
        } else {
          return [field.value];
        }
        break;
      default:
        break;
    }
  }

  buildFieldValueToSave(field: FieldValue<any>) {
    switch (field.type) {
      case FieldType.Tags:
        if (isArray(field.value)) {
          return field.value.join(',');
        } else {
          return '';
        }
        break;
      case FieldType.EntityReference:
        if (field.value) {
          return field.value.value;
        } else {
          return '';
        }
      default:
        break;
    }
  }
}
