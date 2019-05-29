import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromPurchaseOrder from '../state/purchase-order.reducer';
import * as purchaseOrderActions from '../state/purchase-order.action';
import * as purchaseOrderSelector from '../state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-convert-purchase-order',
    templateUrl: './convert-purchase-order.component.html',
    styleUrls: ['./convert-purchase-order.component.scss']
})
export class ConvertPurchaseOrderComponent extends ComponentBase {

    public title: string;
    public itemId: string;
    public componentActive = true;
    public purchaseOrderType: string;
    constructor(
        private activeModal: NgbActiveModal,
        private store: Store<fromPurchaseOrder.PurchaseOrderState>,
        public injector: Injector
    ) {
        super(injector);
    }
    onInit() {
        this.handleSubscription(this.store.pipe(
            select(purchaseOrderSelector.getSelectedItem), takeWhile(() => this.componentActive))
            .subscribe(
                (id: string) => {
                    if (id == null) {
                        return;
                    }
                    this.itemId = id;
                }
            ));
        this.handleSubscription(
            this.store.pipe(select(purchaseOrderSelector.getPurchaseOrderType))
                .subscribe(
                    (type: string) => {
                        this.purchaseOrderType = type;
                        if (type === 'PurchaseOrder') {
                            this.title = 'Convert Purchase Order';
                        }
                        if (type === 'ReturnedOrder') {
                            this.title = 'Convert Return Order';
                        }
                    }
                )
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
        this.store.dispatch(new purchaseOrderActions.ConvertPurchaseOrder(this.itemId, this.purchaseOrderType));
    }
}

