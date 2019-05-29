import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as searchActions from '../state/search.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { SearchService } from 'src/app/shared/services/search.service';
import { IndexModel } from '../search.model';
import { IndexType } from '../index.constant';

@Injectable()
export class SearchEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private searchService: SearchService,
    ) { }

    @Effect()
    rebuildIndex$: Observable<Action> = this.action$
        .pipe(
            ofType(searchActions.SearchActionTypes.RebuildIndex),
            map((action: searchActions.RebuildIndex) => action.payload),
            mergeMap((index: IndexType) =>
                this.searchService.rebuildIndex(index).pipe(
                    map(res => {
                        // this.store.dispatch(new listViewManagementActions.AddSucessAction());
                        return new searchActions.RebuildIndexSuccess(res);
                    }),
                    catchError(error => of(new searchActions.RebuildIndexFail(error)))
                )
            )
        );
}
