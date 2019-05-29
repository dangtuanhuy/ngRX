import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


import { MAT_KEYBOARD_DEADKEYS } from '../configs/keyboard-deadkey.config';
import { MAT_KEYBOARD_ICONS } from '../configs/keyboard-icons.config';
import { KeyboardClassKey } from '../enums/keyboard-class-key.enum';
import { IKeyboardDeadkeys } from '../interfaces/keyboard-deadkeys.interface';
import { IKeyboardIcons } from '../interfaces/keyboard-icons.interface';
import { BehaviorSubject } from 'rxjs';

export const VALUE_NEWLINE = '\n\r';
export const VALUE_SPACE = ' ';
export const VALUE_TAB = '\t';

@Component({
  selector: 'app-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.scss']
})
export class MatKeyboardKeyComponent implements OnInit {

  private _deadkeyKeys: string[] = [];

  private _iconKeys: string[] = [];

  active$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  pressed$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input()
  key: string | KeyboardClassKey;

  @Input()
  set active(active: boolean) {
    this.active$.next(active);
  }

  get active(): boolean {
    return this.active$.getValue();
  }

  @Input()
  set pressed(pressed: boolean) {
    this.pressed$.next(pressed);
  }

  get pressed(): boolean {
    return this.pressed$.getValue();
  }

  @Input() isNumpadIconKey = false;

  @Input()
  input?: ElementRef;

  @Input()
  control?: FormControl;

  @Output()
  genericClick = new EventEmitter<MouseEvent>();

  @Output()
  enterClick = new EventEmitter<MouseEvent>();

  @Output()
  bkspClick = new EventEmitter<any>();

  @Output()
  capsClick = new EventEmitter<MouseEvent>();

  @Output()
  altClick = new EventEmitter<MouseEvent>();

  @Output()
  shiftClick = new EventEmitter<MouseEvent>();

  @Output()
  spaceClick = new EventEmitter<MouseEvent>();

  @Output()
  tabClick = new EventEmitter<MouseEvent>();

  @Output()
  keyClick = new EventEmitter<any>();

  get lowerKey(): string {
    return `${this.key}`.toLowerCase();
  }

  get charCode(): number {
    return `${this.key}`.charCodeAt(0);
  }

  get isClassKey(): boolean {
    return this.key in KeyboardClassKey;
  }

  get isDeadKey(): boolean {
    return this._deadkeyKeys.some((deadKey: string) => deadKey === `${this.key}`);
  }

  get hasIcon(): boolean {
    return this._iconKeys.some((iconKey: string) => iconKey === `${this.key}`);
  }

  get icon(): string {
    return this._icons[this.key];
  }

  get cssClass(): string {
    const classes = [];

    if (this.hasIcon) {
      classes.push('mat-keyboard-key-modifier');
      classes.push(`mat-keyboard-key-${this.lowerKey}`);
    }

    if (this.isDeadKey) {
      classes.push('mat-keyboard-key-deadkey');
    }

    return classes.join(' ');
  }

  get inputValue(): string {
    if (this.control) {
      return this.control.value;
    } else if (this.input && this.input.nativeElement && this.input.nativeElement.value) {
      return this.input.nativeElement.value;
    } else {
      return '';
    }
  }

