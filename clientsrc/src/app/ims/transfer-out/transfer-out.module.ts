import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { TransferOutComponent } from './transfer-out.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddTransferOutComponent } from './add-transfer-out/add-transfer-out.component';
import { reducer as TransferOutReducer, TransferOutState } from './state/transfer-out.reducer';
import { reducer as listViewManagementReducer,
         ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransferOutEffects } from './state/transfer-out.effect';
import { FilterTransferOutComponent } from './filter-transfer-out/filter-transfer-out.component';
import { DetailTransferOutComponent } from './detail-transfer-out/detail-transfer-out.component';
import { ManualAddTransferOutComponent } from './manual-add-transfer-out/manual-add-transfer-out.component';

const transferOutRoutes: Routes = [{ path: '', component: TransferOutComponent }];

export interface ITransferOutState {
    transfer_out_reducer: TransferOutState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<ITransferOutState> = {
    transfer_out_reducer: TransferOutReducer,
    listviewmanagement_reducer: listViewManagementReducer
};


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(transferOutRoutes),
        StoreModule.forFeature(`transfer-outs`, reducers),
        EffectsModule.forFeature([TransferOutEffects]),
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbDropdownModule,
        NgbModule,
        NgxDatatableModule
    ],
    declarations: [
        TransferOutComponent,
        AddTransferOutComponent,
        FilterTransferOutComponent,
        DetailTransferOutComponent,
        ManualAddTransferOutComponent
    ],
    entryComponents: [AddTransferOutComponent, DetailTransferOutComponent, FilterTransferOutComponent]
})
export class TransferOutModule { }
