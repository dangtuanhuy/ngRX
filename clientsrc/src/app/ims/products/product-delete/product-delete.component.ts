import { Component, Injector } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store, select } from '@ngrx/store';
import * as fromProduct from '../state';
import * as productActions from '../state/product.actions';
import { takeWhile } from 'rxjs/operators';
import { ComponentBase } from 'src/app/shared/components/component-base';
import { LoadViewProductModel } from '../product';

@Component({
  selector: 'app-delete-product',
  templateUrl: './product-delete.component.html',
  styleUrls: ['./product-delete.component.scss']
})
export class DeleteProductComponent extends ComponentBase {

  public itemId: string;
  public componentActive = true;
  product: LoadViewProductModel;

  constructor(private activeModal: NgbActiveModal,
    private store: Store<fromProduct.State>,
    public injector: Injector) {
    super(injector);
  }

  onInit() {
    this.handleSubscription(
        this.store.pipe(select(fromProduct.getSelectedItem),
          takeWhile(() => this.componentActive))
          .subscribe(
            (id: string) => {
              this.itemId = id;
            }
          ));
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
    this.store.dispatch(new productActions.DeleteProduct(this.itemId));
  }
}
