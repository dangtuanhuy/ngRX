import { Component, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromAssortment from '../../assortments/state/assortment.reducer';
import { AssortmentModel } from '../assortment.model';
import * as assortmentSelector from '../../assortments/state/index';
import { takeWhile } from 'rxjs/operators';
import * as assortmentActions from '../state/assortment.action';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-edit-assortment',
  templateUrl: './edit-assortment.component.html',
  styleUrls: ['./edit-assortment.component.css']
})
export class EditAssortmentComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromAssortment.AssortmentState>,
    public injector: Injector
  ) {
    super(injector);
  }

  public assortment: AssortmentModel;
  public componentActive = true;

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.handleSubscription(this.store.pipe(
      select(assortmentSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new assortmentActions.GetAssortment(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(assortmentSelector.getAssortment), takeWhile(() => this.componentActive))
      .subscribe(
        (assortment: AssortmentModel) => {
          if (assortment == null) {
            return;
          }
          this.assortment = assortment;
          this.updateValueForm.patchValue({
            name: this.assortment.name,
            description: this.assortment.description
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
    const assortment: AssortmentModel = {
      id: this.assortment.id,
      name: name,
      description: description
    };
    this.store.dispatch(new assortmentActions.UpdateAssortment(assortment));
  }
}
