import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTransferOutComponent } from './detail-transfer-out.component';

describe('DetailTransferOutComponent', () => {
  let component: DetailTransferOutComponent;
  let fixture: ComponentFixture<DetailTransferOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTransferOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTransferOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
