import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { ChannelService } from 'src/app/shared/services/channel.service';
import * as channelSelector from '../state/index';
import * as fromChannel from '../state/channel.reducer';
import * as channelActions from '../state/channel.action';
import { select, Store } from '@ngrx/store';
import { takeWhile, map } from 'rxjs/operators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChannelModel } from '../channel.model';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-provision-channel',
    templateUrl: './provision-channel.component.html',
})

export class ProvisionChannelComponent extends ComponentBase {

    public componentActive = true;
    public channelId: string;
    public channel: ChannelModel;
    public updateSuccessMessage = 'Channel has been provision.';

    constructor(private activeModal: NgbActiveModal,
        private channelService: ChannelService,
        private store: Store<fromChannel.ChannelState>,
        private notificationService: NotificationService,
        public injector: Injector) {
        super(injector);
    }

    onInit() {
        this.handleSubscription(this.store.pipe(
            select(channelSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.channelId = id;
                    this.store.dispatch(new channelActions.GetChannel(this.channelId));
                }
            ));
        this.handleSubscription(this.store.pipe(
            select(channelSelector.getChannel), takeWhile(() => this.componentActive))
            .subscribe(
                (channel: ChannelModel) => {
                    if (channel == null) {
                        return;
                    }
                    this.channel = channel;
                }));
    }

    onDestroy() {

    }

    updateChannelProvision() {
        this.channelService.updateProvision(this.channelId).subscribe(() => {
            this.channel.isProvision = true;
            this.store.dispatch(new channelActions.UpdateChannelSuccess(this.channel));
            this.notificationService.success(this.updateSuccessMessage);
            this.onClose();
        });
    }

    onClose(): void {
        this.activeModal.close('closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }
}
