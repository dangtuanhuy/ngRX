import { NgModule } from '@angular/core';
import { ChannelStoreAssignmentComponent } from './channel-store-assignment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { ChannelStoreAssignmentState } from './state/channel-store-assignment.reducer';
import {
    reducer as ChannelStoreAssignmentReducer,
    key as channelAssigstoreKey
} from './state/channel-store-assignment.reducer';
import {
    reducer as assigmentReducer,
    key as assigmentKey,
    AssignmentState
} from 'src/app/shared/components/entity-assignment/state/entity-assignment.reducer';
import { ChannelStoreAssignmentEffects } from './state/channel-store-assignment.effect';
import { EffectsModule } from '@ngrx/effects';
export interface IChannelStoreAssignmentState {
    channels_assign_store_reducer: ChannelStoreAssignmentState;
    assignment_reducer: AssignmentState;
}

export const reducers: ActionReducerMap<IChannelStoreAssignmentState> = {
    channels_assign_store_reducer: ChannelStoreAssignmentReducer,
    assignment_reducer: assigmentReducer
};

@NgModule({
    imports: [
        SharedModule,
        StoreModule.forFeature(channelAssigstoreKey, reducers),
        EffectsModule.forFeature([ChannelStoreAssignmentEffects])
    ],
    declarations: [ChannelStoreAssignmentComponent],
    entryComponents: [ChannelStoreAssignmentComponent]
})
export class ChannelStoreAssignmentModule { }
