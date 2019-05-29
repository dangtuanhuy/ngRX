import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { NumberValidator } from '../../validators/number.validator';
import { KeyboardService } from '../keyboard/services/keyboard.service';

@Component({
  selector: 'app-input-with-keyboard',
  templateUrl: './input-with-keyboard.component.html',
  styleUrls: ['./input-with-keyboard.component.scss']
})
export class InputWithKeyboardComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() className = '';
  @Input() value: any = '';
  @Input() type = '';
  @Input() placeholder = '';
  @Input() inputSelectText = false;
  @Input() putItemLeft = false;
  @Input() putItemRight = false;
  @Input() style: any;
  @Input() isNumpad = false;

  private appliedType = '';


  @Output() valueChange = new EventEmitter<any>();

  private subscriptions: Subscription[] = [];

  constructor(
    private keyboardService: KeyboardService
  ) { }

  ngOnInit() {
    this.appliedType = this.type;
    if (this.type === 'number') {
      this.type = '';
    }
    this.subscriptions.push(
      this.keyboardService.triggerKeySubject.subscribe(data => {
        if (data.itemId === this.id) {
          if (data.clearText) {
            this.value = data.key;
            this.onChange();
            return;
          }

          if (this.appliedType === 'number') {
            this.updateNumberValue(data.key, data.fromRealKeyboard);
            return;
          }

          this.updateTextValue(data.key, data.fromRealKeyboard);
        }
      })
    );

    this.subscriptions.push(
      this.keyboardService.triggerBkspSubject.subscribe((data) => {
        if (data.itemId !== this.id) {
          return;
        }

        this.onBackspace(data.fromRealKeyboard);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });
    this.valueChange.complete();
  }

  onChange() {
    this.valueChange.emit(this.value);
  }

  onModelChange() {
    if (!this.keyboardService.usingVirtualKeyboard) {
      this.onChange();
    }
  }

  private updateTextValue(key: any, fromRealKeyboard = false) {
    if (key === undefined || key === null) {
      return;
    }

    if (fromRealKeyboard) {
      this.keyboardService.selectingAllText = false;
    }

    if (fromRealKeyboard && this.keyboardService.focusingDirectiveItem) {
      this.onChange();
      return;
    }

    if (!this.value || this.keyboardService.selectingAllText) {
      this.value = key;
      this.keyboardService.selectingAllText = false;
      this.onChange();
      return;
    }

    this.value += key;
    this.onChange();
  }

  private updateNumberValue(key: any, fromRealKeyboard = false) {
    if (key === undefined || key === null) {
      return;
    }

    if (fromRealKeyboard) {
      this.keyboardService.selectingAllText = false;
    }

    if (!NumberValidator.validateKey(key)) {
      if (fromRealKeyboard && this.keyboardService.focusingDirectiveItem) {
        if (this.value && String(this.value).length > 0) {
          const value = String(this.value);
          this.value = value.slice(0, value.length - 1);
        }

        this.onChange();
      }
      return;
    }

    if (fromRealKeyboard && this.keyboardService.focusingDirectiveItem) {
      this.onChange();
      return;
    }

    if (!this.value || this.keyboardService.selectingAllText) {
      this.value = key;
      this.keyboardService.selectingAllText = false;

      this.keyboardService.triggerKeyboard(key, true);
      this.onChange();
      return;
    }

    let newValue = this.value + key;
    if (NumberValidator.validateNumber(newValue)) {
      this.value = newValue;
    }

    newValue = parseFloat(newValue);
    this.onChange();
  }

  private onBackspace(fromRealKeyboard = false) {
    if (fromRealKeyboard && this.keyboardService.focusingDirectiveItem) {
      this.onChange();
      return;
    }

    if (this.value && String(this.value).length > 0) {
      const value = String(this.value);
      this.value = value.slice(0, value.length - 1);
      this.onChange();
    }
  }
}
