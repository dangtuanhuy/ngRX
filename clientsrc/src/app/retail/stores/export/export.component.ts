import { Component, OnInit, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/shared/components/component-base';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html'
})
export class ExportSaleTransactionComponent extends ComponentBase {

    constructor(public injector: Injector) {
        super(injector);
    }
    locationId = null;
    public componentActive = true;

    onInit() {

    }

    onDestroy() {

    }
}
