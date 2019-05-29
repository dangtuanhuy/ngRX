import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseOrderReportErrorComponent } from './report-error.component';

const reportErrorRoutes: Routes = [{ path: '', component: PurchaseOrderReportErrorComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(reportErrorRoutes)
    ],
    declarations: [PurchaseOrderReportErrorComponent],
    entryComponents: []
})
export class PurchaseOrderReportErrorModule { }
