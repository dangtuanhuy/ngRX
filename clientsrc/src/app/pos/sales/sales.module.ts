import { NgModule } from '@angular/core';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { SalesComponent } from './sales.component';
import { SalesDataSearchComponent } from './sales-data-search/sales-data-search.component';
import { SalesCustomerDetailComponent } from './sales-customer-detail/sales-customer-detail.component';
// tslint:disable-next-line:max-line-length
import { SalesCustomerDetailDataItemComponent } from './sales-customer-detail/sales-customer-detail-data-item/sales-customer-detail-data-item.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/sales.reducer';
import { SalesEffects } from './state/sales.effect';
import { EffectsModule } from '@ngrx/effects';
import { PosCommonModule } from '../shared/pos-common.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations: [
        SalesComponent,
        SalesDataSearchComponent,
        SalesCustomerDetailComponent,
        SalesCustomerDetailDataItemComponent
    ],
    imports: [
        StoreModule.forFeature('sales', reducer),
        EffectsModule.forFeature([SalesEffects]),
        BrowserModule,
        SharedPosModule,
        PosCommonModule,
        SharedModule
    ],
    providers: [
    ],
    exports: [
        SalesComponent
    ]
})
export class SalesModule { }
