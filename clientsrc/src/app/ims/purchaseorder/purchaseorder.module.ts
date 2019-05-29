import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseorderComponent } from './purchaseorder.component';

const purchaseorderRoutes: Routes = [{ path: '', component: PurchaseorderComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(purchaseorderRoutes)
    ],
    declarations: [PurchaseorderComponent],
    entryComponents: []
})
export class PurchaseorderModule { }
