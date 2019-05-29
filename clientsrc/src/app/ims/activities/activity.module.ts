import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { ActivityComponent } from './activity.component';
import {
  reducer as assortmentReducer,
  key as activityKey,
  ActivityState
} from './state/activity.reducer';
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ActivityEffects } from './state/activity.effect';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

const activitiesRoutes: Routes = [{ path: '', component: ActivityComponent }];

export interface IActivityState {
  activities_reducer: ActivityState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IActivityState> = {
  activities_reducer: assortmentReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(activitiesRoutes),
    StoreModule.forFeature(`activities`, reducers),
    EffectsModule.forFeature([ActivityEffects]),
    ReactiveFormsModule,
    NgSelectModule
  ],
  declarations: [ActivityComponent],
  entryComponents: []
})
export class ActivityModule {}
