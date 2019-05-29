import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromField from '../state/field.reducer';
import * as fieldActions from '../state/field.action';
import * as fieldSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-field',
  templateUrl: './delete-field.component.html',
  styleUrls: ['./delete-field.component.css']
})
export class DeleteFieldComponent extends ComponentBase {

  public itemId: string;
  public componentActive = true;

  constructor(private activeModal: NgbActiveModal,
    private store: Store<fromField.FieldState>,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.handleSubscription(
      this.store.pipe(select(fieldSelector.getSelectedItem),
        takeWhile(() => this.componentActive))
        .subscribe(
          (id: string) => {
            this.itemId = id;
          }
        ));
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
    this.store.dispatch(new fieldActions.DeleteField(this.itemId));
  }
}
