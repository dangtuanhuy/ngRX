import { NgModule } from '@angular/core';
import { CloseDayComponent } from './close-day.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/close-day.reducer';
import { closeDayFeatureName } from './state';
import { PosCommonModule } from '../../shared/pos-common.module';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
import { CloseDayReportComponent } from './close-day-report/close-day-report.component';
import { CloseDayTenderReportComponent } from './close-day-tender-report/close-day-tender-report.component';

const routes: Routes = [
    {
        path: '',
        component: CloseDayComponent
    }
];

@NgModule({
    declarations: [
        CloseDayComponent,
        CloseDayReportComponent,
        CloseDayTenderReportComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedPosModule,
        PosCommonModule,
        ConfirmDialogModule,
        StoreModule.forFeature(closeDayFeatureName, reducer)
    ],
    entryComponents: [
        CloseDayReportComponent,
        CloseDayTenderReportComponent
    ]
})
export class CloseDayModule { }
