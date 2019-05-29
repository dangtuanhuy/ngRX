import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuickSelectComponent } from './quick-select.component';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { StoreModule } from '@ngrx/store';
import { quickSelectsFeatureName } from './state';
import { reducer } from './state/quick-select.reducer';
import { EffectsModule } from '@ngrx/effects';
import { QuickSelectEffects } from './state/quick-select.effect';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';

const contentsRoutes: Routes = [
    {
        path: '',
        component: QuickSelectComponent
    },
];

@NgModule({
    declarations: [
        QuickSelectComponent
    ],
    imports: [
        RouterModule.forChild(contentsRoutes),
        CommonModule,
        StoreModule.forFeature(quickSelectsFeatureName, reducer),
        EffectsModule.forFeature([QuickSelectEffects]),
        ConfirmDialogModule,
        SharedPosModule
    ],
    providers: [

    ],
    exports: [
    ]
})
export class QuickSelectModule { }
