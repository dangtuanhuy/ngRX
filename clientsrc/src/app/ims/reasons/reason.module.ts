import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReasonComponent } from './reason.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { reducer as reasonReducer, key as reasonKey, ReasonState } from './state/reason.reducer';
import { reducer as listViewManagementReducer,
         key as listViewManagementKey, ListViewManagementState
       } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ReasonsEffects } from './state/reason.effect';
import { UpdateReasonComponent } from './update-reason/update-reason.component';
import { AddReasonComponent } from './add-reason/add-reason.component';
import { DeleteReasonComponent } from './delete-reason/delete-reason.component';

const reasonRoutes: Routes = [
  { path: '', component: ReasonComponent },
];

export interface IReasonState {
  reasons_reducer: ReasonState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IReasonState> = {
  reasons_reducer: reasonReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(reasonRoutes),
    StoreModule.forFeature(`reasons`, reducers),
    EffectsModule.forFeature([ReasonsEffects]),
    ReactiveFormsModule
  ],
  declarations: [
    ReasonComponent,
    UpdateReasonComponent,
    AddReasonComponent,
    DeleteReasonComponent
  ],
  entryComponents: [
    UpdateReasonComponent,
    AddReasonComponent,
    DeleteReasonComponent
  ]
})
export class ReasonModule { }
