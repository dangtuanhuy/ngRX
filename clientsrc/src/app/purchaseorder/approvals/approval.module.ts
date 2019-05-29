import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { reducer as listViewManagementReducer,
  ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { reducer as approvalReducer , ApprovalState } from './state/approval.reducer';
import { ApprovalEffects } from './state/approval.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ApprovalComponent } from './approval.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ApprovePurchaseOrderComponent } from './approve/approve.component';
import { RejectPurchaseOrderComponent } from './reject/reject.component';
import { ConfirmPurchaseOrderComponent } from './confirm/confirm.component';
import { DetailPurchaseOrderComponent } from './detail/detail.component';

const approvalRoutes: Routes = [{ path: '', component: ApprovalComponent }];

export interface IApprovalState {
  approvals_reducer: ApprovalState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IApprovalState> = {
  approvals_reducer: approvalReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
      CommonModule,
      SharedModule,
      RouterModule.forChild(approvalRoutes),
      StoreModule.forFeature(`approvals`, reducers),
      EffectsModule.forFeature([ApprovalEffects]),
      ReactiveFormsModule,
      FormsModule,
      NgSelectModule
    ],
    declarations: [
      ApprovalComponent,
      ApprovePurchaseOrderComponent,
      RejectPurchaseOrderComponent,
      ConfirmPurchaseOrderComponent,
      DetailPurchaseOrderComponent
    ],
    entryComponents: [
      ApprovePurchaseOrderComponent,
      RejectPurchaseOrderComponent,
      ConfirmPurchaseOrderComponent,
      DetailPurchaseOrderComponent
    ]
})

export class ApprovalModule {}
