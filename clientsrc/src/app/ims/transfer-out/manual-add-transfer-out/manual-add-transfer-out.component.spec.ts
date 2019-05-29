import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAddTransferOutComponent } from './manual-add-transfer-out.component';

describe('ManualAddTransferOutComponent', () => {
  let component: ManualAddTransferOutComponent;
  let fixture: ComponentFixture<ManualAddTransferOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAddTransferOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAddTransferOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
