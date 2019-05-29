import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import * as fromAllocationTransaction from '../state/allocation-transaction.reducer';
import * as allocationTransactionActions from '../state/allocation-transaction.action';
import * as allocationTransactionSelector from '../state/index';
import { UpdateStatusAllocationTransactionModel, AllocationTransactionStatus } from '../allocation-transaction.model';
import { NotificationService } from 'src/app/shared/services/notification.service';


@Component({
  selector: 'app-submit-allocation-transaction',
  templateUrl: './submit-allocation-transaction.component.html',
  styleUrls: ['./submit-allocation-transaction.component.scss']
})
export class SubmitAllocationTransactionComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  public updateStatusSuccessMessage = 'AllocationTransaction Status is updated.';
  constructor(
    private activeModal: NgbActiveModal,
    private notificationService: NotificationService,
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
    const updateStatusAllocationTransactionModel: UpdateStatusAllocationTransactionModel = {
      id: this.itemId,
      status: AllocationTransactionStatus.Submitted
    };
    this.store.dispatch(new allocationTransactionActions.UpdateStatusAllocationTransaction(updateStatusAllocationTransactionModel));
    this.onClose();
    this.notificationService.success(this.updateStatusSuccessMessage);
  }
}
