import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KeyboardKey } from '../../../constants/common.constant';

@Injectable()
export class KeyboardService {
    public showKeyboardSubject = new Subject<boolean>();
    public keyboardPositionSubject = new Subject<any>();
    public triggerKeySubject = new Subject<any>();
    public triggerBkspSubject = new Subject<any>();
    public usingVirtualKeyboardSubject = new Subject();
    public isNumpadKeyboardSubject = new Subject();

    public isNumpadKeyboard = false;
    public selectedInputId = '';
    public selectingAllText = false;

    public focusingDirectiveItem = false;
    public insideKeyboard = false;
    public usingVirtualKeyboard = true;

    private keyboardPosition = {
        left: 0,
        right: 0
    };

    constructor() { }

    public focusDirectiveItem(position: any) {
        if (!this.usingVirtualKeyboard) {
            return;
        }

        this.keyboardPosition = position;
        this.keyboardPositionSubject.next(this.keyboardPosition);

        this.focusingDirectiveItem = true;
        this.insideKeyboard = true;
        this.showKeyboard();
    }

    public blurDirectiveItem() {
        this.focusingDirectiveItem = false;
        this.showKeyboard();
    }

    public onInsideKeyboard() {
        this.insideKeyboard = true;
        this.showKeyboard();
    }

    public onOutsideKeyboard() {
        if (this.focusingDirectiveItem) {
            this.insideKeyboard = true;
            return;
        }

        this.insideKeyboard = false;
        this.showKeyboard();
    }

    public triggerKeyboard(key, clearText = false, fromRealKeyboard = false) {
        if (key === KeyboardKey.Bksp) {
            this.triggerBkspSubject.next(fromRealKeyboard);
            this.triggerBkspSubject.next({
                itemId: this.selectedInputId,
                fromRealKeyboard: fromRealKeyboard
            });
            return;
        }

        this.triggerKeySubject.next({
            itemId: this.selectedInputId,
            key: key,
            clearText: clearText,
            fromRealKeyboard: fromRealKeyboard
        });
    }

    public checkIsOpeningKeyboard() {
        return this.focusingDirectiveItem || this.insideKeyboard;
    }

    public triggerUsingVirtualKeyboard(value: boolean) {
        this.usingVirtualKeyboard = value;
        this.usingVirtualKeyboardSubject.next(this.usingVirtualKeyboard);
    }

    public triggerIsNumpadKeyboard(isNumpadKeyboard: boolean) {
        this.isNumpadKeyboard = isNumpadKeyboard;
        this.isNumpadKeyboardSubject.next(this.isNumpadKeyboard);
    }

    private showKeyboard() {
        this.showKeyboardSubject.next(this.checkIsOpeningKeyboard());
    }
}
