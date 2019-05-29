import { OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FieldValue } from './field-value';
import { FieldType } from './field-type';
import { FieldMode } from './field-base.mode';
export abstract class FieldBaseComponent<TValue> implements OnInit {
    @Input()
    id: string;
    @Input()
    fieldId: string;
    @Input()
    displayText: string;
    @Input()
    value: TValue;
    @Input() type: FieldType;
    @Input() data: TValue[];
    @Output()
    onSave = new EventEmitter<FieldValue<TValue>>();
    bindingValue: TValue;
    mode: string = FieldMode.Read;
    abstract GetValue(value: any): TValue;
    abstract Validate(): boolean;

    constructor() {
     }
    ngOnInit() {
        this.bindingValue = this.value;
    }

    public isInEditMode() {
        return this.mode !== FieldMode.Read;
    }

    public edit() {
        this.mode = FieldMode.Edit;
    }

    public save() {
        if (!this.Validate()) {
            return;
        }
        this.onSave.emit({
            id: this.id,
            fieldId: this.fieldId,
            name: this.displayText,
            value: this.bindingValue,
            type: this.type,
            data: this.data
        });
        this.mode = FieldMode.Read;
    }

    public cancel() {
        this.bindingValue = this.value;
        this.mode = FieldMode.Read;
    }
}
