import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockPriceComponent } from './stock-price.component';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PosCommonModule } from '../../shared/pos-common.module';

const routes: Routes = [
    {
        path: '',
        component: StockPriceComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        NgxDatatableModule,
        SharedPosModule,
        PosCommonModule
    ],
    declarations: [
        StockPriceComponent
    ]
})
export class StockPriceModule { }