  set inputValue(inputValue: string) {
    if (this.control) {
      this.control.setValue(inputValue);
    } else if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = inputValue;
    }
  }

  constructor(@Inject(MAT_KEYBOARD_DEADKEYS) private _deadkeys: IKeyboardDeadkeys,
    @Inject(MAT_KEYBOARD_ICONS) private _icons: IKeyboardIcons) { }

  ngOnInit() {
    this._deadkeyKeys = Object.keys(this._deadkeys);

    this._iconKeys = Object.keys(this._icons);
  }

  onClick(event: MouseEvent) {
    this._triggerKeyEvent();

    // Trigger generic click event
    this.genericClick.emit(event);

    // Manipulate the focused input / textarea value
    const value = this.inputValue;
    const caret = this.input ? this._getCursorPosition() : 0;

    let char: string;
    switch (this.key) {
      case KeyboardClassKey.Control:
        break;
      case KeyboardClassKey.Alt:
        break;
      case KeyboardClassKey.AltGr:
        break;
      case KeyboardClassKey.AltLk:
        this.altClick.emit(event);
        break;

      case KeyboardClassKey.Bksp:
        this.deleteSelectedText();
        this.bkspClick.emit(this.key);
        break;

      case KeyboardClassKey.Caps:
        this.capsClick.emit(event);
        break;

      case KeyboardClassKey.Enter:
        if (this._isTextarea()) {
          char = VALUE_NEWLINE;
        } else {
          this.enterClick.emit(event);
        }
        break;

      case KeyboardClassKey.Shift:
        this.shiftClick.emit(event);
        break;

      case KeyboardClassKey.Space:
        char = VALUE_SPACE;
        this.spaceClick.emit(event);
        break;

      case KeyboardClassKey.Tab:
        char = VALUE_TAB;
        this.tabClick.emit(event);
        break;

      default:
        char = `${this.key}`;
        this.keyClick.emit(this.key);
        break;
    }

    if (char && this.input) {
      this.replaceSelectedText(char);
      this._setCursorPosition(caret + 1);
    }
  }

  private deleteSelectedText(): void {
    const value = this.inputValue;
    let caret = this.input ? this._getCursorPosition() : 0;
    let selectionLength = this._getSelectionLength();
    if (selectionLength === 0) {
      if (caret === 0) {
        return;
      }

      caret--;
      selectionLength = 1;
    }

    const headPart = value.slice(0, caret);
    const endPart = value.slice(caret + selectionLength);

    this.inputValue = [headPart, endPart].join('');
    this._setCursorPosition(caret);
  }

  private replaceSelectedText(char: string): void {
    const value = this.inputValue;
    const caret = this.input ? this._getCursorPosition() : 0;
    const selectionLength = this._getSelectionLength();
    const headPart = value.slice(0, caret);
    const endPart = value.slice(caret + selectionLength);

    this.inputValue = [headPart, char, endPart].join('');
  }

  private _triggerKeyEvent(): Event {
    const keyboardEvent = new KeyboardEvent('keydown');
    //
    // keyboardEvent[initMethod](
    //   true, // bubbles
    //   true, // cancelable
    //   window, // viewArg: should be window
    //   false, // ctrlKeyArg
    //   false, // altKeyArg
    //   false, // shiftKeyArg
    //   false, // metaKeyArg
    //   this.charCode, // keyCodeArg : unsigned long - the virtual key code, else 0
    //   0 // charCodeArgs : unsigned long - the Unicode character associated with the depressed key, else 0
    // );
    //
    // window.document.dispatchEvent(keyboardEvent);

    return keyboardEvent;
  }

  private _getCursorPosition(): number {
    return 1;

    if (!this.input) {
      return;
    }

    if ('selectionStart' in this.input.nativeElement) {
      // Standard-compliant browsers
      return this.input.nativeElement.selectionStart;
    } else if ('selection' in window.document) {
      // IE
      this.input.nativeElement.focus();
      const sel = window.document['selection'].createRange();
      const selLen = window.document['selection'].createRange().text.length;
      sel.moveStart('character', -this.control.value.length);

      return sel.text.length - selLen;
    }
  }

  private _getSelectionLength(): number {
    if (!this.input) {
      return;
    }

    if ('selectionEnd' in this.input.nativeElement) {
      return this.input.nativeElement.selectionEnd - this.input.nativeElement.selectionStart;
    }

    if ('selection' in window.document) {
      this.input.nativeElement.focus();
    }
  }

  private _setCursorPosition(position: number): boolean {
    if (!this.input) {
      return;
    }

    this.inputValue = this.control.value;

    if ('createTextRange' in this.input.nativeElement) {
      const range = this.input.nativeElement.createTextRange();
      range.move('character', position);
      range.select();
      return true;
    } else {
      if (this.input.nativeElement.selectionStart || this.input.nativeElement.selectionStart === 0) {
        this.input.nativeElement.focus();
        this.input.nativeElement.setSelectionRange(position, position);
        return true;
      } else {
        this.input.nativeElement.focus();
        return false;
      }
    }
  }

  private _isTextarea(): boolean {
    return this.input && this.input.nativeElement && this.input.nativeElement.tagName === 'TEXTAREA';
  }

}
