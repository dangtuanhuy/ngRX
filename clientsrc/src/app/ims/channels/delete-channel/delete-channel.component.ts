import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromChannel from '../../channels/state/channel.reducer';
import * as channelSelector from '../../channels/state/index';
import { takeWhile } from 'rxjs/operators';
import * as channelActions from '../state/channel.action';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-channel',
  templateUrl: './delete-channel.component.html',
  styleUrls: ['./delete-channel.component.scss']
})
export class DeleteChannelComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromChannel.ChannelState>,
    public injector: Injector
  ) {
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
          this.itemId = id;
        }
      ));
  }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    this.store.dispatch(new channelActions.DeleteChannel(this.itemId));
  }
}
