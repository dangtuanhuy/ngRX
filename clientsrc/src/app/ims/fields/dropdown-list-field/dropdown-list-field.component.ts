import { Component, OnInit, Input } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';
import { FieldMode } from '../field-base/field-base.mode';
import { FieldType } from '../field-base/field-type';

@Component({
    selector: 'app-dropdown-list-field',
    templateUrl: './dropdown-list-field.component.html',
    styleUrls: ['./dropdown-list-field.component.scss']
})


export class DropdownListFieldComponent extends FieldBaseComponent<string[]> implements OnInit {
    @Input() isModeEdit;
    dropdownSettings = {};
    @Input() singleSelection: Boolean;

    GetValue(value: any): string[] {
        return value;
    }
    Validate(): boolean {
        return true;
    }
    constructor() {
        super();
    }

    ngOnInit() {
        this.bindingValue = this.value;
            this.dropdownSettings = {
                singleSelection: this.singleSelection
            };
    }

}
