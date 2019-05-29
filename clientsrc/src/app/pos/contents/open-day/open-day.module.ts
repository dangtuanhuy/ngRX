import { NgModule } from '@angular/core';
import { OpenDayComponent } from './open-day.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/open-day.reducer';
import { openDayFeatureName } from './state';
import { PosCommonModule } from '../../shared/pos-common.module';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';

const routes: Routes = [
    {
        path: '',
        component: OpenDayComponent
    },
];

@NgModule({
    declarations: [
        OpenDayComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedPosModule,
        PosCommonModule,
        ConfirmDialogModule,
        StoreModule.forFeature(openDayFeatureName, reducer)
    ]
})
export class OpenDayModule { }
