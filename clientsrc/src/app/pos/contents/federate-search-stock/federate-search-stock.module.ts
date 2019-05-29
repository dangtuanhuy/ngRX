import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PosCommonModule } from '../../shared/pos-common.module';
import { FederateSearchStockComponent } from './federate-search-stock.component';

const routes: Routes = [
    {
        path: '',
        component: FederateSearchStockComponent
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
        FederateSearchStockComponent
    ]
})
export class FederateSearchStockModule { }
