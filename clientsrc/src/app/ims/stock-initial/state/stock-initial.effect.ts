import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { StockInitialService } from 'src/app/shared/services/stock-initial.service';
import { LocationService } from 'src/app/shared/services/location.service';
import { Observable, of } from 'rxjs';
import * as stockInitialActions from '../state/stock-initial.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { LocationModel } from '../../locations/location.model';

@Injectable()
export class StockInitialEffects {
    constructor(
        private store: Store<any>,
        private action$: Actions,
        private stockInitialService: StockInitialService,
        private locationService: LocationService
    ) { }

    @Effect()
    getLocations$: Observable<Action> = this.action$
        .pipe(
            ofType(stockInitialActions.StockInitialActionTypes.GetLocations),
            mergeMap((action: stockInitialActions.GetLocations) =>
                this.locationService
                    .getAllWithoutPaging()
                    .pipe(
                        map((locations: LocationModel[]) =>
                            new stockInitialActions.GetLocationsSuccess(locations)
                        ), catchError(error =>
                            of(new stockInitialActions.GetLocationsFail(error))
                        )
                    )
            )
        );
}
