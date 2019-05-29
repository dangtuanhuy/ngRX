import { NgModule } from '@angular/core';
import { ChannelAssignmentComponent } from './channel-assignment.component';
import {
  reducer as channelAssignmentReducer,
  key as channelAssignmentKey,
  ChannelAssignmentState
} from './state/channel-assignment.reducer';
import {
  reducer as assigmentReducer,
  key as assigmentKey,
  AssignmentState
} from 'src/app/shared/components/entity-assignment/state/entity-assignment.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ChannelAssignmentEffects } from './state/channel-assignment.effect';

export interface IChannelAssignmentState {
  channels_assignment_reducer: ChannelAssignmentState;
  assignment_reducer: AssignmentState;
}

export const reducers: ActionReducerMap<IChannelAssignmentState> = {
  channels_assignment_reducer: channelAssignmentReducer,
  assignment_reducer: assigmentReducer
};

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature(`channel_assignment`, reducers),
    EffectsModule.forFeature([ChannelAssignmentEffects])
  ],
  declarations: [ChannelAssignmentComponent],
  entryComponents: [ChannelAssignmentComponent]
})
export class ChannelAssignmentModule {}
