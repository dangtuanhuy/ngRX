import { NgModule } from '@angular/core';
import { AssortmentAssignmentComponent } from './assortment-assignment.component';
import {
  reducer as assortmentAssignmentReducer,
  key as assortmentAssignmentKey,
  AssortmentAssignmentState
} from './state/assortment-assignment.reducer';
import {
  reducer as assigmentReducer,
  key as assigmentKey,
  AssignmentState
} from 'src/app/shared/components/entity-assignment/state/entity-assignment.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { AssortmentAssignmentEffects } from './state/assortment-assignment.effect';

export interface IAssortmentAssignmentState {
  assortments_assignment_reducer: AssortmentAssignmentState;
  assignment_reducer: AssignmentState;
}

export const reducers: ActionReducerMap<IAssortmentAssignmentState> = {
  assortments_assignment_reducer: assortmentAssignmentReducer,
  assignment_reducer: assigmentReducer
};

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature(`assortment_assignment`, reducers),
    EffectsModule.forFeature([AssortmentAssignmentEffects])
  ],
  declarations: [AssortmentAssignmentComponent],
  entryComponents: [AssortmentAssignmentComponent]
})
export class AssortmentAssignmentModule {}
