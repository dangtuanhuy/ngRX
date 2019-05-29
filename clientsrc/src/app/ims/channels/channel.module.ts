import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { ChannelComponent } from './channel.component';
import {
  reducer as channelReducer,
  key as channelKey,
  ChannelState
} from './state/channel.reducer';
import {
  reducer as listViewManagementReducer,
  key as listViewManagementKey,
  ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ChannelEffects } from './state/channel.effect';
import { AddChannelComponent } from './add-channel/add-channel.component';
import { DeleteChannelComponent } from './delete-channel/delete-channel.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EditChannelComponent } from './edit-channel/edit-channel.component';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { ChannelAssignmentModule } from '../channel-assignments/channel-assignment.module';
import { ProvisionChannelComponent } from './provision-channel/provision-channel.component';
import { ChannelCatalogComponent } from './catalog/channel-catalog.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChannelStoreAssignmentModule } from '../channel-store-assignment/channel-store-assignment.module';

const channelRoutes: Routes = [{ path: '', component: ChannelComponent }];

export interface IchannelState {
  channels_reducer: ChannelState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IchannelState> = {
  channels_reducer: channelReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(channelRoutes),
    StoreModule.forFeature(`channels`, reducers),
    EffectsModule.forFeature([ChannelEffects]),
    ReactiveFormsModule,
    ChannelAssignmentModule,
    ChannelStoreAssignmentModule,
    NgxDatatableModule,
    FormsModule
  ],
  declarations: [
    ChannelComponent,
    AddChannelComponent,
    DeleteChannelComponent,
    EditChannelComponent,
    ProvisionChannelComponent,
    ChannelCatalogComponent,
  ],
  providers: [ChannelService],
  entryComponents: [
    AddChannelComponent,
    DeleteChannelComponent,
    EditChannelComponent,
    ProvisionChannelComponent,
    ChannelCatalogComponent
  ]
})
export class ChannelModule {}
