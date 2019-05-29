import { NgModule } from '@angular/core';
import { PickupOrderComponent } from './pickup-order.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PosCommonModule } from '../../shared/pos-common.module';
import { PickupOrderDetailComponent } from './pickup-order-detail/pickup-order-detail.component';

const routes: Routes = [
    {
        path: '',
        component: PickupOrderComponent
    },
    {
        path: 'detail/:orderId',
        component: PickupOrderDetailComponent
    }
];

@NgModule({
    declarations: [
        PickupOrderComponent,
        PickupOrderDetailComponent
    ],
    exports: [],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        SharedPosModule,
        NgxDatatableModule,
        PosCommonModule
    ],
    providers: [
    ]
})
export class PickupOrderModule { }
