import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { PosCommonModule } from '../../shared/pos-common.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ManualDiscountComponent } from './manual-discount/manual-discount.component';
import { PosPromotionComponent } from './pos-promotion.component';
import { VariantDiscountComponent } from './variant-discount/variant-discount.component';

const routes: Routes = [
    {
        path: '',
        component: PosPromotionComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedPosModule,
        PosCommonModule,
        NgSelectModule
    ],
    declarations: [
        PosPromotionComponent,
        ManualDiscountComponent,
        VariantDiscountComponent
    ]
})
export class PosPromotionModule { }
