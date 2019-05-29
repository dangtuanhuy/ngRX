import { Component, Input, Injector } from '@angular/core';
import { ComponentBase } from '../component-base';

@Component({
    selector: 'app-loading-spinner',
    templateUrl: './loading-spinner.component.html',
    styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent extends ComponentBase {

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
