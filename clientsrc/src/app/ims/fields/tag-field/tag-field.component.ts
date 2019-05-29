import { Component } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';

@Component({
    selector: 'app-tag-field',
    templateUrl: './tag-field.component.html',
    styleUrls: ['./tag-field.component.scss']
})

export class TagFieldComponent extends FieldBaseComponent<string[]> {
    GetValue(value: any): string[] {
        return value;
    }
    Validate(): boolean {
        return true;
    }
    constructor() {
        super();
    }
}
