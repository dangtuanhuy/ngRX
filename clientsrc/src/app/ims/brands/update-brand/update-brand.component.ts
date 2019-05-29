import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from 'src/app/shared/services/brand.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromBrand from '../state/brand.reducer';
import * as brandActions from '../state/brand.action';
import * as brandSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { BrandModel } from '../brand.model';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.css']
})
export class UpdateBrandComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromBrand.BrandState>,
    public injector: Injector
  ) {
    super(injector);
  }

  public brand: BrandModel;
  public componentActive = true;

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      code: ['', Validators.required]
    });

    this.handleSubscription(this.store.pipe(
      select(brandSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new brandActions.GetBrand(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(brandSelector.getBrand), takeWhile(() => this.componentActive))
      .subscribe(
        (brand: BrandModel) => {
          if (brand == null) {
            return;
          }
          this.brand = brand;
          this.updateValueForm.patchValue({
            name: this.brand.name,
            description: this.brand.description,
            code: this.brand.code
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
    const code = this.updateValueForm.get('code').value;
    const brand: BrandModel = {
      id: this.brand.id,
      name: name,
      description: description,
      code: code
    };
    this.store.dispatch(new brandActions.UpdateBrand(brand));
  }
}
