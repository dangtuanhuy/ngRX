import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGoodsInwardComponent } from './detail-goods-inward.component';

describe('DetailGoodsInwardComponent', () => {
  let component: DetailGoodsInwardComponent;
  let fixture: ComponentFixture<DetailGoodsInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailGoodsInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGoodsInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
