import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromPurchaseOrder from '../state/purchase-order.reducer';
import * as purchaseOrderActions from '../state/purchase-order.action';
import * as purchaseOrderSelector from '../state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { UserManagerModel, SubmitPurchaseOrderModel } from '../purchase-order.model';
import { PurchaseOrderTypeEnum } from 'src/app/shared/constant/purchase-order.constant';

@Component({
    selector: 'app-submit-purchase-order',
    templateUrl: './submit-purchase-order.component.html',
    styleUrls: ['./submit-purchase-order.component.scss']
})

export class SubmitPurchaseOrderComponent extends ComponentBase {

    public title: string;
    public itemId: string;
    public usersManager: UserManagerModel[] = [];
    public managerId: string;
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

        this.handleSubscription(this.store.pipe(
            select(purchaseOrderSelector.getUsersManager), takeWhile(() => this.componentActive))
            .subscribe(
                (users: UserManagerModel[]) => {
                    this.usersManager = [];
                    users.forEach(user => {
                        const userManager = new UserManagerModel(user);
                        this.usersManager.push(userManager);
                    });
                }
            ));

        this.handleSubscription(
            this.store.pipe(select(purchaseOrderSelector.getPurchaseOrderType))
                .subscribe(
                    (type: string) => {
                        this.purchaseOrderType = type;
                        if (type === 'PurchaseOrder') {
                            this.title = 'Submit Purchase Order';
                        }
                        if (type === 'ReturnedOrder') {
                            this.title = 'Submit Return Order';
                        }
                    }
                )
        );
        this.store.dispatch(new purchaseOrderActions.GetUsersManager(['PurchaseManager', 'InventoryManager']));
    }

    onSelectedUser(event: any) {
        this.managerId = event.id;
    }

    onDestroy() {
    }

    onDismiss(reason: String): void {
        this.activeModal.dismiss(reason);
    }

    onSave() {
        this.store.dispatch(new purchaseOrderActions.SubmitPurchaseOrder(new SubmitPurchaseOrderModel(this.itemId, this.managerId),
                                                                                                    this.purchaseOrderType));
    }
}
