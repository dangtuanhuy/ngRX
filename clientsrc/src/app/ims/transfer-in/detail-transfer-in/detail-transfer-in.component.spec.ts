import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTransferInComponent } from './detail-transfer-in.component';

describe('DetailTransferInComponent', () => {
  let component: DetailTransferInComponent;
  let fixture: ComponentFixture<DetailTransferInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailTransferInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailTransferInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
