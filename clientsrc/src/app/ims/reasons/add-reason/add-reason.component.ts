import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromReason from '../state/reason.reducer';
import * as reasonActions from '../state/reason.action';
import { Guid } from 'src/app/shared/utils/guid.util';
import { ReasonModel } from '../reason.model';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-add-reason',
  templateUrl: './add-reason.component.html',
  styleUrls: ['./add-reason.component.css']
})

export class AddReasonComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromReason.ReasonState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['']
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
    const code = this.addValueForm.get('code').value;
    const reason: ReasonModel = {
      id: Guid.empty(),
      name: name,
      description: description,
      code: code
    };
    this.store.dispatch(new reasonActions.AddReason(reason));
  }
}
