import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as fromChannel from '../state/channel.reducer';
import * as channelActions from '../state/channel.action';
import * as channelSelector from '../state/index';
import { Store, select } from '@ngrx/store';
import { ChannelModel } from '../channel.model';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-update-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.scss']
})
export class EditChannelComponent extends ComponentBase {
  public updateValueForm: FormGroup = new FormGroup({});
  public channel: ChannelModel;
  public componentActive = true;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromChannel.ChannelState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      server_information: ['', Validators.required]
    });

    this.handleSubscription(this.store.pipe(
      select(channelSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new channelActions.GetChannel(id));
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
          this.updateValueForm.patchValue({
            name: this.channel.name,
            description: this.channel.description,
            server_information: this.channel.serverInformation,
          });
        }));
  }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const name = this.updateValueForm.get('name').value;
    const description = this.updateValueForm.get('description').value;
    const server_information = this.updateValueForm.get('server_information').value;
    const channel: ChannelModel = {
      id: this.channel.id,
      name: name,
      description: description,
      serverInformation: server_information,
      isProvision: this.channel.isProvision
    };
    this.store.dispatch(new channelActions.UpdateChannel(channel));
  }
}
