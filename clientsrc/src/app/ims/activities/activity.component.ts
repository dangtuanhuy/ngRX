import { Component, ViewEncapsulation, Injector } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromActivity from '../activities/state/activity.reducer';
import { ActivityModel, GetActivityRequestModel } from './activity.model';
import { ActionType } from 'src/app/shared/constant/action-type.constant';
import { takeWhile } from 'rxjs/operators';
import * as activityActions from '../activities/state/activity.action';
import * as activitySelector from '../activities/state/index';
import { Button } from 'src/app/shared/base-model/button.model';
import * as fromAuths from '../../shared/components/auth/state/index';
import { UserDefinedColumnSetting } from 'src/app/shared/base-model/user-defined-column-setting.model';
import { PagingFilterCriteria } from 'src/app/shared/base-model/paging-filter-criteria';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { User } from 'src/app/shared/base-model/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivityComponent extends ComponentBase {
  constructor(private store: Store<fromActivity.ActivityState>,
    public injector: Injector) {
    super(injector);
  }
  public pageSize = 10;
  public addSuccessMessage = 'Activity is added.';
  public updateSuccessMessage = 'Activity is updated.';
  public deleteSuccessMessage = 'Activity is deleted.';

  public componentActive = true;
  public datasource: Array<ActivityModel> = [];
  public listButton;
  public title;
  public actionType = ActionType.dialog;
  public selectedId = null;
  public userDefinedColumnSetting: UserDefinedColumnSetting;
  public users: User[] = [];
  public selectedUser: any;
  private userId: string;

  onInit() {
    this.title = 'Activities';
    this.handleSubscription(
      this.store
        .pipe(
          select(fromAuths.getUserId),
          takeWhile(() => this.componentActive)
        )
        .subscribe((id: string) => {
          if (id == null) {
            return;
          }
          this.userDefinedColumnSetting = new UserDefinedColumnSetting(
            `${id}_UserDefinedColumnsActivity`,
            'userName,iPAddress,context,message,date',
            environment.app.ims.apiUrl
          );
          this.userId = id;
          this.setButtonsConfiguration();
        })
    );

    this.getActivities();
    this.getUsers();
  }

  onDestroy() { }

  getActivities() {
    this.store
      .pipe(
        select(activitySelector.getActivities),
        takeWhile(() => this.componentActive)
      )
      .subscribe((activities: Array<ActivityModel>) => {
        this.datasource = activities;
      });
  }

  getUsers() {
    this.store.dispatch(new activityActions.GetUsers());
    this.store.pipe(select(activitySelector.getUsers), takeWhile(() => this.componentActive))
      .subscribe((users: User[]) => {
        users.forEach(x => {
          x.fullName = `${x.firstName} ${x.lastName}`;
        });

        this.users = users;
      });
  }

  changeSelectedPage(page: number) {
    this.store.dispatch(
      new activityActions.GetActivities(
        new GetActivityRequestModel(
          this.userId,
          new PagingFilterCriteria(page + 1, this.pageSize)
        )
      )
    );
  }

  setButtonsConfiguration() {
    this.listButton = [];
  }

  onSelectUser(user: User) {
    if (user) {
      this.userId = user.id;

      this.store.dispatch(
        new activityActions.GetActivities(
          new GetActivityRequestModel(
            this.userId,
            new PagingFilterCriteria(1, this.pageSize)
          )
        )
      );
    }
  }
}
