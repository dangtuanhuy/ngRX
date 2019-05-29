import { Component, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as fromChannel from '../../channels/state/channel.reducer';
import { ChannelModel } from '../channel.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import * as channelActions from '../state/channel.action';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.scss']
})
export class AddChannelComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  isDeactive: boolean;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromChannel.ChannelState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      server_information: ['', Validators.required]
    });
  }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const server_information = this.addValueForm.get('server_information').value;
    const channel: ChannelModel = {
      id: Guid.empty(),
      name: name,
      description: description,
      serverInformation: server_information,
      isProvision: false
    };
    this.store.dispatch(new channelActions.AddChannel(channel));
  }
}
