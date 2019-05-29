import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { ImsComponent } from './ims.component';

const imsRoutes: Routes = [{ path: '', component: ImsComponent }];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(imsRoutes)
    ],
    declarations: [ImsComponent],
    entryComponents: []
})
export class PromotionImsModule { }
