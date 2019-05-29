import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransferOutComponent } from './add-transfer-out.component';

describe('AddTransferOutComponent', () => {
  let component: AddTransferOutComponent;
  let fixture: ComponentFixture<AddTransferOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransferOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransferOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
