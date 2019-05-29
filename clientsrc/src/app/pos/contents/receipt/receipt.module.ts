import { NgModule } from '@angular/core';
import { ReceiptComponent } from './receipt.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { PosCommonModule } from '../../shared/pos-common.module';

const routes: Routes = [
    {
        path: ':orderId',
        component: ReceiptComponent
    }
];

@NgModule({
    declarations: [
        ReceiptComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedPosModule,
        PosCommonModule
    ]
})
export class ReceiptModule { }
