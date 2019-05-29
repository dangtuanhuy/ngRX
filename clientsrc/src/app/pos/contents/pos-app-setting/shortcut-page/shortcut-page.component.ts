import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ShortcutModel } from 'src/app/pos/shared/models/shortcut.model';

@Component({
  selector: 'app-shortcut-page',
  templateUrl: './shortcut-page.component.html',
  styleUrls: ['./shortcut-page.component.scss']
})
export class ShortcutPageComponent implements OnInit {
  @Input() title = '';
  @Input() shortcuts: ShortcutModel[] = [];

  private selectedItem = null;

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (this.selectedItem) {
      this.selectedItem.shortcut = event.key;
    }
  }

  constructor() { }

  ngOnInit() {
  }

  public onClickShortcut(item: ShortcutModel, event) {
    event.target.select();
    this.selectedItem = item;
  }
}
