import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCustomerDetailDataItemComponent } from './sales-customer-detail-data-item.component';

describe('MainCustomerDetailDataItemComponent', () => {
  let component: SalesCustomerDetailDataItemComponent;
  let fixture: ComponentFixture<SalesCustomerDetailDataItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCustomerDetailDataItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCustomerDetailDataItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
