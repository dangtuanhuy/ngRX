import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import * as fromApproval from '../state/approval.reducer';
import * as approvalSelector from '../state/index';
import * as fromAuths from '../../../shared/components/auth/state/index';
import * as approvalActions from '../state/approval.action';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { SubmitPurchaseOrderModel } from '../approval.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-confirm-purchase-order',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})

export class ConfirmPurchaseOrderComponent extends ComponentBase {

    public componentActive = true;
    public itemId: string;
    public userId: string;

    constructor( private activeModal: NgbActiveModal, private store: Store<fromApproval.ApprovalState>, public injector: Injector) {
        super(injector);
    }

    onInit() {
        this.handleSubscription(this.store.pipe(
            select(approvalSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.itemId = id;
                }
            ));

            this.handleSubscription(
                this.store
                  .pipe(
                    select(fromAuths.getUserId),
                    takeWhile(() => this.componentActive)
                  )
                  .subscribe((id: string) => {
                    if (id == null) {
                      return;
                    }
                    this.userId = id;
                  })
              );
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
        this.store.dispatch(new approvalActions.ConfirmPurchaseOrder(new SubmitPurchaseOrderModel(this.itemId, this.userId)));
    }
}
