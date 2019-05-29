import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';
import * as storeActions from '../state/store.action';
import { StoreService } from 'src/app/shared/services/stores.service';
import { StoreModel } from '../stores.component';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { PagedResult } from 'src/app/shared/base-model/paged-result';

@Injectable()
export class StoreEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private storeService: StoreService
    ) { }


    @Effect()
    getStores$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.StoreActionTypes.GetStores),
        mergeMap((action: storeActions.GetStores) =>
            this.storeService
                .getStoreWithPaging(action.payload.page, action.payload.numberItemsPerPage)
                .pipe(
                    map(
                        (stores: PagedResult<StoreModel>) => {
                            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(stores));
                            return new storeActions.GetStoresSuccess(stores);
                        }

                    )
                )
        )
    );


    @Effect()
    updateStore$: Observable<Action> = this.action$.pipe(
        ofType(storeActions.StoreActionTypes.UpdateStore),
        map((action: storeActions.UpdateStore) => action.payload),
        mergeMap((storeModel: StoreModel) =>
            this.storeService.update(storeModel).pipe(
                map((result: StoreModel) => {
                    this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
                    return new storeActions.UpdateStoreSuccess(result);
                })
            )
        )
    );


    @Effect()
    getStore$: Observable<Action> = this.action$
        .pipe(
            ofType(storeActions.StoreActionTypes.GetStore),
            mergeMap((action: storeActions.GetStore) =>
                this.storeService
                    .getBy(action.payload)
                    .pipe(map((storeModel: StoreModel) => {
                        return new storeActions.GetStoreSuccess(storeModel);
                    })
                    )
            )
        );
}
