import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReasonService } from 'src/app/shared/services/reason.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import * as fromReason from '../state/reason.reducer';
import * as reasonActions from '../state/reason.action';
import * as reasonSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ReasonModel } from '../reason.model';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-update-reason',
  templateUrl: './update-reason.component.html',
  styleUrls: ['./update-reason.component.css']
})
export class UpdateReasonComponent extends ComponentBase {
  updateValueForm: FormGroup = new FormGroup({});
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private store: Store<fromReason.ReasonState>,
    public injector: Injector
  ) {
    super(injector);
  }

  public reason: ReasonModel;
  public componentActive = true;

  onInit() {
    this.updateValueForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: ['']
    });

    this.handleSubscription(this.store.pipe(
      select(reasonSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.store.dispatch(new reasonActions.GetReason(id));
        }
      ));

    this.handleSubscription(this.store.pipe(
      select(reasonSelector.getReason), takeWhile(() => this.componentActive))
      .subscribe(
        (reason: ReasonModel) => {
          if (reason == null) {
            return;
          }
          this.reason = reason;
          this.updateValueForm.patchValue({
            name: this.reason.name,
            description: this.reason.description,
            code: this.reason.code
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
    const reason: ReasonModel = {
      id: this.reason.id,
      name: name,
      description: description,
      code: code
    };
    this.store.dispatch(new reasonActions.UpdateReason(reason));
  }
}
