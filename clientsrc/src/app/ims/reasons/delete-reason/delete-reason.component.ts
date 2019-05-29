import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromReason from '../state/reason.reducer';
import * as reasonActions from '../state/reason.action';
import * as reasonSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-delete-reason',
  templateUrl: './delete-reason.component.html',
  styleUrls: ['./delete-reason.component.css']
})
export class DeleteReasonComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromReason.ReasonState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(reasonSelector.getSelectedItem), takeWhile(() => this.componentActive))
      .subscribe(
        (id: string) => {
          if (id == null) {
            return;
          }
          this.itemId = id;
        }
      ));
  }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    this.store.dispatch(new reasonActions.DeleteReason(this.itemId));
  }
}
