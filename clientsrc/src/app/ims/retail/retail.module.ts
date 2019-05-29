import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { RetailComponent } from './retail.component';

const retailRoutes: Routes = [{ path: '', component: RetailComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(retailRoutes)
    ],
    declarations: [RetailComponent],
    entryComponents: []
})
export class RetailModule { }
