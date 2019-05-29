import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { PromotionComponent } from './promotion.component';

const promotionRoutes: Routes = [{ path: '', component: PromotionComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(promotionRoutes)
    ],
    declarations: [PromotionComponent],
    entryComponents: []
})
export class PromotionModule { }
