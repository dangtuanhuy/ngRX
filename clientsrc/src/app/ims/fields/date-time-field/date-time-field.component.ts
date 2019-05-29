import { Component, OnInit } from '@angular/core';
import { FieldBaseComponent } from '../field-base/field-base.component';
import * as moment from 'moment/moment';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-date-time-field',
    templateUrl: './date-time-field.component.html',
    styleUrls: ['./date-time-field.component.scss'],
})

export class DateTimeFieldComponent extends FieldBaseComponent<Date> implements OnInit {

    public dateTimeValue: any;
    public displayValue: any;

    public bindingValueTemp: any;

    public model: any;
    GetValue(value: any): Date {
        return value;
    }

    Validate(): boolean {
        return true;
    }

    constructor() {
        super();
    }

    ngOnInit() {
        if (this.value) {
            this.value = new Date(this.value);
            this.value = this.value.getFullYear() < 1900 ? new Date() : this.value;
            this.dateTimeValue = moment(this.value).format('YYYY MMMM DD');
            this.bindingValue = this.value;
            this.bindingValueTemp = new NgbDate(this.bindingValue.getFullYear(), this.bindingValue.getMonth(), this.bindingValue.getDate());
        }
    }

    onDateSelect(event: NgbDate) {
        this.bindingValue = new Date(event.year, event.month - 1, event.day);
        this.bindingValueTemp = new NgbDate(this.bindingValue.getFullYear(), this.bindingValue.getMonth() + 1, this.bindingValue.getDate());
    }
}
