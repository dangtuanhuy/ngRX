import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromPurchaseOrder from '../state/purchase-order.reducer';
import * as purchaseOrderActions from '../state/purchase-order.action';
import * as purchaseOrderSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { PurchaseOrderTypeEnum } from 'src/app/shared/constant/purchase-order.constant';

@Component({
  selector: 'app-delete-purchase-order',
  templateUrl: './delete-purchase-order.component.html',
  styleUrls: ['./delete-purchase-order.component.scss']
})
export class DeletePurchaseOrderComponent extends ComponentBase {
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
                        this.title = 'Delete Purchase Order';
                    }
                    if (type === 'ReturnedOrder') {
                        this.title = 'Delete Return Order';
                    }
                }
            )
    );
  }

  onDestroy() { }

  onClose(): void {
    this.activeModal.close('closed');
  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    this.store.dispatch(new purchaseOrderActions.DeletePurchaseOrder(this.itemId, this.purchaseOrderType));
  }
}
