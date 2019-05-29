import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromVendor from '../state/vendor.reducer';
import * as vendorActions from '../state/vendor.action';
import * as vendorSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-vendor',
  templateUrl: './delete-vendor.component.html',
  styleUrls: ['./delete-vendor.component.css']
})
export class DeleteVendorComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromVendor.VendorState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(vendorSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
    this.store.dispatch(new vendorActions.DeleteVendor(this.itemId));
  }
}
