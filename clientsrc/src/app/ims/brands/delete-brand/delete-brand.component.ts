import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromBrand from '../state/brand.reducer';
import * as brandActions from '../state/brand.action';
import * as brandSelector from '../state/index';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
  selector: 'app-delete-brand',
  templateUrl: './delete-brand.component.html',
  styleUrls: ['./delete-brand.component.css']
})
export class DeleteBrandComponent extends ComponentBase {
  public itemId: string;
  public componentActive = true;
  constructor(
    private activeModal: NgbActiveModal,
    private store: Store<fromBrand.BrandState>,
    public injector: Injector
  ) {
    super(injector);
  }

  onInit() {

    this.handleSubscription(this.store.pipe(
      select(brandSelector.getSelectedItem), takeWhile(() => this.componentActive))
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
    this.store.dispatch(new brandActions.DeleteBrand(this.itemId));
  }
}
