import { Component, OnInit, Input } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';
import { FieldMode } from '../field-base/field-base.mode';
import { FieldType } from '../field-base/field-type';

@Component({
    selector: 'app-entity-reference-field',
    templateUrl: './entity-reference-field.component.html',
    styleUrls: ['./entity-reference-field.component.scss']
})

export class EntityRefenceFieldComponent extends FieldBaseComponent<string[]> implements OnInit {

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
                singleSelection: this.singleSelection,
                allowSearchFilter: true
            };

    }

    build() {
        if (this.data) {
          const data = Object.create(this.data);
          const result = [];
          data.forEach(x => {
            result.push(x.value);
          });
          return result;
        }
      }
}
