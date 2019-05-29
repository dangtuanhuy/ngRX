import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromBrand from '../state/brand.reducer';
import * as brandActions from '../state/brand.action';
import { Guid } from 'src/app/shared/utils/guid.util';
import { BrandModel } from '../brand.model';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.css']
})

export class AddBrandComponent extends ComponentBase {
  addValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromBrand.BrandState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.addValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      code: ['', Validators.required]
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
    const brand: BrandModel = {
      id: Guid.empty(),
      name: name,
      description: description,
      code: code
    };
    this.store.dispatch(new brandActions.AddBrand(brand));
  }
}
