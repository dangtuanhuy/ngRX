import { Action } from '@ngrx/store';
import { FieldValue } from '../../fields/field-base/field-value';
import { ProductModel, ProductListModel, VariantModel, ProductModelRequest } from '../product';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { FieldTemplateModel } from '../../field-templates/field-template.model';
import { CategoryModel } from '../../categories/category.model';

export enum ProductActionTypes {
  GetProducts = '[Product] Get Products',
  GetProduct = '[Product] Get Product',
  GetProductSuccess = '[Product] Get Product Success',
  GetProductsSuccess = '[Product] Get Products Success',
  LoadFromTemplate = '[Product] Load From Template',
  LoadFromTemplateSuccess = '[Product] Load From Template Success',
  SaveField = '[Product] Save Field',
  SaveVariantField = '[Product - Variant] Save Field',
  AddProduct = '[Product] Add Product',
  AddProductSuccess = '[Product] Add Product Success',
  AddProductFail = '[Product] Add Product Fail',
  GetFieldTemplates = '[Product] Get Field Templates',
  GetFieldTemplatesSuccess = '[Product] Get Field Templates Success',
  GetCategories = '[Product] Get Categories',
  GetCategoriesSuccess = '[Product] Get Categories Success',
  ChangeFieldValuesRequest = '[Product - Variant] Change Field Values Request',
  UpdateProduct = '[Product] Update Product',
  UpdateProductSuccess = '[Product] Update Product Success',
  UpdateProductFail = '[Product] Update Product Fail',
  LoadFieldTemplate = '[Product] Load Field Template ',
  LoadFieldTemplateSuccess = '[Product] Load Field Template Success',
  DeleteProduct = '[Product] Delete Product',
  DeleteProductSuccess = '[Product] Delete Product Success',
  DeleteProductFail = '[Product] Delete Product Fail',
}

export class GetProducts implements Action {
  readonly type = ProductActionTypes.GetProducts;
  constructor(public payload: PagingFilterCriteria, public queryText: string) { }
}

export class GetProduct implements Action {
  readonly type = ProductActionTypes.GetProduct;
  constructor(public payload: string) { }
}

export class GetProductsSuccess implements Action {
  readonly type = ProductActionTypes.GetProductsSuccess;
  constructor(public payload: PagedResult<ProductListModel>) { }
}

export class LoadFromTemplate implements Action {
  readonly type = ProductActionTypes.LoadFromTemplate;
  constructor(public payload: string) { }
}

export class LoadFromTemplateSuccess implements Action {
  readonly type = ProductActionTypes.LoadFromTemplateSuccess;
  constructor(public payload: ProductModel) { }
}

export class LoadFieldTemplate implements Action {
  readonly type = ProductActionTypes.LoadFieldTemplate;
  constructor(public payload: string) { }
}

export class LoadFieldTemplateSuccess implements Action {
  readonly type = ProductActionTypes.LoadFieldTemplateSuccess;
  constructor(public payload: ProductModel) { }
}

export class GetProductSuccess implements Action {
  readonly type = ProductActionTypes.GetProductSuccess;
  constructor(public payload: ProductModel) { }
}

export class AddProduct implements Action {
  readonly type = ProductActionTypes.AddProduct;
  constructor(public payload: ProductModelRequest) { }
}

export class AddProductSuccess implements Action {
  readonly type = ProductActionTypes.AddProductSuccess;
  constructor(public payload: ProductListModel) { }
}

export class AddProductFail implements Action {
  readonly type = ProductActionTypes.AddProductFail;
  constructor(public payload: string) { }
}

export class UpdateProduct implements Action {
  readonly type = ProductActionTypes.UpdateProduct;
  constructor(public payload: ProductModelRequest) { }
}

export class UpdateProductSuccess implements Action {
  readonly type = ProductActionTypes.UpdateProductSuccess;
  constructor(public payload: any) { }
}

export class UpdateProductFail implements Action {
  readonly type = ProductActionTypes.UpdateProductFail;
  constructor(public payload: string) { }
}

export class DeleteProduct implements Action {
  readonly type = ProductActionTypes.DeleteProduct;
  constructor(public payload: string) { }
}

export class DeleteProductSuccess implements Action {
  readonly type = ProductActionTypes.DeleteProductSuccess;
  constructor(public payload: string) { }
}

export class DeleteProductFail implements Action {
  readonly type = ProductActionTypes.DeleteProductFail;
  constructor(public payload: string) { }
}

export class SaveField implements Action {
  readonly type = ProductActionTypes.SaveField;
  constructor(public payload: FieldValue<any>) { }
}

export class SaveVariantField implements Action {
  readonly type = ProductActionTypes.SaveVariantField;
  constructor(public payload: FieldValue<any>) { }
}

export class GetFieldTemplates implements Action {
  readonly type = ProductActionTypes.GetFieldTemplates;
  constructor() { }
}

export class GetFieldTemplatesSuccess implements Action {
  readonly type = ProductActionTypes.GetFieldTemplatesSuccess;
  constructor(public payload: FieldTemplateModel[]) { }
}

export class GetCategories implements Action {
  readonly type = ProductActionTypes.GetCategories;
  constructor() { }
}

export class GetCategoriesSuccess implements Action {
  readonly type = ProductActionTypes.GetCategoriesSuccess;
  constructor(public payload: CategoryModel[]) { }
}

export class ChangeFieldValuesRequest implements Action {
  readonly type = ProductActionTypes.ChangeFieldValuesRequest;
  constructor(public payload: VariantModel[]) { }
}

export type ProductActions =
  | GetProducts
  | GetProduct
  | GetProductsSuccess
  | GetProductSuccess
  | LoadFromTemplate
  | LoadFromTemplateSuccess
  | SaveField
  | SaveVariantField
  | AddProduct
  | AddProductSuccess
  | AddProductFail
  | GetFieldTemplatesSuccess
  | ChangeFieldValuesRequest
  | UpdateProduct
  | UpdateProductSuccess
  | UpdateProductFail
  | LoadFieldTemplate
  | LoadFieldTemplateSuccess
  | GetCategories
  | GetCategoriesSuccess
  | DeleteProduct
  | DeleteProductSuccess
  | DeleteProductFail;
