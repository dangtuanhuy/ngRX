import { Routes, RouterModule } from '@angular/router';
import { GoodsReturnsComponent } from './goods-returns.component';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import {
    reducer as listViewManagementReducer,
    key as listViewManagementKey,
    ListViewManagementState
} from 'src/app/shared/components/list-view-management/state/list-view-management.reducer';
import {
    reducer as goodsReturnReducer,
    key as goodsReturnKey,
    GoodsReturnState
} from './state/goods-return.reducer';
import { GoodsReturnEffects } from './state/goods-return.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapModule } from 'src/app/shared/bootstrap.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetailGoodsReturnComponent } from './detail-goods-return/detail-goods-return.component';
import { AddGoodsReturnComponent } from './add-goods-return/add-goods-return.component';

const allocationRoutes: Routes = [
    { path: '', component: GoodsReturnsComponent },
];

export interface IGoodsReturnsState {
    goodsReturns_reducer: any;
    listviewmanagement_reducer: ListViewManagementState;
}

export const reducers: ActionReducerMap<IGoodsReturnsState> = {
    goodsReturns_reducer: goodsReturnReducer,
    listviewmanagement_reducer: listViewManagementReducer
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(allocationRoutes),
        StoreModule.forFeature(`goods-return`, reducers),
        EffectsModule.forFeature([GoodsReturnEffects]),
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule,
        BootstrapModule,
        NgxDatatableModule,
        NgbModule.forRoot()
    ],
    declarations: [
        GoodsReturnsComponent,
        DetailGoodsReturnComponent,
        AddGoodsReturnComponent,
    ],
    entryComponents: [
        DetailGoodsReturnComponent,
        AddGoodsReturnComponent
    ]
})
export class GoodsReturnModule { }
