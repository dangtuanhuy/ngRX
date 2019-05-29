import { Component, OnInit } from '@angular/core';
import { CommonConstants } from 'src/app/pos/shared/constants/common.constant';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/pos/shared/services/customer.service';
import { Customer } from 'src/app/pos/shared/models/customer';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  public title = 'Customer detail';
  public defaultPage = '';
  public pageWidth = `${CommonConstants.contentPageWidth}px`;
  public customerId = '';
  public customer: Customer = new Customer();
  constructor(private route: ActivatedRoute,
    private customerService: CustomerService) { }

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('customerId');
    this.customerService.getById(this.customerId).subscribe(data => {
      if (data) {
        this.customer = data;
      }
    });
  }
}
