import { Component } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
    selector: 'app-numeric-field',
    templateUrl: './numeric-field.component.html',
    styleUrls: ['./numeric-field.component.scss']
})

export class NumericFieldComponent extends FieldBaseComponent<number> {
    Validate(): boolean {
        return true;
    }
    GetValue(value: any): number {
        return value;
    }
    constructor() {
        super();
    }
}
