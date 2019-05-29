import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRequestAddComponent } from './stock-request-add.component';

describe('StockRequestAddComponent', () => {
  let component: StockRequestAddComponent;
  let fixture: ComponentFixture<StockRequestAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockRequestAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockRequestAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
