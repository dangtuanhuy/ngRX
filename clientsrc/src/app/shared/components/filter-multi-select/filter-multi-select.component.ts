import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromApps from '../../state/app.state';
import * as listViewManagementSelector from '../list-view-management/state';

@Component({
  selector: 'app-filter-multi-select',
  templateUrl: './filter-multi-select.component.html',
  styleUrls: ['./filter-multi-select.component.scss']
})
export class FilterMultiSelectComponent implements OnInit {

  constructor(
    private store: Store<fromApps.State>
  ) {
  }
  @Input() dropdownList;
  @Input() customPlaceholder;
  @Output() dropDownListItem: EventEmitter<any> = new EventEmitter();
  selectedItems = [];
  dropdownSettings = {};
  ngOnInit() {
    this.dropdownSettings = {
      text: this.customPlaceholder,
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      badgeShowLimit: 2,
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };

    this.store.pipe(select(listViewManagementSelector.changeFilter))
      .subscribe(
        (filter: any) => {
          if (filter === null || filter === undefined || filter === []) {
            this.selectedItems = [];
            this.dropDownListItem.emit(this.selectedItems);
          }
        });
  }
  onItemSelect(item: any) {
    this.dropDownListItem.emit(this.selectedItems);
  }
  onSelectAll(items: any) {
    this.dropDownListItem.emit(this.selectedItems);
  }

  OnItemDeSelect(item: any) {
    this.dropDownListItem.emit(this.selectedItems);
  }

  onDeSelectAll(items: any) {
    this.dropDownListItem.emit(this.selectedItems);
  }

}
