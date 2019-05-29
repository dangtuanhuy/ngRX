import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ImsComponent } from './ims.component';

const purchaseorderRoutes: Routes = [{ path: '', component: ImsComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(purchaseorderRoutes)
    ],
    declarations: [ImsComponent],
    entryComponents: []
})
export class PurchaseImsModule { }
