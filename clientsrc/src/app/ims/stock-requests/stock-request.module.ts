import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Routes, RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StockRequestComponent } from './stock-request.component';
import { StockRequestAddComponent } from './stock-request-add/stock-request-add.component';
import {
    reducer as stockRequestReducer,
    key as stockRequestKey,
    StockRequestState
} from './state/stock-request.reducer';
import {
    reducer as listViewManagementReducer,
    key as listViewManagementKey,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { StockRequestEffects } from './state/stock-request.effect';
import { EffectsModule } from '@ngrx/effects';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { StockRequestUpdateComponent } from './stock-request-update/stock-request-update.component';

const stockRequestRoutes: Routes = [
    { path: '', component: StockRequestComponent },
    { path: 'stock-request', component: StockRequestComponent }
];

export interface IStockRequestState {
    stockrequests_reducer: StockRequestState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IStockRequestState> = {
    stockrequests_reducer: stockRequestReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(stockRequestRoutes),
        StoreModule.forFeature('stockrequests', reducers),
        EffectsModule.forFeature([StockRequestEffects]),
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        NgbModule.forRoot(),
        NgbDropdownModule.forRoot(),
        NgxDatatableModule,
        BootstrapModule
    ],
    declarations: [
        StockRequestComponent,
        StockRequestAddComponent,
        StockRequestUpdateComponent],
    entryComponents: [
        StockRequestAddComponent,
        StockRequestUpdateComponent]
})
export class StockRequestModule { }
