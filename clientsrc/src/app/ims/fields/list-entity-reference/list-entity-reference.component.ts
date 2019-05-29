import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ReferenceEntityValue } from '../field-base/field-value';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list-entity-reference',
    templateUrl: './list-entity-reference.component.html',
    styleUrls: ['./list-entity-reference.component.scss']
})

export class ListEntityReferenceComponent {

    @Input() dataSource: Array<ReferenceEntityValue>;
    @ViewChild('myTable') table: any;

    pageSize = 10;

    constructor( public activeModal: NgbActiveModal) {
    }


    onSelect( selected: ReferenceEntityValue) {
        this.activeModal.close(selected);
    }

    onDismiss() {
        this.activeModal.dismiss();
      }
}
