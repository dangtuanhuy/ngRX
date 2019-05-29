import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { PageInputId } from '../../constants/common.constant';
import { DenominationViewModel } from '../../models/denomination-view.model';

@Component({
  selector: 'app-denominations-table',
  templateUrl: './denominations-table.component.html',
  styleUrls: ['./denominations-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DenominationsTableComponent implements OnInit {
  @Input() denominations: DenominationViewModel[] = [];

  @Output() change = new EventEmitter<any>();

  public denominationIdPrefix = PageInputId.denomination.prefix;

  constructor() { }

  ngOnInit() {
  }

  public valueChange(denominationId, value) {
    this.change.emit({
      id: denominationId,
      value: value
    });
  }
}
