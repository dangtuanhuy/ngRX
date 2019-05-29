import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ReportLoadingComponent } from './report-loading.component';

const reportLoadingRoutes: Routes = [{ path: '', component: ReportLoadingComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(reportLoadingRoutes)
    ],
    declarations: [ReportLoadingComponent],
    entryComponents: []
})
export class ReportLoadingModule { }
