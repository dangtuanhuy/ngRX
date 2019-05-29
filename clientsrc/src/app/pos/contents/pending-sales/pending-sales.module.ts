import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { PendingSalesComponent } from './pending-sales.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/pending-sales.reducer';
import { PendingSalesEffects } from './state/pending-sales.effect';
import { pendingSalesFeatureName } from './state';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PosCommonModule } from '../../shared/pos-common.module';
import { PendingSaleDetailComponent } from './pending-sale-detail/pending-sale-detail.component';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';

const routes: Routes = [
    {
        path: '',
        component: PendingSalesComponent
    },
    {
        path: 'detail/:saleId',
        component: PendingSaleDetailComponent
    }
];

@NgModule({
    declarations: [
        PendingSalesComponent,
        PendingSaleDetailComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedPosModule,
        StoreModule.forFeature(pendingSalesFeatureName, reducer),
        EffectsModule.forFeature([PendingSalesEffects]),
        NgxDatatableModule,
        ConfirmDialogModule,
        PosCommonModule
    ],
    providers: [

    ],
    exports: [
    ]
})
export class PendingSalesModule { }
