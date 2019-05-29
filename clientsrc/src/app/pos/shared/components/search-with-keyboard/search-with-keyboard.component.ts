import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { KeyboardService } from '../keyboard/services/keyboard.service';

@Component({
  selector: 'app-search-with-keyboard',
  templateUrl: './search-with-keyboard.component.html',
  styleUrls: ['./search-with-keyboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchWithKeyboardComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() className = '';
  @Input() searchText = '';
  @Input() dataSet: any[];
  @Input() placeHolder = '';
  @Input() putItemLeft = false;
  @Input() putItemRight = false;

  @Output() changeValue = new EventEmitter<any>();
  @Output() selectItem = new EventEmitter<any>();

  public selectedItem = null;

  constructor(
    private keyboardService: KeyboardService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.changeValue.complete();
    this.selectItem.complete();
  }

  public onValueChange(searchText) {
    this.changeValue.emit(searchText);
  }

  public onSelectItem(item) {
    this.keyboardService.triggerKeyboard('', true);
    this.dataSet = [];

    this.selectItem.emit(item);
  }
}
