import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { CustomerComponent } from './customer.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PosCommonModule } from '../../shared/pos-common.module';
import { StoreModule } from '@ngrx/store';
import { customerFeatureName } from './state';
import { reducer as customerReducer } from './state/customer.reducer';

const routes: Routes = [
    {
        path: '',
        component: CustomerComponent
    },
    {
        path: ':customerId',
        component: CustomerDetailComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        StoreModule.forFeature(customerFeatureName, customerReducer),
        CommonModule,
        FormsModule,
        SharedPosModule,
        NgxDatatableModule,
        PosCommonModule
    ],
    declarations: [
        CustomerComponent,
        CustomerDetailComponent
    ]
})
export class CustomerModule { }
