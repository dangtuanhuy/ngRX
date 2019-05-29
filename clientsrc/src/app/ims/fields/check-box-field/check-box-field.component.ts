import { Component } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';
import { Store } from '@ngrx/store';
import * as fromField from '../field-base/state';

@Component({
    selector: 'app-check-box-field',
    templateUrl: './check-box-field.component.html',
    styleUrls: ['./check-box-field.component.scss']
})
export class CheckBoxFieldComponent extends FieldBaseComponent<boolean> {
    Validate(): boolean {
        return true;
    }
    GetValue(value: any): boolean {
        return value;
    }
    constructor() {
        super();
    }
}
