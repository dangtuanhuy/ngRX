import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { TransferInComponent } from './transfer-in.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AddTransferInComponent } from './add-transfer-in/add-transfer-in.component';
import { reducer as TransferInReducer, TransferInState } from './state/transfer-in.reducer';
import { reducer as listViewManagementReducer,
         ListViewManagementState } from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TransferInEffects } from './state/transfer-in.effect';
import { FilterTransferInComponent } from './filter-transfer-in/filter-transfer-in.component';
import { DetailTransferInComponent } from './detail-transfer-in/detail-transfer-in.component';

const transferInRoutes: Routes = [{ path: '', component: TransferInComponent }];

export interface ITransferInState {
    transfer_in_reducer: TransferInState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<ITransferInState> = {
    transfer_in_reducer: TransferInReducer,
    listviewmanagement_reducer: listViewManagementReducer
};


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(transferInRoutes),
        StoreModule.forFeature(`transfer-ins`, reducers),
        EffectsModule.forFeature([TransferInEffects]),
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbDropdownModule,
        NgbModule,
        NgxDatatableModule
    ],
    declarations: [
        TransferInComponent,
        AddTransferInComponent,
        FilterTransferInComponent,
        DetailTransferInComponent
    ],
    entryComponents: [
        AddTransferInComponent,
        FilterTransferInComponent,
        DetailTransferInComponent
    ]
})
export class TransferInModule { }
