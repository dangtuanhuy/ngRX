import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsReturnsComponent } from './goods-returns.component';

describe('GoodsReturnsComponent', () => {
  let component: GoodsReturnsComponent;
  let fixture: ComponentFixture<GoodsReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
