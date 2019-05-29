import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAllocationTransactionComponent } from './submit-allocation-transaction.component';

describe('SubmitAllocationTransactionComponent', () => {
  let component: SubmitAllocationTransactionComponent;
  let fixture: ComponentFixture<SubmitAllocationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAllocationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAllocationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
