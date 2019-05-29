import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { BigButton } from '../../base-model/big-button.model';

@Component({
  selector: 'app-buttons-grid',
  templateUrl: './buttons-grid.component.html',
  styleUrls: ['./buttons-grid.component.scss']
})
export class ButtonsGridComponent implements OnInit, OnChanges, OnDestroy {
  @Input() buttonFullHeight = false;
  @Input() rowNumber = 0;
  @Input() colNumber: 0;
  @Input() showArrow = false;
  @Input() buttonColor = '';
  @Input() buttons: BigButton[] = [];

  @Output() clickPrevious = new EventEmitter<any>();
  @Output() clickNext = new EventEmitter<any>();
  @Output() clickItem = new EventEmitter<any>();

  public buttonsGrid = [];
  public gridStyle = {};
  public angleButtonWidth = '';
  public angleButtonHeight = '';

  private firstDisplayedItemIndex = 0;
  private basicButtonSize = 0;

  private buttonsLabel = 'buttons';

  constructor() {
  }

  ngOnInit() {
    this.setBasicButtonSize();
    this.setButtonsGrid();
    this.setGridTemplate();
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (propName === this.buttonsLabel) {
        this.firstDisplayedItemIndex = 0;
        this.setButtonsGrid();
      }
    }
  }

  ngOnDestroy(): void {
    this.clickPrevious.complete();
    this.clickItem.complete();
    this.clickNext.complete();
  }

  public onClickPreviousItems() {
    this.clickPrevious.emit();
    // const previousIndex = this.firstDisplayedItemIndex - this.rowNumber * this.colNumber;
    // if (previousIndex >= 0) {
    //   this.firstDisplayedItemIndex = previousIndex;
    //   this.setButtonsGrid();
    // }
  }

  public onClickNextItems() {
    this.clickNext.emit();
    // const nextIndex = this.firstDisplayedItemIndex + this.rowNumber * this.colNumber;
    // if (nextIndex < this.buttons.length) {
    //   this.firstDisplayedItemIndex = nextIndex;
    //   this.setButtonsGrid();
    // }
  }

  public onClickButton(buttonId) {
    this.clickItem.emit(buttonId);
  }

  private setButtonsGrid() {
    if (!(this.rowNumber > 0 && this.colNumber > 0)) {
      return;
    }

    this.buttonsGrid = [];
    let currentIndexOfDisplayedItem = this.firstDisplayedItemIndex;
    const buttonsLength = this.buttons.length;

    for (let i = 0; i < this.rowNumber; i++) {
      this.buttonsGrid.push([]);
      for (let j = 0; j < this.colNumber; j++) {
        if (currentIndexOfDisplayedItem >= buttonsLength) {
          this.buttonsGrid[i].push(new BigButton({ backgroundColor: this.buttonColor }));
          continue;
        }

        this.buttons[currentIndexOfDisplayedItem].backgroundColor =
          this.buttons[currentIndexOfDisplayedItem].backgroundColor
            ? this.buttons[currentIndexOfDisplayedItem].backgroundColor
            : this.buttonColor;
        this.buttonsGrid[i].push(this.buttons[currentIndexOfDisplayedItem]);
        currentIndexOfDisplayedItem++;
      }
    }
  }

  private setGridTemplate() {
    this.angleButtonWidth = `${this.basicButtonSize}px`;
    this.angleButtonHeight = `${this.basicButtonSize * this.rowNumber}px`;

    let gridTemplateRows = '';
    for (let i = 0; i < this.rowNumber; i++) {
      gridTemplateRows += this.buttonFullHeight ? '100% ' : `${this.basicButtonSize}px `;
    }

    let gridTemplateCols = '';
    const numberOfDisplayButton = Math.min(this.colNumber, this.buttons.length);
    for (let i = 0; i < numberOfDisplayButton; i++) {
      gridTemplateCols += `${this.buttons[i].width}px `;
    }
    const numberOfMissingButton = this.colNumber - numberOfDisplayButton;
    for (let i = 0; i < numberOfMissingButton; i++) {
      gridTemplateCols += `${this.basicButtonSize}px `;
    }

    this.gridStyle = {
      'grid-template-rows': gridTemplateRows,
      'grid-template-columns': gridTemplateCols,
    };
  }

  private setBasicButtonSize() {
    if (this.buttons.length > 0) {
      const firstButton = this.buttons[0];
      this.basicButtonSize = firstButton.width / firstButton.colspan;
    }
  }
}
