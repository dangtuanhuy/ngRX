import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-callback',
  templateUrl: './page-callback.component.html',
  styleUrls: ['./page-callback.component.scss']
})
export class PageCallbackComponent implements OnInit {
  @Input() title = '';
  @Input() defaultPage = '/';
  @Output() back = new EventEmitter();

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  public closeClick() {
    this.back.emit();
    this.location.back();
  }
}
