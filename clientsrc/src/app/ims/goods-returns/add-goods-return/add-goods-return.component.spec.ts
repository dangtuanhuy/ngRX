import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoodsReturnComponent } from './add-goods-return.component';

describe('AddGoodsReturnComponent', () => {
  let component: AddGoodsReturnComponent;
  let fixture: ComponentFixture<AddGoodsReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoodsReturnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoodsReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
