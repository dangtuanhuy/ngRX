import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromLocation from '../state/location.reducer';
import * as locationActions from '../state/location.action';
import * as locationSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-location',
  templateUrl: './delete-location.component.html',
  styleUrls: ['./delete-location.component.scss']
})
export class DeleteLocationComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  public subscription: Subscription;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromLocation.LocationState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(locationSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
    this.store.dispatch(new locationActions.DeleteLocation(this.itemId));
  }
}
