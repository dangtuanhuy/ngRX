import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupOrderDetailComponent } from './pickup-order-detail.component';

describe('PickupOrderDetailComponent', () => {
  let component: PickupOrderDetailComponent;
  let fixture: ComponentFixture<PickupOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupOrderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
