import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAllocationTransactionComponent } from './update-allocation-transaction.component';

describe('UpdateAllocationTransactionComponent', () => {
  let component: UpdateAllocationTransactionComponent;
  let fixture: ComponentFixture<UpdateAllocationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateAllocationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAllocationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
