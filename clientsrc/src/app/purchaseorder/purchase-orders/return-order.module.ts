import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PurchaseOrderTypeEnum } from 'src/app/shared/constant/purchase-order.constant';

const returnOrderRoutes: Routes = [{ path: '', loadChildren: './purchase-order.module#PurchaseOrderModule',
                                    data: {purchaseOrderType : PurchaseOrderTypeEnum.returnedOrder, title: 'Return Order Management'} }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(returnOrderRoutes),
        ReactiveFormsModule,
        NgSelectModule
    ],
    declarations: [
    ]
})
export class ReturnOrderModule {}
