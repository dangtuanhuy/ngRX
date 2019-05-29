import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Store, select } from '@ngrx/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AssignmentService } from 'src/app/shared/services/assignment.service';
import * as fromChannel from '../channels/state/channel.reducer';
import * as fromChannelAssignment from './state/channel-assignment.reducer';
import * as channelAssignmentActions from './state/channel-assignment.action';
import * as channelSelector from '../channels/state/index';
import * as channelActions from '../channels/state/channel.action';
import * as assignmentActions from 'src/app/shared/components/entity-assignment/state/entity-assignment.action';
import { takeWhile } from 'rxjs/operators';
import { ChannelModel } from '../channels/channel.model';

@Component({
    templateUrl: './channel-assignment.component.html'
})

export class ChannelAssignmentComponent extends ComponentBase {

    componentActive = true;
    channel: ChannelModel;
    title = 'Channel Assignment';
    dragTitle = 'Assortments';
    addSuccessMessage = 'Channel is added.';

    constructor(private activeModal: NgbActiveModal,
        private notificationService: NotificationService,
        private assignmentService: AssignmentService,
        private store: Store<fromChannelAssignment.ChannelAssignmentState>,
        private storeChannel: Store<fromChannel.ChannelState>,
        public injector: Injector) {
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
                    this.store.dispatch(new channelActions.GetChannel(id));
                    this.store.dispatch(new channelAssignmentActions.GetChannelAssignmentSelected(id));
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
                    this.store.dispatch(new channelAssignmentActions.GetChannelAssignmentSuccess(this.channel));
                }));
    }

    onDestroy() {
    }

    searchName(event) {
        if (event) {
            this.store.dispatch(new channelAssignmentActions.GetChannelAssignmentByName(event));
        } else {
            this.store.dispatch(new channelAssignmentActions.GetAllChannelAssignment());
        }
    }

    addAssignment(items) {
        if (items) {
            this.assignmentService.addChannelAssignment(items, this.channel.id).subscribe(result => {
                if (result) {
                    this.onClose();
                    this.notificationService.success(this.addSuccessMessage);
                    this.store.dispatch(new channelAssignmentActions.ResetChannelAssignment());
                    this.store.dispatch(new assignmentActions.ResetAssignmentAction());
                }
            });
        }
    }

    onClose(): void {
        this.activeModal.close('closed');
    }

    onCancel(event) {
        this.store.dispatch(new channelAssignmentActions.ResetChannelAssignment())
        this.store.dispatch(new assignmentActions.ResetAssignmentAction());
    }

}
