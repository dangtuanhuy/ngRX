import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as fromLocation from '../state/location.reducer';
import * as locationActions from '../state/location.action';
import * as locationSelector from '../state/index';
import { Store, select } from '@ngrx/store';
import { LocationModel } from '../location.model';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { blankSpaceValidator, GeneralValidation } from 'src/app/shared/utils/validation.util';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent extends ComponentBase {
  public updateValueForm: FormGroup = new FormGroup({});
  public location: LocationModel;
  public componentActive = true;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromLocation.LocationState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      locationCode:  ['', Validators.required],
      type: [''],
      contactPerson: [''],
      phone1: ['', [blankSpaceValidator, Validators.pattern(GeneralValidation.NUMBER_REGEX)]],
      phone2: ['', [blankSpaceValidator, Validators.pattern(GeneralValidation.NUMBER_REGEX)]]
    });

    this.handleSubscription(this.store.pipe(
      select(locationSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new locationActions.GetLocation(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(locationSelector.getLocation), takeWhile(() => this.componentActive))
      .subscribe(
        (location: LocationModel) => {
          if (location == null) {
            return;
          }
          this.location = location;
          this.updateValueForm.patchValue({
            name: this.location.name,
            address: this.location.address,
            locationCode: this.location.locationCode,
            type: this.location.type,
            contactPerson: this.location.contactPerson,
            phone1: this.location.phone1,
            phone2: this.location.phone2
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
    const address = this.updateValueForm.get('address').value;
    const type = +this.updateValueForm.get('type').value;
    const locationCode = this.updateValueForm.get('locationCode').value;
    const contactPerson = this.updateValueForm.get('contactPerson').value;
    const phone1 = this.updateValueForm.get('phone1').value;
    const phone2 = this.updateValueForm.get('phone2').value;
    const location: LocationModel = {
      id: this.location.id,
      name: name,
      address: address,
      locationCode: locationCode,
      type: type,
      contactPerson: contactPerson,
      phone1: phone1,
      phone2: phone2
    };
    this.store.dispatch(new locationActions.UpdateLocation(location));
  }
}
