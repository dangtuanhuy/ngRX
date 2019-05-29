import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromAllocationTransaction from '../state/allocation-transaction.reducer';
import * as allocationTransactionActions from '../state/allocation-transaction.action';
import * as allocationTransactionSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-allocation-transaction',
  templateUrl: './delete-allocation-transaction.component.html',
  styleUrls: ['./delete-allocation-transaction.component.css']
})
export class DeleteAllocationTransactionComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromAllocationTransaction.AllocationTransactionState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(allocationTransactionSelector.getSelectedItem), takeWhile(() => this.componentActive))
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

  onDismiss(allocationTransaction: String): void {
    this.activeModal.dismiss(allocationTransaction);
  }

  onSave() {
    this.store.dispatch(new allocationTransactionActions.DeleteAllocationTransaction(this.itemId));
  }
}
