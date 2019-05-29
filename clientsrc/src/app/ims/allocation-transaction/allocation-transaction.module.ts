import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { reducer as AllocationTransactionReducer,
         key as AllocationTransactionKey, AllocationTransactionState
       } from './state/allocation-transaction.reducer';
import { reducer as listViewManagementReducer,
         key as listViewManagementKey, ListViewManagementState
       } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { AllocationTransactionEffects } from './state/allocation-transaction.effect';
import { AddAllocationTransactionComponent } from './add-allocation-transaction/add-allocation-transaction.component';
import { UpdateAllocationTransactionComponent } from './update-allocation-transaction/update-allocation-transaction.component';
import { DeleteAllocationTransactionComponent } from './delete-allocation-transaction/delete-allocation-transaction.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AllocationTransactionComponent } from './allocation-transaction.component';
import { SubmitAllocationTransactionComponent } from './submit-allocation-transaction/submit-allocation-transaction.component';

const allocationTransactionRoutes: Routes = [
  { path: '', component: AllocationTransactionComponent },
];

export interface IAllocationTransactionState {
  stock_allocation_reducer: AllocationTransactionState;
  listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IAllocationTransactionState> = {
  stock_allocation_reducer: AllocationTransactionReducer,
  listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(allocationTransactionRoutes),
    StoreModule.forFeature(`stock-allocation`, reducers),
    EffectsModule.forFeature([AllocationTransactionEffects]),
    ReactiveFormsModule,
    NgSelectModule,
    NgbDropdownModule,
    FormsModule,
    NgbModule
  ],
  declarations: [
    AllocationTransactionComponent,
    AddAllocationTransactionComponent,
    UpdateAllocationTransactionComponent,
    DeleteAllocationTransactionComponent,
    SubmitAllocationTransactionComponent
  ],
  entryComponents: [
    AddAllocationTransactionComponent,
    UpdateAllocationTransactionComponent,
    DeleteAllocationTransactionComponent,
    SubmitAllocationTransactionComponent
  ]
})
export class AllocationTransactionModule { }
