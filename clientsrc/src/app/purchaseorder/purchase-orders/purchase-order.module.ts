import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseOrderComponent } from './purchase-order.component';
import { AddPurchaseOrderComponent } from './add-purchase-order/add-purchase-order.component';
import { DeletePurchaseOrderComponent } from './delete-purchase-order/delete-purchase-order.component';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer as listViewManagementReducer,
  ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { reducer as purchaseOderReducer , PurchaseOrderState } from './state/purchase-order.reducer';
import { PurchaseOrderEffects } from './state/purchase-order.effect';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { UpdatePurchaseOrderComponent } from './update-purchase-order/update-purchase-order.component';
import { ConvertPurchaseOrderComponent } from './convert-purchase-order/convert-purchase-order.component';
import { SubmitPurchaseOrderComponent } from './submit-purchase-order/submit-purchase-order.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ByPassPurchaseOrderComponent } from './bypass-purchase-order/bypass-purchase-order.component';
import { ConfirmInformationInvoiceComponent } from './confirm-information-invoice/confirm-information-invoice.component';

const purchaseOrderRoutes: Routes = [{ path: '', component: PurchaseOrderComponent }];
export interface IPurchaseOderState {
  purchase_orders_reducer: PurchaseOrderState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IPurchaseOderState> = {
  purchase_orders_reducer: purchaseOderReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(purchaseOrderRoutes),
      StoreModule.forFeature(`purchase-orders`, reducers),
      EffectsModule.forFeature([PurchaseOrderEffects]),
      NgbModule.forRoot(),
      ReactiveFormsModule,
      FormsModule,
      NgSelectModule
    ],
    declarations: [
      PurchaseOrderComponent,
      AddPurchaseOrderComponent,
      UpdatePurchaseOrderComponent,
      ConvertPurchaseOrderComponent,
      DeletePurchaseOrderComponent,
      SubmitPurchaseOrderComponent,
      ByPassPurchaseOrderComponent,
      ConfirmInformationInvoiceComponent
    ],
    entryComponents: [
      AddPurchaseOrderComponent,
      UpdatePurchaseOrderComponent,
      ConvertPurchaseOrderComponent,
      DeletePurchaseOrderComponent,
      SubmitPurchaseOrderComponent,
      ByPassPurchaseOrderComponent,
      ConfirmInformationInvoiceComponent
    ]
})

export class PurchaseOrderModule {}
