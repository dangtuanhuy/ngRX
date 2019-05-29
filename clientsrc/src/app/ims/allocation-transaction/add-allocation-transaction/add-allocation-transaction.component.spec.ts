import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllocationTransactionComponent } from './add-allocation-transaction.component';

describe('AddAllocationTransactionComponent', () => {
  let component: AddAllocationTransactionComponent;
  let fixture: ComponentFixture<AddAllocationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAllocationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllocationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
