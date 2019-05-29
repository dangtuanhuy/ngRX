import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { LocationService } from 'src/app/shared/services/location.service';
import { Observable, of } from 'rxjs';
import * as locationActions from '../state/location.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { LocationModel } from '../location.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';

const pageSize = 10;

@Injectable()
export class LocationEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private locationService: LocationService
  ) { }

  @Effect()
  getLocations$: Observable<Action> = this.action$
    .pipe(
      ofType(locationActions.LocationActionTypes.GetLocations),
      mergeMap((action: locationActions.GetLocations) =>
        this.locationService
          .getAll(action.payload.page, action.payload.numberItemsPerPage, action.queryText)
          .pipe(map((locations: PagedResult<LocationModel>) => {
            this.store.dispatch(new listViewManagementActions.GetPageSuccessAction(locations));
            return new locationActions.GetLocationsSuccess(locations);
          })
          )
      )
    );

  @Effect()
  getLocation$: Observable<Action> = this.action$
    .pipe(
      ofType(locationActions.LocationActionTypes.GetLocation),
      mergeMap((action: locationActions.GetLocation) =>
        this.locationService
          .getBy(action.payload)
          .pipe(map((location: LocationModel) => {
            return new locationActions.GetLocationSuccess(location);
          })
          )
      )
    );

  @Effect()
  addLocation$: Observable<Action> = this.action$.pipe(
    ofType(locationActions.LocationActionTypes.AddLocation),
    map((action: locationActions.AddLocation) => action.payload),
    mergeMap((Location: LocationModel) =>
      this.locationService.add(Location).pipe(
        map(newLocation => {
          this.store.dispatch(new listViewManagementActions.AddSucessAction());
          this.store.dispatch(new locationActions.GetLocations(new PagingFilterCriteria(1, pageSize), ''));
          return new locationActions.AddLocationSuccess(newLocation);
        }),
        catchError(error => of(new locationActions.AddLocationFail(error)))
      )
    )
  );

  @Effect()
  updateLocation$: Observable<Action> = this.action$.pipe(
    ofType(locationActions.LocationActionTypes.UpdateLocation),
    map((action: locationActions.UpdateLocation) => action.payload),
    mergeMap((Location: LocationModel) =>
      this.locationService.update(Location).pipe(
        map(updatedLocation => {
          this.store.dispatch(new listViewManagementActions.UpdateSucessAction());
          this.store.dispatch(new locationActions.GetLocations(new PagingFilterCriteria(1, pageSize), ''));
          return new locationActions.UpdateLocationSuccess(updatedLocation);
        }),
        catchError(error =>
          of(new locationActions.UpdateLocationFail(error))
        )
      )
    )
  );

  @Effect()
  deleteLocation$: Observable<Action> = this.action$.pipe(
    ofType(locationActions.LocationActionTypes.DeleteLocation),
    map((action: locationActions.DeleteLocation) => action.payload),
    mergeMap((id: string) =>
      this.locationService.remove(id).pipe(
        map(() => {
          this.store.dispatch(new listViewManagementActions.DeleteSucessAction());
          this.store.dispatch(new locationActions.GetLocations(new PagingFilterCriteria(1, pageSize), ''));
          return new locationActions.DeleteLocationSuccess(id);
        }),
        catchError(error =>
          of(new locationActions.DeleteLocationFail(error))
        )
      )
    )
  );
}
