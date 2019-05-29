import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as promotionActions from '../state/promotion.action';
import * as fromPromotion from '../state/promotion.reducer';
import * as promotionSelector from '../state/index';
import { Store, select } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { PromotionModel, PromotionStatus } from '../../promotion.model';

@Component({
  selector: 'app-update-promotion-status',
  templateUrl: './update-promotion-status.component.html',
  styleUrls: ['./update-promotion-status.component.scss']
})
export class UpdatePromotionStatusComponent extends ComponentBase {
  public promotions: PromotionModel[] = [];
  public itemId: string;
  public componentActive = true;
  isDeactive: boolean;

  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromPromotion.PromotionState>,
    injector: Injector
  ) {
    super(injector);
  }

  onInit() {
    this.handleSubscription(
      this.store
        .pipe(select(promotionSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
        .pipe(select(promotionSelector.getPromotions), takeWhile(() => this.componentActive))
        .subscribe(
          (promotions: PromotionModel[]) => {
            if (promotions == null) {
              return;
            }

            this.promotions = promotions;
          }
        ));
  }
  onDestroy() {

  }

  onDismiss(reason: String): void {
    this.activeModal.dismiss(reason);
  }

  onSave() {
    const selectedPromotion = this.promotions.find(x => x.id === this.itemId);
    let promotionStatus = PromotionStatus.Default;
    if (selectedPromotion) {
      promotionStatus = selectedPromotion.status === PromotionStatus.Active
        ? PromotionStatus.InActive
        : PromotionStatus.Active;
    }
    const data = {
      id: this.itemId,
      status: promotionStatus
    };

    this.store.dispatch(new promotionActions.UpdatePromotionStatus(data));
  }
}
