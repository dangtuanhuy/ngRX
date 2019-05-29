import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Store, select } from '@ngrx/store';
import * as ChannelStoreAssignmentSelector from './state/index';
import * as fromChannelStoreAssignments from './state/channel-store-assignment.reducer';
import * as channelStoreAssignmentActions from './state/channel-store-assignment.action';
import * as channelSelector from '../channels/state/index';
import * as channelActions from '../channels/state/channel.action';
import * as fromChannel from '../channels/state/channel.reducer';
import * as assignmentActions from 'src/app/shared/components/entity-assignment/state/entity-assignment.action';
import { takeWhile } from 'rxjs/operators';
import { ChannelModel, AddChannelStoreAssignmentModel } from '../channels/channel.model';
import { ChannelService } from 'src/app/shared/services/channel.service';

@Component({
  selector: 'app-channel-store-assignment',
  templateUrl: './channel-store-assignment.component.html',
  styleUrls: ['./channel-store-assignment.component.scss']
})
export class ChannelStoreAssignmentComponent extends ComponentBase {

  componentActive = true;
  channel: ChannelModel;
  title = 'Channel Store Assignment';
  dragTitle = 'Stores';
  assignmentSuccessMessage = 'Store(s) have been assigned successful.';

  constructor(
    private activeModal: NgbActiveModal,
    private notificationService: NotificationService,
    private assignmentStore: Store<fromChannelStoreAssignments.ChannelStoreAssignmentState>,
    private storeChannel: Store<fromChannel.ChannelState>,
    private channelService: ChannelService,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.handleSubscription(this.storeChannel.pipe(
      select(channelSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.storeChannel.dispatch(new channelActions.GetChannel(id));
          this.assignmentStore.dispatch(new channelStoreAssignmentActions.GetChannelStoreAssignments(id));
        }
      ));

    this.handleSubscription(this.storeChannel.pipe(
      select(channelSelector.getChannel), takeWhile(() => this.componentActive))
      .subscribe(
        (result: ChannelModel) => {
          if (result == null) {
            return;
          }

          this.channel = result;
          this.assignmentStore.dispatch(new channelStoreAssignmentActions.GetChannelSuccess(this.channel));
        }));
  }

  onDestroy() {
  }

  searchName(event) {
    this.assignmentStore.dispatch(new channelStoreAssignmentActions.SearchStores(event));
  }

  addAssignment(items) {
    if (items) {
      const channelStoreAssignemnts = items.map(x => new AddChannelStoreAssignmentModel({
        storeId: x.referenceId
      }));

      this.channelService.assignStoresToChannel(channelStoreAssignemnts, this.channel.id).subscribe(result => {
        if (result) {
          this.onClose();
          this.notificationService.success(this.assignmentSuccessMessage);
          this.storeChannel.dispatch(new channelStoreAssignmentActions.ResetChannelStoreAssignments());
          this.assignmentStore.dispatch(new assignmentActions.ResetAssignmentAction());
        }
      });
    }
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onCancel(event) {
    this.storeChannel.dispatch(new channelStoreAssignmentActions.ResetChannelStoreAssignments());
    this.assignmentStore.dispatch(new assignmentActions.ResetAssignmentAction());
  }

}
