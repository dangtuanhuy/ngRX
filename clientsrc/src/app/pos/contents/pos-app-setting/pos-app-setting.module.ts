import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PosAppSettingComponent } from './pos-app-setting.component';
import { SharedPosModule } from 'src/app/shared/shared-pos.module';
import { PosCommonModule } from '../../shared/pos-common.module';
import { ShortcutPageComponent } from './shortcut-page/shortcut-page.component';

const routes: Routes = [
    {
        path: '',
        component: PosAppSettingComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        SharedPosModule,
        PosCommonModule
    ],
    declarations: [
        PosAppSettingComponent,
        ShortcutPageComponent
    ]
})
export class PosAppSettingModule { }
