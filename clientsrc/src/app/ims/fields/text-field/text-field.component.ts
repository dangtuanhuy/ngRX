import { Component } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
    selector: 'app-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent extends FieldBaseComponent<string> {
    private displayValue: any;
    Validate(): boolean {
        return true;
    }
    GetValue(value: any): string {
        return value;
    }
    constructor() {
        super();
        this.displayValue = this.value;
    }
}
