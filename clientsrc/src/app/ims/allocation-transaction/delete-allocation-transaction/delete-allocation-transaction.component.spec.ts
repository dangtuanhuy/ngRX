import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllocationTransactionComponent } from './delete-allocation-transaction.component';

describe('DeleteAllocationTransactionComponent', () => {
  let component: DeleteAllocationTransactionComponent;
  let fixture: ComponentFixture<DeleteAllocationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAllocationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAllocationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
