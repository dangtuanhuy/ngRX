import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTransferInComponent } from './filter-transfer-in.component';

describe('FilterTransferInComponent', () => {
  let component: FilterTransferInComponent;
  let fixture: ComponentFixture<FilterTransferInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterTransferInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterTransferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
