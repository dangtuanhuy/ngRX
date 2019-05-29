import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ReportErrorComponent } from './report-error.component';

const reportErrorRoutes: Routes = [{ path: '', component: ReportErrorComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(reportErrorRoutes)
    ],
    declarations: [ReportErrorComponent],
    entryComponents: []
})
export class ReportErrorModule { }
