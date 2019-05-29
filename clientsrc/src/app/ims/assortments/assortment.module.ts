import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { AssortmentComponent } from './assortment.component';
import {
  reducer as assortmentReducer,
  key as assortmentKey,
  AssortmentState
} from './state/assortment.reducer';
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AssortmentEffects } from './state/assortment.effect';
import { AddAssortmentComponent } from './add-assortment/add-assortment.component';
import { DeleteAssortmentComponent } from './delete-assortment/delete-assortment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditAssortmentComponent } from './edit-assortment/edit-assortment.component';
import { AssortmentAssignmentComponent } from '../assortment-assignments/assortment-assignment.component';
import { AssortmentAssignmentModule } from '../assortment-assignments/assortment-assignment.module';

const assortmentRoutes: Routes = [{ path: '', component: AssortmentComponent }];

export interface IAssortmentState {
  assortments_reducer: AssortmentState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IAssortmentState> = {
  assortments_reducer: assortmentReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(assortmentRoutes),
    StoreModule.forFeature(`assortments`, reducers),
    EffectsModule.forFeature([AssortmentEffects]),
    ReactiveFormsModule,
    AssortmentAssignmentModule
  ],
  declarations: [
    AssortmentComponent,
    AddAssortmentComponent,
    DeleteAssortmentComponent,
    EditAssortmentComponent
  ],
  entryComponents: [
    AddAssortmentComponent,
    DeleteAssortmentComponent,
    EditAssortmentComponent,
    AssortmentAssignmentComponent
  ]
})
export class AssortmentModule {}
