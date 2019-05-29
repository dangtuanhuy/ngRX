import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as categoryActions from '../state/category.action';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { CategoryService } from 'src/app/shared/services/category.service';
import { CategoryModel } from '../category.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class CategoryEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private categoryService: CategoryService) { }

    @Effect()
    getCategories$: Observable<Action> = this.action$
    .pipe(
        ofType(categoryActions.CategoryActionTypes.GetCategories),
        mergeMap((action: categoryActions.GetCategories) =>
            this.categoryService
            .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
            .pipe(map((categories: PagedResult<CategoryModel>) => {
              this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(categories));
              return new categoryActions.GetCategoriesSuccess(categories);
            })
        )
      )
    );

    @Effect()
    getCategory$: Observable<Action> = this.action$
        .pipe(
        ofType(categoryActions.CategoryActionTypes.GetCategory),
        mergeMap((action: categoryActions.GetCategory) =>
            this.categoryService
            .getBy(action.payload)
            .pipe(map((category: CategoryModel) => {
                return new categoryActions.GetCategorySuccess(category);
            })
            )
        )
        );

    @Effect()
    addCategory$: Observable<Action> = this.action$
        .pipe(
            ofType(categoryActions.CategoryActionTypes.AddCategory),
            map((action: categoryActions.AddCategory) => action.payload),
            mergeMap((category: CategoryModel) =>
                this.categoryService.add(category).pipe(
                    map(newCategory => {
                        this.store.dispatch(new listViewManagementActions.AddSucessAction());
                        this.store.dispatch(new categoryActions.GetCategories(new PagingFilterCriteria(1, pageSize), ''));
                        return new categoryActions.AddCategorySuccess(newCategory);
                    }),
                    catchError(error => of(new categoryActions.AddCategoryFail(error)))
                )
            )
        );

    @Effect()
    updateCategory$: Observable<Action> = this.action$.pipe(
        ofType(categoryActions.CategoryActionTypes.UpdateCategory),
        map((action: categoryActions.UpdateCategory) => action.payload),
        mergeMap((category: CategoryModel) =>
            this.categoryService.update(category).pipe(
                map(updatedCategory => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new categoryActions.GetCategories(new PagingFilterCriteria(1, pageSize), ''));
                    return new categoryActions.UpdateCategorySuccess(updatedCategory);
                }),
                catchError(error =>
                    of(new categoryActions.UpdateCategoryFail(error))
                )
            )
        )
    );

    @Effect()
    deleteCategory$: Observable<Action> = this.action$.pipe(
        ofType(categoryActions.CategoryActionTypes.DeleteCategory),
        map((action: categoryActions.DeleteCategory) => action.payload),
        mergeMap((id: string) =>
            this.categoryService.remove(id).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new categoryActions.GetCategories(new PagingFilterCriteria(1, pageSize), ''));
                    return new categoryActions.DeleteCategorySuccess(id);
                }),
                catchError(error =>
                    of(new categoryActions.DeleteCategoryFail(error))
                )
            )
        )
    );
}
