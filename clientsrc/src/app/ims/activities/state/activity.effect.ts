import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as activityActions from '../state/activity.action';
import * as listViewManagementActions from 'src/app/shared/components/list-view-management/state/list-view-management.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { ActivityService } from '../../../shared/services/activity.service';
import { ActivityModel } from '../activity.model';
import { PagedResult } from 'src/app/shared/base-model/paged-result';
import { AccountService } from 'src/app/shared/services/account.service';
import { User } from 'src/app/shared/base-model/user.model';

@Injectable()
export class ActivityEffects {
  constructor(
    private store: Store<any>,
    private action$: Actions,
    private activityService: ActivityService,
    private accountSerivce: AccountService
  ) { }

  @Effect()
  getActivities$: Observable<Action> = this.action$.pipe(
    ofType(activityActions.ActivityActionTypes.GetActivities),
    mergeMap((action: activityActions.GetActivities) =>
      this.activityService
        .getAll(
          action.payload.userId,
          action.payload.paging.page,
          action.payload.paging.numberItemsPerPage
        )
        .pipe(
          map((activities: PagedResult<ActivityModel>) => {
            this.store.dispatch(
              new listViewManagementActions.GetPageSuccessAction(activities)
            );
            return new activityActions.GetActivitiesSuccess(activities);
          })
        )
    )
  );

  @Effect()
  getUsers$: Observable<Action> = this.action$.pipe(
    ofType(activityActions.ActivityActionTypes.GetUsers),
    mergeMap((action: activityActions.GetUsers) =>
      this.accountSerivce
        .getAll()
        .pipe(
          map((users: User[]) => new activityActions.GetUsersSuccess(users))
        )
    )
  );
}
