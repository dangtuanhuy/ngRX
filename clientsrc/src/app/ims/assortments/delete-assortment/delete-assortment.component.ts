import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromAssortment from '../../assortments/state/assortment.reducer';
import * as assortmentSelector from '../../assortments/state/index';
import { takeWhile } from 'rxjs/operators';
import * as assortmentActions from '../state/assortment.action';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-assortment',
  templateUrl: './delete-assortment.component.html',
  styleUrls: ['./delete-assortment.component.css']
})
export class DeleteAssortmentComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromAssortment.AssortmentState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(assortmentSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
    this.store.dispatch(new assortmentActions.DeleteAssortment(this.itemId));
  }
}
