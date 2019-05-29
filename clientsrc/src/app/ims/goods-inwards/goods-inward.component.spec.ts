import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsInwardsComponent } from './goods-inward.component';

describe('AllocationsComponent', () => {
  let component: GoodsInwardsComponent;
  let fixture: ComponentFixture<GoodsInwardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsInwardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsInwardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
