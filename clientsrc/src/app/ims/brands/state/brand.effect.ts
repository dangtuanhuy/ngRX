import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { BrandService } from 'src/app/shared/services/brand.service';
import * as brandActions from '../state/brand.action';
import { BrandModel } from '../brand.model';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class BrandsEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private brandService: BrandService) { }

    @Effect()
    getBrands$: Observable<Action> = this.action$
        .pipe(
            ofType(brandActions.BrandActionTypes.GetBrands),
            mergeMap((action: brandActions.GetBrands) =>
                this.brandService
                    .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
                    .pipe(map((brands: PagedResult<BrandModel>) => {
                        this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(brands));
                        return new brandActions.GetBrandsSuccess(brands);
                    })
                    )
            )
        );

    @Effect()
    getBrand$: Observable<Action> = this.action$
        .pipe(
            ofType(brandActions.BrandActionTypes.GetBrand),
            mergeMap((action: brandActions.GetBrand) =>
                this.brandService
                    .getBy(action.payload)
                    .pipe(map((brand: BrandModel) => {
                        return new brandActions.GetBrandSuccess(brand);
                    })
                    )
            )
        );

    @Effect()
    addBrand$: Observable<Action> = this.action$.pipe(
        ofType(brandActions.BrandActionTypes.AddBrand),
        map((action: brandActions.AddBrand) => action.payload),
        mergeMap((Brand: BrandModel) =>
            this.brandService.add(Brand).pipe(
                map(newBrand => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new brandActions.GetBrands(new PagingFilterCriteria(1, pageSize), ''));
                    return new brandActions.AddBrandSuccess(newBrand);
                }),
                catchError(error => of(new brandActions.AddBrandFail(error)))
            )
        )
    );

    @Effect()
    updateBrand$: Observable<Action> = this.action$.pipe(
        ofType(brandActions.BrandActionTypes.UpdateBrand),
        map((action: brandActions.UpdateBrand) => action.payload),
        mergeMap((Brand: BrandModel) =>
            this.brandService.update(Brand).pipe(
                map(updatedBrand => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new brandActions.GetBrands(new PagingFilterCriteria(1, pageSize), ''));
                    return new brandActions.UpdateBrandSuccess(updatedBrand);
                }),
                catchError(error =>
                    of(new brandActions.UpdateBrandFail(error))
                )
            )
        )
    );

    @Effect()
    deleteBrand$: Observable<Action> = this.action$.pipe(
        ofType(brandActions.BrandActionTypes.DeleteBrand),
        map((action: brandActions.DeleteBrand) => action.payload),
        mergeMap((id: string) =>
            this.brandService.remove(id).pipe(
                map(() => {
                    this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
                    this.store.dispatch(new brandActions.GetBrands(new PagingFilterCriteria(1, pageSize), ''));
                    return new brandActions.DeleteBrandSuccess(id);
                }),
                catchError(error =>
                    of(new brandActions.DeleteBrandFail(error))
                )
            )
        )
    );
}
