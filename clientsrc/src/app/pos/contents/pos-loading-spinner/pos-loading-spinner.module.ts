import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosLoadingSpinnerComponent } from './pos-loading-spinner.component';

@NgModule({
    declarations: [
        PosLoadingSpinnerComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [

    ],
    exports: [
        PosLoadingSpinnerComponent
    ]
})
export class PosLoadingSpinnerModule { }
