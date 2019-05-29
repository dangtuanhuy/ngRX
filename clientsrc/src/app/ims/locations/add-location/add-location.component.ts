import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromLocation from '../state/location.reducer';
import * as locationActions from '../state/location.action';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { Guid } from 'src/app/shared/utils/guid.util';
import { LocationModel } from '../location.model';
import { blankSpaceValidator, GeneralValidation } from 'src/app/shared/utils/validation.util';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromLocation.LocationState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      locationCode: ['', Validators.required],
      type: [1, Validators.required],
      contactPerson: [''],
      phone1: ['', [blankSpaceValidator, Validators.pattern(GeneralValidation.NUMBER_REGEX)]],
      phone2: ['', [blankSpaceValidator, Validators.pattern(GeneralValidation.NUMBER_REGEX)]]
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
    const address = this.addValueForm.get('address').value;
    const locationCode = this.addValueForm.get('locationCode').value;
    const type = this.addValueForm.get('type').value;
    const contactPerson = this.addValueForm.get('contactPerson').value;
    const phone1 = this.addValueForm.get('phone1').value;
    const phone2 = this.addValueForm.get('phone2').value;
    const location: LocationModel = {
      id: Guid.empty(),
      name: name,
      address: address,
      locationCode: locationCode,
      type: type,
      contactPerson: contactPerson,
      phone1: phone1,
      phone2: phone2
    };
    this.store.dispatch(new locationActions.AddLocation(location));
  }
}
