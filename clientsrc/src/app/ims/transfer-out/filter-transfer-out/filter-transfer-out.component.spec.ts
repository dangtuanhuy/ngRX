import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTransferOutComponent } from './filter-transfer-out.component';

describe('FilterTransferOutComponent', () => {
  let component: FilterTransferOutComponent;
  let fixture: ComponentFixture<FilterTransferOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTransferOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTransferOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
