import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferInComponent } from './add-transfer-in.component';

describe('AddTransferInComponent', () => {
  let component: AddTransferInComponent;
  let fixture: ComponentFixture<AddTransferInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransferInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
