import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostBinding, HostListener,
  OnInit, QueryList, ViewChildren, Inject, LOCALE_ID, OnDestroy
} from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { KeyboardClassKey } from './enums/keyboard-class-key.enum';
import { KeyboardModifier } from './enums/keyboard-modifier.enum';
import { IKeyboardLayout } from './interfaces/keyboard-layout.interface';
import { MatKeyboardKeyComponent } from './keyboard-key/keyboard-key.component';
import { BehaviorSubject, Observable, using, Subscription } from 'rxjs';
import { defaultKeyboardLayout, numpadKeyboard } from './configs/keyboard-layouts.config';
import { KeyboardService } from './services/keyboard.service';
import { KeyboardKey } from '../../constants/common.constant';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class MatKeyboardComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  private _darkTheme: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private _isDebug: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChildren(MatKeyboardKeyComponent)
  private _keys: QueryList<MatKeyboardKeyComponent>;

  private _modifier: KeyboardModifier = KeyboardModifier.None;

  private _capsLocked = false;

  locale?: string;

  layout: IKeyboardLayout;

  control: AbstractControl;

  @HostBinding('class.mat-keyboard')
  cssClass = true;

  bkspClick: EventEmitter<void> = new EventEmitter<void>();

  enterClick: EventEmitter<void> = new EventEmitter<void>();

  capsClick: EventEmitter<void> = new EventEmitter<void>();

  altClick: EventEmitter<void> = new EventEmitter<void>();

  shiftClick: EventEmitter<void> = new EventEmitter<void>();

  set darkTheme(darkTheme: boolean) {
    if (this._darkTheme.getValue() !== darkTheme) {
      this._darkTheme.next(darkTheme);
    }
  }

  set isDebug(isDebug: boolean) {
    if (this._isDebug.getValue() !== isDebug) {
      this._isDebug.next(isDebug);
    }
  }

  get darkTheme$(): Observable<boolean> {
    return this._darkTheme.asObservable();
  }

  get isDebug$(): Observable<boolean> {
    return this._isDebug.asObservable();
  }

  constructor(
    @Inject(LOCALE_ID) private _locale: string,
    private keyboardService: KeyboardService,
    private eRef: ElementRef
  ) {
    this.layout = defaultKeyboardLayout;
  }

  attachControl(control: AbstractControl) {
    this.control = control;
  }

  ngOnInit() {
    this.subscriptions.push(
      this.keyboardService.isNumpadKeyboardSubject.subscribe(isNumpadKeyboard => {
        this.layout = this.keyboardService.isNumpadKeyboard ? numpadKeyboard : defaultKeyboardLayout;
      })
    );

    this.layout = this.keyboardService.isNumpadKeyboard ? numpadKeyboard : defaultKeyboardLayout;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(x => x.unsubscribe());
  }

  dismiss() {
  }

  isActive(key: (string | KeyboardClassKey)[]): boolean {
    const modifiedKey: string = this.getModifiedKey(key);
    const isActiveCapsLock: boolean = modifiedKey === KeyboardClassKey.Caps && this._capsLocked;
    const isActiveModifier: boolean = modifiedKey === KeyboardModifier[this._modifier];
    return isActiveCapsLock || isActiveModifier;
  }

  getModifiedKey(key: (string | KeyboardClassKey)[]): string {
    let modifier: KeyboardModifier = this._modifier;

    if (this._capsLocked) {
      modifier = this._invertShiftModifier(this._modifier);
    }

    return key[modifier];
  }

  checkIsNumpadIconKey(key: (string | KeyboardClassKey)[]): boolean {
    let modifier: KeyboardModifier = this._modifier;

    if (this._capsLocked) {
      modifier = this._invertShiftModifier(this._modifier);
    }

    if (this.keyboardService.isNumpadKeyboard && key[modifier] === KeyboardClassKey.Bksp) {
      return true;
    }

    if (this.keyboardService.isNumpadKeyboard && key[modifier] === KeyboardClassKey.Bksp) {
      return true;
    }

    return false;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this._keys
      .filter((key: MatKeyboardKeyComponent) => key.key === event.key)
      .forEach((key: MatKeyboardKeyComponent) => {
        key.pressed = true;
      });

    if (event.key === KeyboardClassKey.Caps) {
      this.onCapsClick(event.getModifierState(KeyboardClassKey.Caps));
    }
    // if (event.key === KeyboardClassKey.Alt && this._modifier !== KeyboardModifier.Alt && this._modifier !== KeyboardModifier.ShiftAlt) {
    //   this.onAltClick();
    // }
    if (event.key === KeyboardClassKey.Shift && this._modifier !== KeyboardModifier.Shift && this._modifier !== KeyboardModifier.ShiftAlt) {
      this.onShiftClick();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this._keys
      .filter((key: MatKeyboardKeyComponent) => key.key === event.key)
      .forEach((key: MatKeyboardKeyComponent) => {
        key.pressed = false;
      });

    // if (event.key === KeyboardClassKey.Alt &&
    //  (this._modifier === KeyboardModifier.Alt || this._modifier === KeyboardModifier.ShiftAlt)) {
    //   this.onAltClick();
    // }
    if (event.key === KeyboardClassKey.Shift
      && (this._modifier === KeyboardModifier.Shift || this._modifier === KeyboardModifier.ShiftAlt)) {
      this.onShiftClick();
      return;
    }

    if (event.key === KeyboardClassKey.Alt || event.key === KeyboardClassKey.AltGr
      || event.key === KeyboardClassKey.AltLk || event.key === KeyboardClassKey.Caps
      || event.key === KeyboardClassKey.Enter || event.key === KeyboardClassKey.Tab
      || event.key === KeyboardClassKey.Control
    ) {
      return;
    }

    this.keyboardService.triggerKeyboard(event.key, false, true);
  }

  @HostListener('document:click', ['$event']) clickout(event) {
    if (this.eRef.nativeElement.contains(event.target)) {
      this.keyboardService.onInsideKeyboard();
    } else {
      this.keyboardService.onOutsideKeyboard();
    }
  }

  onBkspClick() {
    this.keyboardService.triggerKeyboard(KeyboardKey.Bksp);
  }

  onEnterClick() {
    this.enterClick.next();
  }

  onCapsClick(targetState = !this._capsLocked) {
    this._capsLocked = targetState;
    this.capsClick.next();
  }

  onAltClick() {
    this._modifier = this._invertAltModifier(this._modifier);
    this.altClick.next();
  }

  onShiftClick() {
    this._modifier = this._invertShiftModifier(this._modifier);
    this.shiftClick.next();
  }

  onKeyClick(event) {
    this.keyboardService.triggerKeyboard(event);
  }

  onSpaceClick(event) {
    this.keyboardService.triggerKeyboard(' ');
  }

  onClickCloseKeyboard() {
    this.keyboardService.blurDirectiveItem();
    this.keyboardService.onOutsideKeyboard();
  }

  private _invertAltModifier(modifier: KeyboardModifier): KeyboardModifier {
    switch (modifier) {
      case KeyboardModifier.None:
        return KeyboardModifier.Alt;

      case KeyboardModifier.Shift:
        return KeyboardModifier.ShiftAlt;

      case KeyboardModifier.ShiftAlt:
        return KeyboardModifier.Shift;

      case KeyboardModifier.Alt:
        return KeyboardModifier.None;
    }
  }

  private _invertShiftModifier(modifier: KeyboardModifier): KeyboardModifier {
    switch (modifier) {
      case KeyboardModifier.None:
        return KeyboardModifier.Shift;

      case KeyboardModifier.Alt:
        return KeyboardModifier.ShiftAlt;

      case KeyboardModifier.ShiftAlt:
        return KeyboardModifier.Alt;

      case KeyboardModifier.Shift:
        return KeyboardModifier.None;
    }
  }

}
