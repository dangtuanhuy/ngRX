import { Component, Injector } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as fromPurchaseOrder from '../state/purchase-order.reducer';
import * as purchaseOrderActions from '../state/purchase-order.action';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { InvoiceInfo } from '../purchase-order.model';

@Component({
    selector: 'app-confirm-information-invoice',
    templateUrl: './confirm-information-invoice.component.html',
    styleUrls: ['./confirm-information-invoice.component.scss']
})
export class ConfirmInformationInvoiceComponent extends ComponentBase {

    public soDo = '';

    constructor(
        private activeModal: NgbActiveModal,
        private store: Store<fromPurchaseOrder.PurchaseOrderState>,
        public injector: Injector
    ) {
        super(injector);
    }

    onInit() {

    }

    onDestroy() { }


    onClose(): void {
        this.activeModal.close('closed');
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

    onPrint() {
        const confirmInfo = new InvoiceInfo({soDo: this.soDo});
        this.store.dispatch(new purchaseOrderActions.ConfirmInvoiceInfo(confirmInfo));
        this.activeModal.close('closed');
    }

}
