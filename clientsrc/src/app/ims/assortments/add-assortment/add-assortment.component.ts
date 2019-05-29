import { Component, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as fromAssortment from '../../assortments/state/assortment.reducer';
import { AssortmentModel } from '../assortment.model';
import { Guid } from 'src/app/shared/utils/guid.util';
import * as assortmentActions from '../state/assortment.action';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-add-assortment',
  templateUrl: './add-assortment.component.html',
  styleUrls: ['./add-assortment.component.css']
})
export class AddAssortmentComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromAssortment.AssortmentState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onDestroy() {}

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const name = this.addValueForm.get('name').value;
    const description = this.addValueForm.get('description').value;
    const assortment: AssortmentModel = {
      id: Guid.empty(),
      name: name,
      description: description
    };
    this.store.dispatch(new assortmentActions.AddAssortment(assortment));
  }
}
