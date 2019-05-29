import { Component, Input, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
    selector: 'app-pos-loading-spinner',
    templateUrl: './pos-loading-spinner.component.html',
    styleUrls: ['./pos-loading-spinner.component.scss']
})
export class PosLoadingSpinnerComponent extends ComponentBase {

    @Input() hiddenLoadingIndicator = true;
    @Input() description = '';

    constructor(public injector: Injector) {
        super(injector);
    }

    onInit() {
    }

    onDestroy() {
    }
}
