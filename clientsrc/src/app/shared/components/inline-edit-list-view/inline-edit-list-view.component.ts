import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ListViewColumn } from './model';

@Component({
  selector: 'app-inline-edit-list-view',
  templateUrl: './inline-edit-list-view.component.html',
  styleUrls: ['./inline-edit-list-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InlineEditListViewComponent implements OnInit {
  @Input() columns: ListViewColumn[] = [];
  @Input() dataSource;

  @Input() pageNumber = 0;
  @Input() pageSize = 10;

  @Input() showPlusMinusButton = false;

  @Input() isSaleSource = false;

  @Output() changeQuantity = new EventEmitter<any>();
  @Output() changeAmount = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() clickIcon = new EventEmitter<any>();

  editing = {};

  constructor() { }

  ngOnInit() {
  }

  public updateValue(valueChange, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.dataSource[rowIndex][cell] = valueChange;

    const updatedData = Object.assign({}, this.dataSource[rowIndex]);
    this.changeQuantity.emit(
      {
        id: updatedData.id,
        quantity: updatedData.quantity
      }
    );
    this.changeAmount.emit(
      {
        id: updatedData.id,
        amount: updatedData.amount
      }
    );
  }

  public onClickIcon(colName, row) {
    this.clickIcon.emit({
      colName: colName,
      item: row
    });
  }

  public onDeleteItem(item) {
    this.deleteItem.emit(item.id);
  }

  public titleCaseWord(word: string) {
    if (!word) {
      return word;
    }

    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  public onInPutNumberPlus(currentValue, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    const currentValueNumber = Number(currentValue);
    let updatedValue = 0;
    if (!isNaN(currentValueNumber)) {
      updatedValue = currentValueNumber + 1;
    }
    this.dataSource[rowIndex][cell] = updatedValue;

    const updatedData = Object.assign({}, this.dataSource[rowIndex]);
    this.changeQuantity.emit(
      {
        id: updatedData.id,
        quantity: updatedData.quantity
      }
    );
    this.changeAmount.emit(
      {
        id: updatedData.id,
        amount: updatedData.amount
      }
    );
  }

  public onInPutNumberMinus(currentValue, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    const currentValueNumber = Number(currentValue);
    let updatedValue = 0;
    if (!isNaN(currentValueNumber) && currentValueNumber > 0) {
      updatedValue = currentValueNumber - 1;
    }
    this.dataSource[rowIndex][cell] = updatedValue;

    const updatedData = Object.assign({}, this.dataSource[rowIndex]);
    this.changeQuantity.emit(
      {
        id: updatedData.id,
        quantity: updatedData.quantity
      }
    );
    this.changeAmount.emit(
      {
        id: updatedData.id,
        amount: updatedData.amount
      }
    );
  }

  public parseToDecimal(value: number) {
    return value.toFixed(2);
  }
}
