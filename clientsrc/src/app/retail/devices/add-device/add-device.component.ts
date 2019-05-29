import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceModel } from '../device.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import { LocationModel } from 'src/app/ims/locations/location.model';
import { Store, select } from '@ngrx/store';
import * as fromDevice from '../state';
import * as deviceActions from '../state/device.action';
import { DeviceService } from 'src/app/shared/services/device.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent extends ComponentBase {

  addValueForm: FormGroup = new FormGroup({});
  stores: LocationModel[];
  selectedStore: any;

  constructor(
    private deviceService: DeviceService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromDevice.State>,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      store: ['']
    });

    this.handleSubscription(
      this.store
        .pipe(select(fromDevice.getStores))
        .subscribe(stores => {
          this.stores = stores;
        })
    );

    this.store.dispatch(new deviceActions.GetStores());
  }

  onDestroy() {
  }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const store = this.selectedStore;
    const newDevice: DeviceModel = {
      id: Guid.empty(),
      name: name,
      description: description,
      storeId: store,
      trusted: false,
      userCode: null,
      storeName: ''
    };

    this.store.dispatch(new deviceActions.AddDevice(newDevice));
  }
}
