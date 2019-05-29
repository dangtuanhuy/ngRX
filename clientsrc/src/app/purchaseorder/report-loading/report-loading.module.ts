import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderReportLoadingComponent } from './report-loading.component';

const reportLoadingRoutes: Routes = [{ path: '', component: PurchaseOrderReportLoadingComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(reportLoadingRoutes)
    ],
    declarations: [PurchaseOrderReportLoadingComponent],
    entryComponents: []
})
export class PurchaseOrderReportLoadingModule { }
