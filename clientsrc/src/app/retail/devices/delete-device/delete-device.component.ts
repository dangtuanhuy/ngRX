import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromDevice from '../../devices/state/device.reducer';
import { Store, select } from '@ngrx/store';
import * as deviceActions from '../../devices/state/device.action';
import * as deviceSelector from '../../devices/state/index';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-delete-device',
  templateUrl: './delete-device.component.html',
  styleUrls: ['./delete-device.component.scss']
})
export class DeleteDeviceComponent extends ComponentBase {

  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromDevice.DeviceState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(deviceSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
    this.store.dispatch(new deviceActions.DeleteDevice(this.itemId));
  }

}
