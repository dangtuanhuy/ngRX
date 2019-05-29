import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { RecentSalesComponent } from './recent-sales.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/recent-sales.reducer';
import { RecentSalesEffects } from './state/recent-sales.effect';
import { recentSalesFeatureName } from './state';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RecentSaleDetailComponent } from './recent-sale-detail/recent-sale-detail.component';
import { PosCommonModule } from '../../shared/pos-common.module';

const routes: Routes = [
    {
        path: '',
        component: RecentSalesComponent
    },
    {
        path: 'detail/:saleId',
        component: RecentSaleDetailComponent
    }
];

@NgModule({
    declarations: [
        RecentSalesComponent,
        RecentSaleDetailComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedPosModule,
        StoreModule.forFeature(recentSalesFeatureName, reducer),
        EffectsModule.forFeature([RecentSalesEffects]),
        NgxDatatableModule,
        PosCommonModule
    ],
    providers: [

    ],
    exports: [
    ]
})
export class RecentSalesModule { }
