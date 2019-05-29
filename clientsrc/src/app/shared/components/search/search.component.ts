import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() searchText = '';
  @Input() dataSet: any[];
  @Input() placeHolder = '';

  @Output() changeValue = new EventEmitter<any>();
  @Output() selectItem = new EventEmitter<any>();

  public selectedItem = null;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.changeValue.complete();
    this.selectItem.complete();
  }

  public onValueChange(event) {
    this.changeValue.emit(this.searchText);
  }

  public onFocus() {
    this.selectedItem = null;

    if (this.searchText) {
      this.changeValue.emit(this.searchText);
    }
  }

  public onBlur() {
    if (this.selectedItem) {
      this.selectItem.emit(this.selectedItem);
    }

    this.searchText = '';
    this.dataSet = [];
  }

  public mouseEnter(item) {
    this.selectedItem = item;
  }

  public mouseLeave() {
    this.selectedItem = null;
  }
}
