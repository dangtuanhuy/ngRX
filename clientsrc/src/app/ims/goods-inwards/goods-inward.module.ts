import { GoodsInwardsComponent } from './goods-inward.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { EffectsModule } from '@ngrx/effects';
import { GoodsInwardEffects } from './state/goods-inward.effect';
import {
    reducer as goodsInwardReducer,
    key as allocationKey,
    GoodsInwardState
} from './state/goods-inward.reducer';
import {
    reducer as listViewManagementReducer,
    key as listViewManagementKey,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    MassAllocationTransactionComponent
} from '../allocation-transaction/mass-allocation-transaction/mass-allocation-transaction.component';
import { AddGoodsInwardComponent } from './add-goods-inward/add-goods-inward.component';
import { DetailGoodsInwardComponent } from './detail-goods-inward/detail-goods-inward.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const allocationRoutes: Routes = [
    { path: '', component: GoodsInwardsComponent },
];

export interface IGoodsInwardsState {
    goodsInwards_reducer: any;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IGoodsInwardsState> = {
    goodsInwards_reducer: goodsInwardReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(allocationRoutes),
        StoreModule.forFeature(`goods-inward`, reducers),
        EffectsModule.forFeature([GoodsInwardEffects]),
        NgMultiSelectDropDownModule.forRoot(),
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        BootstrapModule,
        NgxDatatableModule,
        NgbModule.forRoot()
    ],
    declarations: [
        GoodsInwardsComponent,
        MassAllocationTransactionComponent,
        AddGoodsInwardComponent,
        DetailGoodsInwardComponent
    ],
    entryComponents: [
        MassAllocationTransactionComponent,
        AddGoodsInwardComponent,
        DetailGoodsInwardComponent
    ]
})
export class GoodsInwardModule { }
