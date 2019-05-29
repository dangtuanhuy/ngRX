import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationTransactionComponent } from './allocation-transaction.component';

describe('AllocationTransactionComponent', () => {
  let component: AllocationTransactionComponent;
  let fixture: ComponentFixture<AllocationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
