import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-big-button',
  templateUrl: './big-button.component.html',
  styleUrls: ['./big-button.component.scss']
})
export class BigButtonComponent implements OnInit {
  @Input() id = '';
  @Input() width = '';
  @Input() height = '';
  @Input() colspan = 1;
  @Input() backgroundColor = '';
  @Input() textColor = '';
  @Input() fontSize = '';
  @Input() title = '';
  @Input() caption = '';
  @Input() shortKey = '';

  public titleHeight = '100%';

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClick = new EventEmitter<any>();

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    if (this.caption) {
      this.titleHeight = "80%";
    }
  }

  public onClickButton() {
    this.onClick.emit(this.id);
  }
}
