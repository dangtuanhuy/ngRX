import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoodsInwardComponent } from './add-goods-inward.component';

describe('AddGoodsInwardComponent', () => {
  let component: AddGoodsInwardComponent;
  let fixture: ComponentFixture<AddGoodsInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoodsInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoodsInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
