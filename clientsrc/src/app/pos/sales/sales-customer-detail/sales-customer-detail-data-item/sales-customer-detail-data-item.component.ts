import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sales-customer-detail-data-item',
  templateUrl: './sales-customer-detail-data-item.component.html',
  styleUrls: ['./sales-customer-detail-data-item.component.scss']
})
export class SalesCustomerDetailDataItemComponent implements OnInit {
  @Input() title = '';
  @Input() value = '';

  constructor() { }

  ngOnInit() {
  }

}
