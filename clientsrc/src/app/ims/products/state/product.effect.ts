import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as productActions from '../state/product.actions';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ProductService } from 'src/app/shared/services/product.service';
import { ProductModel, ProductListModel, ProductModelRequest } from '../product';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { FieldTemplateModel } from '../../field-templates/field-template.model';
import { FieldTemplateService } from 'src/app/shared/services/field-template.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CategoryModel } from '../../categories/category.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class ProductEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private productService: ProductService,
    private fieldTemplateService: FieldTemplateService,
    private categoryService: CategoryService
  ) { }

  @Effect()
  getProducts$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.GetProducts),
    mergeMap((action: productActions.GetProducts) =>
      this.productService
        .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
        .pipe(
          map((products: PagedResult<ProductListModel>) => {
            this.store.dispatch(
              new listViewManagementActions.GetPageSuccessAction(products)
            );
            return new productActions.GetProductsSuccess(products);
          })
        )
    )
  );

  @Effect()
  getFieldTemplates$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.GetFieldTemplates),
    mergeMap((action: productActions.GetFieldTemplates) =>
      this.fieldTemplateService
        .getAllFieldTemplates()
        .pipe(
          map(
            (fieldTemplates: FieldTemplateModel[]) =>
              new productActions.GetFieldTemplatesSuccess(fieldTemplates)
          )
        )
    )
  );

  @Effect()
  getCategories$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.GetCategories),
    mergeMap((action: productActions.GetFieldTemplates) =>
      this.categoryService
        .getAllCategory()
        .pipe(
          map(
            (categories: CategoryModel[]) =>
              new productActions.GetCategoriesSuccess(categories)
          )
        )
    )
  );

  @Effect()
  loadFromTemplate$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.LoadFromTemplate),
    mergeMap((action: productActions.LoadFromTemplate) =>
      this.productService
        .createProductFromTemplate(action.payload)
        .pipe(
          map(
            (productModel: ProductModel) =>
              new productActions.LoadFromTemplateSuccess(productModel)
          )
        )
    )
  );

  @Effect()
  loadFieldTemplateModeEdit$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.LoadFieldTemplate),
    mergeMap((action: productActions.LoadFieldTemplate) =>
      this.productService
        .createProductFromTemplate(action.payload)
        .pipe(
          map(
            (productModel: ProductModel) =>
              new productActions.LoadFieldTemplateSuccess(productModel)
          )
        )
    )
  );

  @Effect()
  getProduct$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.GetProduct),
    mergeMap((action: productActions.GetProduct) =>
      this.productService
        .getById(action.payload)
        .pipe(
          map(
            (productModel: ProductModel) =>
              new productActions.GetProductSuccess(productModel)
          )
        )
    )
  );

  @Effect()
  addProduct$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.AddProduct),
    map((action: productActions.AddProduct) => action.payload),
    mergeMap((product: ProductModelRequest) =>
      this.productService.add(product).pipe(
        map(newProduct => {
          this.store.dispatch(new listViewManagementActions.AddSucessAction());
          this.store.dispatch(new productActions.GetProducts(new PagingFilterCriteria(1, pageSize), ''));
          return new productActions.AddProductSuccess(newProduct);
        }),
        catchError(error => of(new productActions.AddProductFail(error)))
      )
    )
  );
  @Effect()
  updateProduct$: Observable<Action> = this.action$.pipe(
    ofType(productActions.ProductActionTypes.UpdateProduct),
    map((action: productActions.UpdateProduct) => action.payload),
    mergeMap((product: ProductModelRequest) =>
      this.productService.update(product).pipe(
        map(updateProduct => {
          updateProduct.categoryName = product.categoryName;
          this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
          this.store.dispatch(new productActions.GetProducts(new PagingFilterCriteria(1, pageSize), ''));
          return new productActions.UpdateProductSuccess(updateProduct);
        }),
        catchError(error => of(new productActions.UpdateProductFail(error)))
      )
    )
  );

  @Effect()
    deleteProduct$: Observable<Action> = this.action$.pipe(
        ofType(productActions.ProductActionTypes.DeleteProduct),
        map((action: productActions.DeleteProduct) => action.payload),
        mergeMap((id: string) =>
            this.productService.remove(id).pipe(
                map((result) => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new productActions.GetProducts(new PagingFilterCriteria(1, pageSize), ''));
                    return new productActions.DeleteProductSuccess(id);
                }),
                catchError(error =>
                    of(new productActions.DeleteProductFail(error))
                )
            )
        )
    );
}
