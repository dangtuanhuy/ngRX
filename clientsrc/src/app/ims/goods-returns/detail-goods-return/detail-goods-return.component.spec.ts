import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailGoodsReturnComponent } from './detail-goods-return.component';

describe('DetailGoodsReturnComponent', () => {
  let component: DetailGoodsReturnComponent;
  let fixture: ComponentFixture<DetailGoodsReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailGoodsReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailGoodsReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
