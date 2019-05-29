import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as stockRequestActions from '../state/stock-request.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { StockRequestService } from 'src/app/shared/services/stock-request.service';
import { Observable, of, Observer } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import {
    StockRequestListModel,
    StockRequestModel,
    StockRequestModelAddRequest,
    StockTypeViewModel,
    StockRequestModelUpdateRequest
} from '../stock-request.model';
import { LocationService } from 'src/app/shared/services/location.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockTypeService } from 'src/app/shared/services/stock-type.service';
import { ProductModel, ProductListModel } from '../../products/product';
import { LocationModel } from '../../locations/location.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { FilterRequestModel } from '../../goods-inwards/goods-inward.model';


const pageSize = 10;
@Injectable()
export class StockRequestEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private stockRequestService: StockRequestService,
        private locationService: LocationService,
        private stockTypeService: StockTypeService,
        private productService: ProductService) { }

    @Effect()
    getStockRequests$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.GetStockRequests),
        mergeMap((action: stockRequestActions.GetStockRequests) =>
            this.stockRequestService
                .getAll(action.payload.page, action.payload.numberItemsPerPage, action.stockRequestModel)
                .pipe(
                    map((stockRequests: PagedResult<StockRequestListModel>) => {
                        this.store.dispatch(
                            new listViewManagementActions.GetPageSuccessAction(stockRequests)
                        );
                        return new stockRequestActions.GetStockRequestsSuccess(stockRequests);
                    })
                )
        )
    );

    @Effect()
    getStockRequest$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.GetStockRequest),
        mergeMap((action: stockRequestActions.GetStockRequest) =>
            this.stockRequestService
                .getById(action.payload)
                .pipe(
                    map((stockRequest: StockRequestModel) =>
                        new stockRequestActions.GetStockRequestSuccess(stockRequest)
                    )
                )
        )
    );

    @Effect()
    addStockRequest$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.AddStockRequest),
        map((action: stockRequestActions.AddStockRequest) => action.payload),
        mergeMap((stockRequest: StockRequestModelAddRequest) =>
            this.stockRequestService.add(stockRequest).pipe(
                map((newStockRequest: any) => {
                    this.store.dispatch(new listViewManagementActions.AddSucessAction());
                    this.store.dispatch(new stockRequestActions.GetStockRequests(
                        new PagingFilterCriteria(1, pageSize), new FilterRequestModel())
                      );
                    return new stockRequestActions.AddStockRequestSuccess(newStockRequest);
                }),
                catchError(error => of(new stockRequestActions.AddStockRequestFail(error)))
            )
        )
    );

    @Effect()
    getProductsWithoutPaging$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.GetProductsWithoutPaging),
        mergeMap((action: stockRequestActions.GetProductsWithoutPaging) =>
            this.productService
                .getAllWithoutPaging()
                .pipe(
                    map((products: ProductListModel[]) => {
                        return new stockRequestActions.GetProductsWithoutPagingSuccess(products);
                    }
                    )
                )
        )
    );

    @Effect()
    getProductById$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.GetProductById),
        mergeMap((action: stockRequestActions.GetProductById) =>
            this.productService
                .getById(action.payload)
                .pipe(
                    map((product: ProductModel) =>
                        new stockRequestActions.GetProductByIdSuccess(product)
                    )
                )
        )
    );

    @Effect()
    getStockTypes$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.GetStockTypes),
        mergeMap((action: stockRequestActions.GetStockTypes) =>
            this.stockTypeService
                .getAllWithoutPaging()
                .pipe(
                    map((stockTypes: StockTypeViewModel[]) =>
                        new stockRequestActions.GetStockTypesSuccess(stockTypes)
                    )
                )
        )
    );

    @Effect()
    getLoactionsByType$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.GetLocationsByType),
        mergeMap((action: stockRequestActions.GetLocationsByType) =>
            this.locationService
                .getByType(action.payload)
                .pipe(
                    map((locations: LocationModel[]) =>
                        new stockRequestActions.GetLocationsByTypeSuccess(locations)
                    )
                )
        )
    );


    @Effect()
    editStockRequest$: Observable<Action> = this.action$.pipe(
        ofType(stockRequestActions.StockRequestActionTypes.EditStockRequest),
        map((action: stockRequestActions.EditStockRequest) => action.payload),
        mergeMap((stockRequest: StockRequestModelUpdateRequest) =>
            this.stockRequestService.edit(stockRequest).pipe(
                map((updatedStockRequest: StockRequestListModel) => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    this.store.dispatch(new stockRequestActions.GetStockRequests(
                        new PagingFilterCriteria(1, pageSize), new FilterRequestModel())
                      );
                    return new stockRequestActions.EditStockRequestSuccess(updatedStockRequest);
                }),
                catchError(error => of(new stockRequestActions.EditStockRequestFail(error)))
            )
        )
    );
}
