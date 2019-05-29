import {
    reducer as assortmentReducer,
    key as stockInitialKey,
    StockInitialState
} from './state/stock-initial.reducer';
import {
    reducer as listViewManagementReducer,
    key as listViewManagementKey,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { Routes, RouterModule } from '@angular/router';
import { StockInitialComponent } from './stock-initial.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { ImportCsvComponent } from './import-csv/import-csv.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StockInitialEffects } from './state/stock-initial.effect';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const homeRoutes: Routes = [{ path: '', component: StockInitialComponent }];

export interface IStockInitialState {
    stockInitial_reducer: StockInitialState;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IStockInitialState> = {
    stockInitial_reducer: assortmentReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(homeRoutes),
        StoreModule.forFeature(`stock-initial`, reducers),
        EffectsModule.forFeature([StockInitialEffects]),
        NgbModule.forRoot(),
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule
    ],
    declarations: [StockInitialComponent, ImportCsvComponent],
    entryComponents: [ImportCsvComponent]
})
export class StockInitialModule { }
