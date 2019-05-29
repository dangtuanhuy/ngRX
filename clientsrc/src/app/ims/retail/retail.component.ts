import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-retail',
  templateUrl: './retail.component.html',
  styleUrls: ['./retail.component.scss']
})
export class RetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.href = environment.app.retail.url;
  }

}
