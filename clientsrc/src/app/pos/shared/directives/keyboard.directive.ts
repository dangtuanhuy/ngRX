import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { KeyboardService } from '../components/keyboard/services/keyboard.service';

@Directive({
  selector: '[appKeyboard]'
})
export class KeyboardDirective {
  @Input() putItemLeft = false;
  @Input() putItemRight = false;
  @Input() inputSelectText = false;
  @Input() isNumpad = false;

  private keyboardSpace = 10;
  private keyboardWidth = 730;
  private keyboardHeight = 270;

  @HostListener('focus', ['$event']) onMouseFocus(event) {
    this.keyboardSerivce.triggerIsNumpadKeyboard(this.isNumpad);

    if (this.inputSelectText) {
      event.target.select();
      this.keyboardSerivce.selectingAllText = true;
    } else {
      this.keyboardSerivce.selectingAllText = false;
    }

    this.keyboardSerivce.selectedInputId = this.el.nativeElement.id;

    this.keyboardSerivce.focusDirectiveItem({
      left: this.getLeftPosition(),
      top: this.getTopPosition()
    });
  }

  @HostListener('blur') onMouseBlur() {
    this.keyboardSerivce.blurDirectiveItem();
  }

  constructor(
    private keyboardSerivce: KeyboardService,
    private el: ElementRef) { }

  private getTopPosition() {
    const screenHeight = window.innerHeight;
    const itemTop = this.el.nativeElement.getBoundingClientRect().top;

    let topPosition = itemTop + this.el.nativeElement.offsetHeight + this.keyboardSpace;
    if (topPosition + this.keyboardHeight > screenHeight) {
      topPosition = itemTop - this.keyboardHeight - this.keyboardSpace;
    }

    return topPosition;
  }

  private getLeftPosition() {
    const itemLeft = this.el.nativeElement.getBoundingClientRect().left;
    const screenWidth = window.innerWidth;

    if (this.putItemLeft) {
      return itemLeft - this.keyboardWidth - this.keyboardSpace;
    }

    if (this.putItemRight) {
      return itemLeft + this.el.nativeElement.offsetWidth + this.keyboardSpace;
    }

    let leftPosition = itemLeft - this.keyboardWidth / 2 + this.keyboardSpace;
    if (leftPosition < 0) {
      leftPosition = this.keyboardSpace;
    } else if (leftPosition + this.keyboardWidth > screenWidth) {
      leftPosition = screenWidth - this.keyboardWidth - this.keyboardSpace;
    }

    return leftPosition;
  }
}
