import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/payment.reducer';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { PaymentEffects } from './state/payment.effect';
import { PosCommonModule } from '../../shared/pos-common.module';

const contentsRoutes: Routes = [
    {
        path: '',
        component: PaymentComponent
    },
];

@NgModule({
    declarations: [
        PaymentComponent
    ],
    imports: [
        RouterModule.forChild(contentsRoutes),
        CommonModule,
        StoreModule.forFeature('payments', reducer),
        EffectsModule.forFeature([PaymentEffects]),
        SharedPosModule,
        PosCommonModule
    ],
    providers: [

    ],
    exports: [
    ]
})
export class PaymentModule { }
